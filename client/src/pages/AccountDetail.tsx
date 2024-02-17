import React from 'react'
import styles from '../styles/account/accountDetail.module.css'
import AccountHeader from '../components/account/AccountHeader'
import AccountHighlight from '../components/account/AccountHighlight'
import AccountPosts from '../components/account/AccountPosts'

const AccountDetail:React.FC=()=> {
  return (
    <div className={styles.accountDetailPage}>
      <div className={styles.accountDetailContainer}>
        <AccountHeader/>
        <AccountHighlight/>
        <AccountPosts/>
      </div>
    </div>
  )
}

export default AccountDetail