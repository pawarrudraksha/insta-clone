import React from 'react'
import styles from '../styles/home/home.module.css'
import HomeStories from '../components/home/HomeStories'
import HomeProfileAndSuggestions from '../components/home/HomeProfileAndSuggestions'
import HomePosts from '../components/home/HomePosts'

const Home:React.FC = () => {  
  return (
    <div className={styles.home}>
      <div className={styles.homeFeed}>
        <HomeStories/>
        <HomePosts/>
      </div>
      <HomeProfileAndSuggestions/>  
    </div>
  )
}

export default Home