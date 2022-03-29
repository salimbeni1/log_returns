import styles from '../styles/Home.module.scss'

import {useEffect, useRef, useState} from 'react'
import GraphApp from '../components/GraphApp'
import ConnectedGraphApp from '../components/ConnectedGraphApp'
import { AboutUs } from '../components/AboutUs'
import { TheProject } from '../components/TheProject'



export default function Home() {

    const [selected_window, setSelected_window] = useState(0)


  return (
    <div className={styles.ctn}>

      <header className={styles.header}>
         <h1>LOG RETURNS</h1> 
         <div className={styles.btn} onClick={() => setSelected_window(0)}> preview </div>
         <div className={styles.btn} onClick={() => setSelected_window(1)}> the project </div>
         <div className={styles.btn} onClick={() => setSelected_window(2)}> real time monitor </div>
         <div className={styles.btn} onClick={() => setSelected_window(3)}> about us </div>
      </header>


      <div className={styles.app}>

        {selected_window === 0 ? <GraphApp/>: <></>}

        {selected_window === 1 ? <TheProject/>: <></>}

        {selected_window === 2 ? <ConnectedGraphApp/>: <></>}

        {selected_window === 3 ? <AboutUs/>: <></>}

      </div>
      

    </div>
  )
}
