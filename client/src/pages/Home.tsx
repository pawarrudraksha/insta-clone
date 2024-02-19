import React from 'react'
import styles from '../styles/home/home.module.css'
import HomeStories from '../components/home/HomeStories'
import HomeProfileAndSuggestions from '../components/home/HomeProfileAndSuggestions'
import HomePosts from '../components/home/miscellaneous/HomePosts'
import AccountHighlight from '../components/account/AccountHighlight'

const Home:React.FC = () => {
  return (
    <div className={styles.home}>
      <div>
        <HomeStories/>
        <HomePosts/>
      </div>
      <HomeProfileAndSuggestions/>  
    </div>
  )
}

export default Home