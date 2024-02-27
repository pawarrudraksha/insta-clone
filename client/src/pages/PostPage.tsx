import React from 'react'
import styles from '../styles/posts/postPage.module.css'
import PostCard from '../components/posts/miscellaneous/PostCard'
import { accountData } from '../data/sampleAccount'
import PostItem from '../components/miscellaneous/PostItem'
import Footer from '../components/miscellaneous/Footer'

const PostPage:React.FC = () => {
  return (
    <>
    <div className={styles.postPageContainer}>
      <div className={styles.postPageCardWrapper}>
        <PostCard/>
      </div>
      <div className={styles.morePostContainer}>
        <div className={styles.morePostContainerTitle}>
          <p>More posts from</p> 
          <p>{accountData.username}</p>
        </div>
        <div className={styles.morePosts}>
          {
            accountData.mixed.slice(0,6).map((item,index)=>(
              <PostItem item={{type:item.isPost ? "post":"reel",...item,showReelIcon:true}} key={index}/>
            ))
          }
        </div>
      </div>
      <div className={styles.postPageFooter}>
        <Footer isPost={true}/>
      </div>
    </div>
    </>
  )
}

export default PostPage