import React from 'react'
import styles from '../styles/home.module.css'
import AccountDetail from './AccountDetail'

const Home:React.FC = () => {
  return (
    <div className={styles.home}>
      <AccountDetail/>
    </div>
  )
}

export default Home