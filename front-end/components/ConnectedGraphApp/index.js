
import {useState} from 'react'
import GraphApp from '../GraphApp'

import axios from 'axios';
import { LoadingGraphApp } from '../LoadingGraphApp';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  /* LOAD DATA FROM SERVER */
  if (firstLoad) {
    fetchData('http://127.0.0.1:8000/mst')
    setFirstLoad(false)
  }

  function fetchData(url) {
    axios.get(url).then(jsons => {
      setJsonsData(jsons.data)
      setFirstLoad(false)
      setDataIsNotLoaded(false)
      console.log("SUCCESS: server fetch from " + url)
    }).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }


  function reFetchData(jsonType) {
    setDataIsNotLoaded(true)

    switch (jsonType) {
      case 'MST':
        setGraphDataType(jsonType)
        fetchData("http://127.0.0.1:8000/mst")
        break
      case 'FCT':
        setGraphDataType(jsonType)
        fetchData("http://127.0.0.1:8000/fct")
        break
      
      default:
        fetchData("http://127.0.0.1:8000/mst")
    }

    
  }

  return  (dataIsNotLoaded) ? <LoadingGraphApp/> :  <GraphApp json_data={jsonsData} data_type={graphDataType} reload_data={(jsonType) => reFetchData(jsonType)}/> 
}