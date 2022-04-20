


import React from 'react'
import styles from './LoadingGraphApp.module.scss'

export const LoadingGraphApp = () => {
  return <div style={{width:"100%",height:"100%" , display:'flex'}}>
    <div className={styles.cyContainer}> 
        <h2>Loading ...</h2>
    </div>

    <div className={styles.wrapper}>

        <h2>Loading ...</h2>

    </div>
    </div>
}
