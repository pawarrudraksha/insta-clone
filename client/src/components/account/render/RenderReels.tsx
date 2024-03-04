import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'

const RenderReels=()=> {
  return (
    <div className={styles.accountReelsContent}>
    {
      accountData.reels.map((post, index) => (
        <div className={styles.accountPost}  key={index} >
          <PostItem 
            key={index} 
            item={{type:"video",showReelIcon:false, ...post }} 
          />
        </div>
      ))
    }
    
    </div>
    )
      
}

export default RenderReels