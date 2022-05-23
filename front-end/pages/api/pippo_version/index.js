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
    'LTC/USD'/*,
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
    'EUR/USD'*/
  ]

  const N = pair.length
  var x = new Array( N )

  for ( var i = 0; i < N; i++ ) {

    var pair_i = await client.getHistoricalPrices(
      {"market_name":pair[i],
      "resolution":"300",
      "limit":"100",
      "start_time": start_date.toString(),
      "end_time": end_date.toString()}
      )
    

    var arr = pair_i.result.map(function (val, idx){
      
    if (idx != 0){
        
      var el1 = pair_i.result[idx-1]
      var log_ret = Math.log(val.close/el1.close)
/*
      if ( isNaN(log_ret) ) {
        console.log("NAN IN :  " + pair[i])
      }
      */
    
      return log_ret
      }
    return 0})
/*
    if ('DOGE/BTC' === pair[i]){
      console.log(arr +  "      " + pair[i])
    } */

    //console.log(arr.length+ " " + pair[i])
    
    x[i] = arr.slice(1)
  }
  var matrix = pcorr(x);
/*
  matrix.forEach((element1,idx1) => {
    element1.forEach((element2,idx2) =>{
      if (isNaN(element2) ) {
        console.log("NAN IN :  " + pair[idx2] + pair[idx1] + idx2 + idx2 )
      }
    }   
  )})*/

  matrix = matrix.map(row =>
    row.map(element =>
      Math.sqrt(2*(1-element))
    )
  )

  var g = new jsgraphs.WeightedGraph(N*N);

  matrix.forEach((element1,idx1) => {
    element1.forEach((element2,idx2) =>{
      g.addEdge(new jsgraphs.Edge(idx1, idx2, element2))
    }   
  )})
  
  var kruskal = new jsgraphs.KruskalMST(g); 
  var mst = kruskal.mst;

  var dict = { }

  var nodes = []
  for ( var i = 0; i < N; i++ ) {
    nodes.push({data: {
      id: String(i),
      label: pair[i],
      sector: "Blockchain"}})
  }
  dict['nodes'] = nodes

  var edges = []
  for(var i=0; i < mst.length; ++i) {
    var e = mst[i];
    var v = e.either();
    var w = e.other(v);
    edges.push({data: {
      id: 'link_' + i,
      source: String(v),
      target: String(w),
      value: e.weight}})
  }
  dict['edges'] = edges

  dict['date'] = new Date().toLocaleDateString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) 


  var result = {all: [ dict ]}

  console.log("--- >" + JSON.stringify(result)[0])

  res.status(200).json(result)
}
