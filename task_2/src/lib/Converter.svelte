<script lang="ts">
  import { exchangeRateApi } from "../api/exchangeRateApi";
  import { onMount } from "svelte";

  const inputData = {
    firstField: "",
    secondField: "",
  }

  const currencies = {
    firstCurrency: {
      name: "",
      rates: {},
    },
    secondCurrency: {
      name: "",
      rates: {},
    },
  }

  let currenciesList = ["USD"]

  onMount(() => {
    exchangeRateApi.getCurrencyRate("USD")
      .then((currenciesData) => {
        currencies.firstCurrency.name = currenciesData["base_code"]
        currencies.firstCurrency.rates = currenciesData["conversion_rates"]

        currencies.secondCurrency.name = currenciesData["base_code"]
        currencies.secondCurrency.rates = currenciesData["conversion_rates"]

        currenciesList = Object.keys(currenciesData["conversion_rates"])
      })
      .catch((err) => {
        throw Error(`Ошибка! ${err.code}`)
      })
  })

  function handleCalculations(currencyInputId) {
    if(currencyInputId === "firstField") {
      inputData["secondField"] = (Number(inputData["firstField"]) * Number(currencies["firstCurrency"].rates[currencies["secondCurrency"].name])).toString()
    } else if(currencyInputId === "secondField") {
      inputData["firstField"] = (Number(inputData["secondField"]) / Number(currencies["firstCurrency"].rates[currencies["secondCurrency"].name])).toString()
    }
  }

  function handleInputCurrency(evt: InputEvent) {
    inputData[evt.target.id] = evt.target.value

    handleCalculations(evt.target.id)
  }

  function handleSelectCurrency(evt: InputEvent) {
    currencies[evt.target.id].name = evt.target.value

    if(evt.target.id === "firstCurrency") {
      exchangeRateApi.getCurrencyRate(evt.target.value)
        .then((currencyData) => {
          currencies[evt.target.id].rates = currencyData["conversion_rates"]
        })
        .then(() => {
          handleCalculations("firstField")
        })
    } else {
      handleCalculations("firstField")
    }
  }
</script>

<section class="currency-calculator">
  <div class="currency">
    <select class="currency-select input" id="firstCurrency" on:change={handleSelectCurrency}>
      {#each currenciesList as item}
        <option value={item}>{item}</option>
      {/each}
    </select>

    <input class="currency__input input" id="firstField" value={inputData.firstField}  type="number" placeholder="Введите количество" on:input={handleInputCurrency}>
  </div>

  <div class="currency">
    <select class="currency-select input" id="secondCurrency" on:change={handleSelectCurrency}>
      {#each currenciesList as item}
        <option value={item}>{item}</option>
      {/each}
    </select>

    <input class="currency__input input" id="secondField" value={inputData.secondField} type="number" placeholder="Введите количество" on:input={handleInputCurrency}>
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
