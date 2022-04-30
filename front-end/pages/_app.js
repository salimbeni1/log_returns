
import '../styles/globals.css'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return <div className={styles.ctn}>
  
    <Script src="https://www.gstatic.com/charts/loader.js"></Script>

    <header className={styles.header}>
      <h1 style={ {color: "white"}}>Log-Returns</h1> 
      <div style={ {height: "60%", width: "3px", backgroundColor: "var(--font-color-1)" , marginRight:"20px"}}></div> 
      <Link href='/' style={ {backgroundColor: "var(--font-color-1)"}}> Preview </Link>
      <Link href='/connectedgraph'style={ {backgroundColor: "var(--font-color-1)"}}> Real Time Monitor </Link>
      <Link href='/theproject'style={ {backgroundColor: "var(--font-color-1)"}}> The Project </Link>
      <Link href='/about'style={ {backgroundColor: "var(--font-color-1)"}}> About us </Link>
    </header>

    <div className={styles.app}>
      <Component {...pageProps} />
    </div>
  
  </div>
}

export default MyApp
