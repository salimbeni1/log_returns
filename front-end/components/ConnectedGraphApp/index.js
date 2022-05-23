
import {useState, useEffect} from 'react'
import LiveGraphApp from '../LiveGraphApp'

import { getServerPath } from '../../utils/utils';
import { LoadingGraphApp } from '../LoadingGraphApp';


export default function ConnectedGraphApp() {

  const [jsonsData, setJsonsData] = useState( { 
    json_data: {},
    dataIsNotLoaded: true,
    firstLoad: true
  });
  const [graphLayout, setGraphLayout] = useState ( 'cola_layout' )
  const [graphDataType, setGraphDataType] = useState ( 'MST' )

  const { json_data, dataIsNotLoaded, firstLoad } = jsonsData;
  


  /* LOAD DATA FROM SERVER */
  const fetchData = async () => {
    const response = await fetch(getServerPath() + 'api/all_opt')
    const data = await response.json();
    console.log("SUCCES LOAD FROM: " + getServerPath() + 'api/all_opt')
    setJsonsData({json_data:data,
      dataIsNotLoaded: false,
      firstLoad: false
    });
  }

  if (firstLoad) {
    fetchData();
  }


  function reFetchData() {
    fetchData(getServerPath() + 'api/')
  }
 
  
  
  return  (dataIsNotLoaded) ? <LoadingGraphApp/> :  <LiveGraphApp layout={graphLayout} data_type={graphDataType} json_data={json_data} reload_data={() => reFetchData()} change_layout={(layout_) => changeLayout(layout_)}/> 
}
