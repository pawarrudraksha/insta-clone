import React from 'react'
import styles from '../styles/account/accountDetail.module.css'
import AccountHeader from '../components/account/AccountHeader'
import AccountHighlight from '../components/account/AccountHighlight'
import AccountPosts from '../components/account/AccountPosts'
import { useAppSelector } from '../app/hooks'
import { selectIsPostModalOpen } from '../app/features/viewPostSlice'


const AccountDetail:React.FC=()=> {
  const isPostModalOpen = useAppSelector(selectIsPostModalOpen);
  return (
    <div className={`${styles.accountDetailPage} ${isPostModalOpen && styles.accountDetailActOverlay}`}>
      <div className={styles.accountDetailContainer}>
        <AccountHeader/>
        <AccountHighlight/>
        <AccountPosts/>
      </div>
    </div>
  )
}

export default AccountDetail