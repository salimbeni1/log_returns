
import {useState} from 'react'
import GraphApp from '../GraphApp'

import axios from 'axios';


export default function ConnectedGraphApp() {

  const [serverUrl, setServerUrl] = useState("http://127.0.0.1:8000/")
  const [jsonsData, setJsonsData] = useState( { } )
  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)

  /* LOAD DATA FROM SERVER */
  if (dataIsNotLoaded) {
    axios.get(serverUrl).then(jsons => {
      console.log(" FETCH COMPLETED ")
      setJsonsData(jsons.data)
      setDataIsNotLoaded(false)
      return  <GraphApp json_data={jsonsData}/>
    }).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  } 

  return  (dataIsNotLoaded) ? <h1> LOADING ... </h1> :  <GraphApp json_data={jsonsData['all']}/> 
}