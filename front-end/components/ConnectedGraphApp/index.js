
import {useState} from 'react'
import LiveGraphApp from '../LiveGraphApp'

import { getServerPath } from '../../utils/utils';
import { LoadingGraphApp } from '../LoadingGraphApp';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  /* LOAD DATA FROM SERVER */
  if (firstLoad) {
    fetchData(getServerPath() + 'api/')
    setFirstLoad(false)
  }

  function fetchData(url) {
    fetch(url).then(data => data.json().then(jsons => {
      setJsonsData({'all': [jsons]})
      setFirstLoad(false)
      setDataIsNotLoaded(false)
      console.log("SUCCESS: server fetch from " + url)
    })).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }


  function reFetchData(jsonType) {
    setDataIsNotLoaded(true)

    switch (jsonType) {
      case 'MST':
        setGraphDataType(jsonType)
        fetchData(getServerPath() + 'api/')
        break
      case 'FCT':
        setGraphDataType(jsonType)
        fetchData(getServerPath() + 'api/')
        break
      
      default:
        fetchData(getServerPath() + 'api/')
    }

    
  }

  return  (dataIsNotLoaded) ? <LoadingGraphApp/> :  <LiveGraphApp json_data={jsonsData} data_type={graphDataType} reload_data={(jsonType) => reFetchData(jsonType)}/> 
}