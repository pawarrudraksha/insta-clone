import React from 'react'
import HomeSuggestionCard from './HomeSuggestionCard'
import styles from '../../../styles/home/homeSuggestions.module.css'
import Footer from '../../miscellaneous/Footer'
import { homeSuggestionData } from '../../../data/homeSuggestionData'

const HomeSuggestions:React.FC = () => {
  return (
    <div className={styles.homeSuggestionsContainer}>
      <div className={styles.homeSuggestionHeader}>
        <HomeSuggestionCard isSelf id={0}/>
      </div>
      <div className={styles.homeSuggestionsContent}>
        <div className={styles.homeSuggestionsContentHeader}>
          <p className={styles.homeSuggestionsContentHeaderTitle}>Suggested for you</p>
          <p className={styles.homeSuggestionsContentHeaderBtn}>See All</p>
        </div>
        <div className={styles.homeSuggestionsCards}>
         {
          homeSuggestionData.map((item,index)=>(
            <HomeSuggestionCard key={index}
              id={item.id}
            />
          ))
         }
        </div>
      </div>
      <Footer isPost={false}/>
    </div>
  )
}

export default HomeSuggestions