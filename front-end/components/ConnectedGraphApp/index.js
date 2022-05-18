
import {useState} from 'react'
import LiveGraphApp from '../LiveGraphApp'

import { getServerPath } from '../../utils/utils';
import { LoadingGraphApp } from '../LoadingGraphApp';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)

  var bool_data = true
  console.log(Object.keys(jsonsData).length)
  if (!(Object.keys(jsonsData).length === 0 )&& dataIsNotLoaded ){
    console.log("bool_data set to false")
    setDataIsNotLoaded(false)
  }
  console.log(bool_data)
  
  const [firstLoad, setFirstLoad] = useState(true)

  /* LOAD DATA FROM SERVER */
  if (firstLoad) {
    fetchData(getServerPath() + 'api/')
    setFirstLoad(false)
  }

  

  async function fetchData(url) {
    await fetch(url).then(data => data.json().then(jsn => {
      console.log("SUCCESSS: server fetch from " + url)
      setJsonsData(jsn)
      
    })).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }


  function reFetchData(jsonType) {
    /*
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
    }*/
 
  }
  console.log("DATA: ")
  console.log(JSON.stringify(jsonsData))
  console.log(dataIsNotLoaded)
  
  return  (dataIsNotLoaded) ? <LoadingGraphApp/> :  <LiveGraphApp layout={graphLayout} data_type={graphDataType} json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)} change_layout={(layout_) => changeLayout(layout_)}/> 
}
