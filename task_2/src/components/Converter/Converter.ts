export type ConverterConfig = {
  defaultFirstCurrency: string,
  defaultSecondCurrency: string,
}

export type InputData = {
  firstInput: Number
  secondInput: Number
}

export type ChosenCurrencies = {
  firstCurrency: String
  secondCurrency: String
}

export enum ChosenCurrenciesEnum {
  first = "firstCurrency",
  second = "secondCurrency",
}

export type RatesArray = Record<string, number>
