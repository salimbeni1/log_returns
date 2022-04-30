import { useState } from 'react'
import GraphApp from '../components/GraphApp'
import { LoadingGraphApp } from '../components/LoadingGraphApp'

export default function Home() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )

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
      case 'MST': // minimum spanning tree
        fetchData('/data/MST/MST_123.json')
        break
      case 'FCT': // fully connected with threshold
        fetchData('/data/FCT/FCT_123.json')
        break
      
      default:
        fetchData('/data/MST/MST_123.json')
    }
  }

  function changeLayout(layoutType) {
    setGraphLayout(layoutType)
  }
  
  return  (dataIsNotLoaded) ? <LoadingGraphApp/>  : <GraphApp layout={graphLayout} json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)} change_layout={(layout_) => changeLayout(layout_)}/> 
}
