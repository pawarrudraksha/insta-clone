import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'

const RenderReels=()=> {
  return (
    <div className={styles.accountReelsContent}>
    {
      accountData.reels.map((post, index) => (
        <PostItem 
          key={index} 
          item={{type:"reel",showReelIcon:false, ...post }} 
        />
      ))
    }
    
    </div>
    )
      
}

export default RenderReels