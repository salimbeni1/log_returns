
import {useState} from 'react'
import GraphApp from '../GraphApp'

import axios from 'axios';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { } )
  const [firstLoad, setFirstLoad] = useState(true)

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)

  /* LOAD DATA FROM SERVER */
  if (firstLoad) {
    axios.get("http://127.0.0.1:8000/mst").then(jsons => {
      console.log(" FETCH COMPLETED ")
      setJsonsData(jsons.data)
      setFirstLoad(false)
      setDataIsNotLoaded(false)
    }).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }

  function reFetchData(jsonType) {
    setDataIsNotLoaded(true)

    let url = ' '
    switch (jsonType) {
      case 'MST':
        url = "http://127.0.0.1:8000/mst"
        break
      case 'PHY':
        url = "http://127.0.0.1:8000/phy"
        break
      
        default:
          url = "http://127.0.0.1:8000/mst"
    }

    axios.get(url).then(jsons => {
      console.log(" FETCH COMPLETED ")
      setJsonsData(jsons.data)
      setDataIsNotLoaded(false)

    }).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }

  return  (dataIsNotLoaded) ? <h1> LOADING ... </h1> :  <GraphApp json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)}/> 
}