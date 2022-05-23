import { RestClient } from "ftx-api";

import  pcorr  from "compute-pcorr";
import jsgraphs  from "js-graph-algorithms";



/*
  Demonstrations on basic REST API calls
*/
export default async function handler(req , res) {

  const end_date = Date.now() / 1000
  const start_date = end_date - 60000

  
  const key = '';
  const secret = '';

  const client = new RestClient(key, secret);

  const pair = [
    'ETH/USD',
    'BTC/USD',
    'SOL/USD',
    'AVAX/USD',
    'BTC/USDT',
    'LTC/USD',
    'LTC/USDT',
    'DOGE/USD',
    'LINK/USD',
    'SOL/USDT',
    'ETH/USDT',
    'BCH/USDT',
    'AAVE/USD',
    'TRX/USDT',
    'AVAX/USDT',
    'MATIC/USD',
    'BCH/USD',
    'GRT/USD',
    'TRX/USD',
    'AVAX/BTC',
    'SUSHI/USD',
    'USDT/USD',
    'KSHIB/USD',
    'UNI/BTC',
    'UNI/USD',
    'ETH/BTC',
    'DOGE/USDT',
    'BCH/BTC',
    'SUSHI/USDT',
    'NEAR/USD',
    'SOL/BTC',
    'YFI/USD',
    'UNI/USDT',
    'YFI/USDT',
    'LTC/BTC',
    'SHIB/USD',
    'LINK/USDT',
    'LINK/BTC',
    'SUSHI/BTC',
    'DOGE/BTC',
    'AAVE/USDT',
    'MKR/USD',
    'ALGO/USD',
    'BAT/USD',
    'NEAR/USDT',
    'MATIC/BTC',
    'ALGO/USDT',
    'WBTC/USD',
    'PAXG/USD',
    'DAI/USD',
    'EUR/USD'
  ]

  const N = pair.length
  
  
  var x = new Array( N )

  const responses = await Promise.all(pair.map( pair_i => { return client.getHistoricalPrices(
            {"market_name":pair_i,
            "resolution":"300",
            "limit":"100",
            "start_time": start_date.toString(),
            "end_time": end_date.toString()}
            ) } ))


  for ( var i = 0; i < N; i++ ) {

    var arr = responses[i].result.map( (val, idx) => {
        if (idx != 0){ 
          var el1 = responses[i].result[idx-1]
          var log_ret = Math.log(val.close/el1.close)
          return log_ret
        } else return 0} 
      )
      
      x[i] = arr.slice(1)
  }

  res.status(200).json(x)
}
