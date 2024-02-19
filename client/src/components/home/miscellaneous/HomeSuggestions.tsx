import React from 'react'
import HomeSuggestionCard from './HomeSuggestionCard'
import styles from '../../../styles/home/homeSuggestions.module.css'
import HomeFooter from './HomeFooter'

const HomeSuggestions:React.FC = () => {
  return (
    <div className={styles.homeSuggestionsContainer}>
      <div className={styles.homeSuggestionHeader}>
        <HomeSuggestionCard isSelf/>
      </div>
      <div className={styles.homeSuggestionsContent}>
        <div className={styles.homeSuggestionsContentHeader}>
          <p className={styles.homeSuggestionsContentHeaderTitle}>Suggested for you</p>
          <p className={styles.homeSuggestionsContentHeaderBtn}>See All</p>
        </div>
        <div className={styles.homeSuggestionsCards}>
          <HomeSuggestionCard/>
          <HomeSuggestionCard/>
          <HomeSuggestionCard/>
          <HomeSuggestionCard/>
          <HomeSuggestionCard/>
        </div>
      </div>
      <HomeFooter/>
    </div>
  )
}

export default HomeSuggestions