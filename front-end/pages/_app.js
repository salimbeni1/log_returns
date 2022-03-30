
import '../styles/globals.css'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return <div className={styles.ctn}>

    <header className={styles.header}>
      <h1>LOG RETURNS</h1> 
      <Link href='/'> preview </Link>
      <Link href='/theproject'> the project </Link>
      <Link href='/connectedgraph'> real time monitor </Link>
      <Link href='/about'> about us </Link>
    </header>

    <div className={styles.app}>
      <Component {...pageProps} />
    </div>
  
  </div>
}

export default MyApp
