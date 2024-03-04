import React from 'react'
import HomePost from './miscellaneous/HomePost'
import styles from '../../styles/home/homePosts.module.css'

const HomePosts:React.FC = () => {
  return (
    <div className={styles.homePosts}>
       <HomePost/> 
    </div>
  )
}

export default HomePosts