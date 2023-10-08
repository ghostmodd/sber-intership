<script lang="ts">
  import type { InputData, ChosenCurrencies, ConverterConfig, RatesArray } from "./Converter.ts";
  import { rates, currencies } from "../../utils/store/store";
  import { ChosenCurrenciesEnum } from "./Converter.ts";
  import { exchangeRateApi } from "../../utils/api/exchangeRateApi.tsx";

  // Работа со стором
  /*
    Получаем объект с дефолтными параметрами. Здесь 2 свойства:
      1. defaultFirstCurrency - дефолтное значение первой валюты
      2. defaultSecondCurrency - дефолтное значение второй валюты
  */
  export let config: ConverterConfig

  // Получаем полный список валют
  let currenciesList: string[]
  currencies.subscribe((currencies) => {
    currenciesList = currencies
  })

  // Получаем курс конвертации
  let ratesArray: RatesArray
  rates.subscribe((array) => {
    ratesArray = array
  })

  // Объект для хранения данных инпута. Здесь сырые данные, не отображаемые в DOM
  // Нужны для рассчетов
  const inputData : InputData = {
    firstInput: 0,
    secondInput: 0,
  }

  // Объект для хранения данных
  // Определяем дефолтное значение выбранных валют
  const chosenCurrencies : ChosenCurrencies = {
    firstCurrency: config.defaultFirstCurrency || "",
    secondCurrency: config.defaultSecondCurrency || "",
  }

  // Переменные, отображаемые в инпутах. Реактивно конвертируют валюту исходя из текущего курса
  $: firstInputCalculated = Number(inputData["secondInput"]) / ratesArray[chosenCurrencies[ChosenCurrenciesEnum.second]]
  $: secondInputCalculated = Number(inputData["firstInput"]) * ratesArray[chosenCurrencies[ChosenCurrenciesEnum.second]]

  /*
    Функция нужна для реализации двусторонней конвертации, чтобы можно было конвертировать...
    ...и первую валюту во вторую, и наоборот.

    Если решать проблему через `declarations reactivity`, то будет создаваться циклическая зависимость
  */
  function handleInput(evt: Event) {
    const target = evt.target as HTMLInputElement
    const inputId = target.id as unknown as keyof InputData

    inputData[inputId] = Number(target.value)
  }

  function getNewRates(evt : Event) {
    const target = evt.target as HTMLSelectElement

    exchangeRateApi.getCurrencyRate(target.value)
      .then((currenciesData) => {
        rates.set(currenciesData["conversion_rates"])
      })
      .catch((err : number) => {
        throw Error(`Ошибка! ${err}`)
      })
  }

</script>

<section class="currency-calculator">
  <div class="currency">
    <select class="currency-select input" bind:value={chosenCurrencies.firstCurrency} on:change={getNewRates}>
      {#if !currenciesList}
        <option value={config.defaultFirstCurrency}>{config.defaultFirstCurrency}</option>
      {:else}
        {#each currenciesList as item}
          <option value={item}>{item}</option>
        {/each}
      {/if}
    </select>

    <input class="currency__input input" id="firstInput" type="number" placeholder="Введите количество" on:input={handleInput} value={firstInputCalculated}>
  </div>

  <div class="currency">
    <select class="currency-select input" bind:value={chosenCurrencies.secondCurrency}>
      {#if !currenciesList}
        <option value={config.defaultSecondCurrency}>{config.defaultSecondCurrency}</option>
      {:else}
        {#each currenciesList as item}
          <option value={item}>{item}</option>
        {/each}
      {/if}
    </select>

    <input class="currency__input input" id="secondInput" type="number" placeholder="Введите количество" on:input={handleInput} value={secondInputCalculated}>
  </div>
</section>

<style>
  .currency-calculator {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .currency {
    display: flex;
    gap: 10px;
  }

  .currency__input {
    width: 70%;
  }

  .input {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
</style>
