import styles from '../styles/Home.module.scss'

import {useEffect, useRef} from 'react'
import GraphApp from '../components/GraphApp'



export default function Home() {


  return (
    <div className={styles.ctn}>

      <header className={styles.header}>
         <h1>LOG RETURNS</h1> 
         <div> the project </div>
         <div> real time monitor </div>
         <div> about us </div>
      </header>


      <div className={styles.app}>
        <GraphApp></GraphApp>
      </div>
      

    </div>
  )
}
