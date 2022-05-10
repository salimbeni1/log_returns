import { useState } from 'react'
import GraphApp from '../components/GraphApp'
import { LoadingGraphApp } from '../components/LoadingGraphApp'
import { getServerPath } from '../utils/utils'

export default function Home() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  if (firstLoad) {
    fetchData('/data/MST/MST.json')
    setFirstLoad(false)
  }

  function fetchData(url) {
    fetch( getServerPath() + url ).then(data => data.json().then(jsn => {
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
        fetchData('/data/MST/MST.json')
        break

      case 'MST_p1': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_q_0.json')
        break

      case 'MST_p2': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_q_1.json')
        break

      case 'MST_p3': // minimum spanning tree
        setGraphDataType(jsonType)
        fetchData('/data/MST/MST_q_2.json')
        break

      case 'FCT_q0': // fully connected with threshold 0.6
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_q0.json')
        break
      case 'FCT_q1': // fully connected with threshold 0.7
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_q1.json')
        break
      case 'FCT_q2': // fully connected with threshold 0.8
        setGraphDataType(jsonType)
        fetchData('/data/FCT/FCT_q2.json')
        break
      
      default:
        fetchData('/data/MST/MST.json')
    }
  }

  function changeLayout(layoutType) {
    setGraphLayout(layoutType)
  }
  
  return  (dataIsNotLoaded) ? <LoadingGraphApp/>  : <GraphApp layout={graphLayout} data_type={graphDataType} json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)} change_layout={(layout_) => changeLayout(layout_)}/> 
}
