
import { useState , useEffect } from 'react'
import LiveGraphApp from '../components/LiveGraphApp'
import styles from '../styles/Home.module.scss'
import { LoadingGraphApp } from '../components/LoadingGraphApp'



export default function Home() {

  const [wait, setWait] = useState(true)

  const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(async () => {
    await delay(2000);
    setWait(false)
    return () => { }
  })
  

  return (wait) ? <LoadingGraphApp/> : <LiveGraphApp/>
     
}