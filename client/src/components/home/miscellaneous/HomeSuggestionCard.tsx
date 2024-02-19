import React from 'react'
import styles from "../../../styles/home/homeSuggestionCard.module.css"
import { accountData } from '../../../data/sampleAccount'

interface Props{
  isSelf?:boolean
}
const HomeSuggestionCard :React.FC<Props>= ({isSelf}) => {
  return (
    <div className={styles.homeSuggestionCard}>
        <div className={styles.homeSuggestionCardImg}>
          <img src={accountData.profilePic} alt="" />
        </div>
        <div className={styles.homeSuggestionCardContent}>
          <p className={styles.homeSuggestionCardInfoName}>{accountData.username}</p>
         {isSelf ? <p className={styles.homeSuggestionCardInfoIsSelf}>{accountData.name}</p> 
         :<p className={styles.homeSuggestionCardInfo}>Follows you</p>}
        </div>
        <button className={styles.homeSuggestionsFollowBtn}>
          {isSelf?"Switch":"Follow"}
        </button>
    </div>
  )
}

export default HomeSuggestionCard