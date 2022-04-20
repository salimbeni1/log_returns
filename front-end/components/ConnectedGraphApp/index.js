
import {useState} from 'react'
import GraphApp from '../GraphApp'

import axios from 'axios';
import { LoadingGraphApp } from '../LoadingGraphApp';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [firstLoad, setFirstLoad] = useState(true)

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)

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
        fetchData("http://127.0.0.1:8000/mst")
        break
      case 'PHY':
        fetchData("http://127.0.0.1:8000/phy")
        break
      
      default:
        fetchData("http://127.0.0.1:8000/mst")
    }

    
  }

  return  (dataIsNotLoaded) ? <LoadingGraphApp/> :  <GraphApp json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)}/> 
}