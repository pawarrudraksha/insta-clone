import React from 'react'
import styles from '../../../styles/create/successPostModal.module.css'
import { useAppSelector } from '../../../app/hooks'
import { selectPosts } from '../../../app/features/createPostSlice'

const SuccessPostModal:React.FC = () => {
  const posts=useAppSelector(selectPosts)
  const isReel=posts.find((post)=>post.type==='video') && posts.length < 2
  return (
    <div className={styles.successPostModalWrapper}>
      <div className={styles.successPostHeader}>
        {isReel ? "Reel shared" :"Post shared"}
      </div>
      <div className={styles.successPostContent}>
        <img src="assets/done.gif" alt="success" />
        <p>Your {isReel ? "reel":"post"} has been shared</p>
      </div>
    </div>
  )
}

export default SuccessPostModal