import React, { useState } from 'react'
import { accountData } from '../../../data/sampleAccount'
import { BsDot } from 'react-icons/bs'
import styles from '../../../styles/messages/sidebarChatItem.module.css'

const SidebarChatItem:React.FC= () => {
  const selected=false;
  return (
    <div className={`${styles.sidebarChatItemContainer} ${selected && styles.selectedChatItem}`}>
        <div className={styles.sidebarChatItemProfilePic}>
          <img src={accountData.profilePic} alt="" />
        </div>
        <div className={styles.sidebarChatItemInfo}>
          <p>{accountData.username}</p>
          <div className={styles.sidebarChatItemLastMsg}>
            <p>{accountData.name} sent an attachment</p>
            <BsDot/>
            <p>16h</p>
          </div>
        </div>
    </div>
  )
}

export default SidebarChatItem