class ExchangeRateApi {
  private _baseUrl: string
  private _apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this._baseUrl = baseUrl
    this._apiKey = apiKey
  }

  _getError(res: Response) {
    if (!res.ok) {
      return res.status
    }
  }

  _getJSON(res: Response) {
    if (res.ok) {
      return res.json()
    }

    return this._getError(res)
  }

  getCurrencyRate(currency: string) {
    return fetch(`${this._baseUrl}/${this._apiKey}/latest/${currency}`, {
      method: "GET",
    })
      .then((res) => {
        return this._getJSON(res)
      })
  }
}

export const exchangeRateApi = new ExchangeRateApi("https://v6.exchangerate-api.com/v6", "f48a1831213c6e1a60eb93df");
