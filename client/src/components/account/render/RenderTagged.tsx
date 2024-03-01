import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'

const RenderTagged:React.FC=()=> {
  return (
    <div className={styles.accountTaggedContent}>
   {
      accountData.mixed.map((post, index) => (
        <div className={styles.accountPost}  key={index} >
        <PostItem 
          key={index} 
          item={{ type: `${post.isPost===true ? `post`:`reel`}`,showReelIcon:true, ...post }} 
  
        />
        </div>
      ))
    }
    
    </div>
    )
      
}

export default RenderTagged