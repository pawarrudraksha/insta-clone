import React from 'react'
import AccountHighlight from '../account/AccountHighlight'
import styles from '../../styles/home/homeStories.module.css'

const HomeStories:React.FC = () => {
  return (
    <div className={styles.homeStories}>
    <AccountHighlight/>
    </div>
  )
}

export default HomeStories