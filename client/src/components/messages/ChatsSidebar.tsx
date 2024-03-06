import React from 'react'
import styles from '../../styles/messages/chatsSidebar.module.css'
import { accountData } from '../../data/sampleAccount'
import { BiChevronDown } from 'react-icons/bi'
import { PiNotePencilDuotone } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import SidebarChatItem from './sidebar/SidebarChatItem'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {  toggleNewMessageModal } from '../../app/features/messagesSlice'

const ChatsSidebar:React.FC= () => {
  const dispatch=useAppDispatch()
  return (
    <div className={styles.chatsSidebarWrapper}>
      <div className={styles.chatsSidebarHeader}>
        <div className={styles.chatsSidebarHeaderUsernameContainer}>
          <p>{accountData.username}</p>
          <BiChevronDown/>
        </div>
        <PiNotePencilDuotone onClick={()=>dispatch(toggleNewMessageModal())}/>
      </div>
      <div className={styles.chatsSidebarTabs}>
        <p>Messages</p>
        <Link to="/">Requests</Link>
      </div>
      <div className={styles.chatsSidebarChatItems}>
        <SidebarChatItem/>
        <SidebarChatItem/>
        <SidebarChatItem/>
        <SidebarChatItem/>
      </div>
    </div>
  )
}

export default ChatsSidebar