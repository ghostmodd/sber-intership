<script lang="ts">
  import Converter from "./components/Converter/Converter.svelte";
  import { onMount } from "svelte";
  import { rates, currencies } from "./utils/store/store";
  import {exchangeRateApi} from "./utils/api/exchangeRateApi";
  import type { ConverterConfig } from "./components/Converter/Converter.ts";

  const converterConfig: ConverterConfig = {
    defaultFirstCurrency: "USD",
    defaultSecondCurrency: "RUB",
  }

  onMount(() => {
    exchangeRateApi.getCurrencyRate(converterConfig.defaultFirstCurrency)
      .then((currenciesData) => {
        rates.set(currenciesData["conversion_rates"])
        currencies.set(Object.keys(currenciesData["conversion_rates"]))
      })
      .catch((err : number) => {
        throw Error(`Ошибка! ${err}`)
      })
  })

</script>

<main>
  <h1>Конвертер валют</h1>

  <div class="card">
    <Converter config={converterConfig} />
  </div>
</main>

<style>
</style>
