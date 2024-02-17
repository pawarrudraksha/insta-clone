import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"

function RenderPosts() {
  return (
    <div className={styles.accountPostsContent}>
    {
        accountData.posts.map((post,index)=> (
            <div className={styles.accountsPost} key={index}>
          <img src={post.images[0]} alt="post" />
          </div>
        ))
    }
    
    </div>
    )
      
}

export default RenderPosts