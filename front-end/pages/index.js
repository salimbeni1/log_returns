import { useState } from 'react'
import GraphApp from '../components/GraphApp'
import { LoadingGraphApp } from '../components/LoadingGraphApp'

export default function Home() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  if (firstLoad) {
    fetchData('/data/MST/MST_123.json')
    setFirstLoad(false)
  }

  function fetchData(url) {
    fetch(url).then(data => data.json().then(jsn => {
      setJsonsData(jsn)
      setDataIsNotLoaded(false)
      console.log("SUCCESS: local fetch from " + url)
    }).catch(e => console.log(e)))
  }

  function reFetchData(jsonType) {
    setDataIsNotLoaded(true)

    switch (jsonType) {
      case 'MST_123': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_123.json')
        break

      case 'MST_p1': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_round_p1.json')
        break

      case 'MST_p2': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_round_p2.json')
        break

      case 'MST_p3': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_round_p3.json')
        break

      case 'FCT_0p5': // fully connected with threshold 0.5
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_0p5.json')
        break
      case 'FCT_0p6': // fully connected with threshold 0.6
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_0p6.json')
        break
      case 'FCT_0p7': // fully connected with threshold 0.7
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_0p7.json')
        break
      case 'FCT_0p8': // fully connected with threshold 0.8
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_0p8.json')
        break
      case 'FCT_0p9': // fully connected with threshold 0.9
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_0p9.json')
        break
      
      default:
        fetchData('/data/MST/MST_123.json')
    }
  }

  function changeLayout(layoutType) {
    setGraphLayout(layoutType)
  }
  
  return  (dataIsNotLoaded) ? <LoadingGraphApp/>  : <GraphApp layout={graphLayout} data_type={graphDataType} json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)} change_layout={(layout_) => changeLayout(layout_)}/> 
}
