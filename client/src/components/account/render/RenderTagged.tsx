import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"

function RenderTagged() {
  return (
    <div className={styles.accountTaggedContent}>
    {
        accountData.tagged.map((tagged,index)=> (
            <div className={styles.accountsTagged} key={index}>
                <img src={tagged.images[0]} alt="" />                
            </div>
        ))
    }
    
    </div>
    )
      
}

export default RenderTagged