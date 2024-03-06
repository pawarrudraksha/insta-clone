import React from 'react'
import styles from '../../styles/messages/chatDetails.module.css'
import Checkbox from '../miscellaneous/Checkbox'
import { Link } from 'react-router-dom'
import { accountData } from '../../data/sampleAccount'
import UserProfileItem from './miscellaneous/UserProfileItem'

const ChatDetails:React.FC= () => {
  return (
    <div className={styles.chatDetailsContainer}>
      <div className={styles.chatDetailsHeader}>
        <p className={styles.chatDetailsHeaderTitle}>Details</p>
        <div className={styles.chatDetailsHeaderMuteContainer}>
          <p>Mute messages</p>
          <Checkbox value={false} setValue={()=>{}} name='Mute'/>
        </div>
      </div>
      <div className={styles.chatDetailsInfo}>
        <p>Members</p>
        <div className={styles.chatDetailsMembers}>
          <Link to={`/${accountData.username}`} className={styles.chatDetailMemberWrapper}>
          <UserProfileItem/>
          </Link>
        </div>
      </div>
        <div className={styles.chatDetailsbtns}>
          <button>Report</button>
          <button>Block</button>
          <button>Delete Chat</button>
        </div>
    </div>
  )
}

export default ChatDetails