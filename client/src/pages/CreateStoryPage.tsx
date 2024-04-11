import React from 'react'
import CreateStoryCard from '../components/story/CreateStoryCard'
import styles from '../styles/story/createStoryPage.module.css'

const CreateStoryPage:React.FC= () => {
  return (
    <div className={styles.createStoryPageContainer}>
      <CreateStoryCard/>
    </div>
  )
}

export default CreateStoryPage