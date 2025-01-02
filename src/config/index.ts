interface Config {
  api: {
    baseUrl: string
    wsUrl: string
    timeout: number
    retries: number
  }
  cache: {
    stockPriceTTL: number
    searchResultsTTL: number
  }
}

const config: Config = {
  api: {
    baseUrl: 'https://openapi.koreainvestment.com:9443',
    wsUrl: 'wss://ops.koreainvestment.com:21000',
    timeout: 5000,
    retries: 3
  },
  cache: {
    stockPriceTTL: 60,  // 60초
    searchResultsTTL: 300  // 5분
  }
}

export default config 