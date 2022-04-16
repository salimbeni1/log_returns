import { useState } from 'react'
import GraphApp from '../components/GraphApp'

export default function Home() {

  const [jsonsData, setJsonsData] = useState( { } )

  const [dataIsNotLoaded, setDataIsNotLoaded] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  if (firstLoad) {
    fetchData('/data/MST/MST_100.json')
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
      case 'MST':
        fetchData('/data/MST/MST_100.json')
        break
      case 'PHY':
        fetchData('/data/PHY/PHY_100.json')
        break
      
      default:
        fetchData('/data/MST/MST_100.json')
    }
  }
  
  return  (dataIsNotLoaded) ? <h1 align="center"> LOADING ... </h1> :  <GraphApp json_data={jsonsData} reload_data={(jsonType) => reFetchData(jsonType)}/> 

}
