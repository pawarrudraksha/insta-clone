import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"

function RenderReels() {
  return (
    <div className={styles.accountReelsContent}>
    {
        accountData.reels.map((reel,index)=> (
            <div className={styles.accountsReel} key={index}>
            <video
             id={`video-${index}`}  
             loop 
             muted
             
             >
            <source src={reel.images[0]} type="video/mp4"   />
            Your browser does not support the video tag.
            </video>          
            </div>
        ))
    }
    
    </div>
    )
      
}

export default RenderReels