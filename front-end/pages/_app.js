
import '../styles/globals.css'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return <div className={styles.ctn}>

    <header className={styles.header}>
      <h1>LOG RETURNS</h1> 
      <Link href='/'> PREVIEW </Link>
      <Link href='/theproject'> THE PROJECT </Link>
      <Link href='/connectedgraph'> REAL TIME MONITOR </Link>
      <Link href='/about'> ABOUT US </Link>
    </header>

    <div className={styles.app}>
      <Component {...pageProps} />
    </div>
  
  </div>
}

export default MyApp
