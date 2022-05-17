import { RestClient } from "ftx-api";

import  pcorr  from "compute-pcorr";
import jsgraphs  from "js-graph-algorithms";

/*
  Demonstrations on basic REST API calls
*/
export default async function handler(req , res) {

  const end_date = Date.now() / 1000
  const start_date = end_date - 300

  
  const key = '';
  const secret = '';

  const client = new RestClient(key, secret);

  const pair = [
    "BTC/USD",
    "ETH/USD",
    "LUNA/USD",
    "SOL/USD",
    "BTC/USDT",
    "LUNA/USDT",
    "ETH/USDT",
    "BNB/USD",
    "SOL/USDT",
    "AVAX/USD",
    "XRP/USD",
    "GMT/USD",
    "DOT/USD",
    "MATIC/USD",
    "APE/USD",
    "BCH/USD",
    "DOGE/USD",
    "AXS/USD",
    "BNB/USDT",
    "FTM/USD",
    "LTC/USD",
    "ATOM/USD",
    "FTT/USD"
  ]
  
  const N = pair.length
  var x = new Array( N )
  for ( var i = 0; i < N; i++ ) {

    var pair_i = await client.getHistoricalPrices(
      {"market_name":pair[i],
      "resolution":"15",
      "limit":"35",
      "start_time": start_date.toString(),
      "end_time": end_date.toString()}
      )
    

    var arr = pair_i.result.map(function (val, idx){
      
      if (idx != 0){
        
      var el1 = pair_i.result[idx-1]
      var log_ret = Math.log(val.close/el1.close)
    
      return log_ret
      }
    return 0})

    x[i] = arr
  }
  var matrix = pcorr(x);

  matrix.map(row =>
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

  var nodes = new Array( N )
  for ( var i = 0; i < N; i++ ) {
    nodes[i] = {'data': {
      'id': i,
       'label': pair[i],
       'sector': 'Energy',
       'industry': 'empty',
       'fullTimeEmp': 'empty'}}
  }
  dict['nodes'] = nodes

  var edges = new Array( mst.length )
  for(var i=0; i < mst.length; ++i) {
    var e = mst[i];
    var v = e.either();
    var w = e.other(v);
    edges[i] = {'data': {
      'id': 'link_' + i,
      'source': v,
      'target': w,
      'value': e.weight}}
  }
  dict['edges'] = edges
  dict['date'] = '2020-10-20'

  res.status(200).json(dict)
}
