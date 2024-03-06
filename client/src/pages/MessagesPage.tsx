import React from 'react'
import Chat from '../components/messages/Chat'
import ChatsSidebar from '../components/messages/ChatsSidebar'
import InitialChat from '../components/messages/miscellaneous/InitialChat'
import styles from '../styles/messages/messagesPage.module.css'

const MessagesPage:React.FC= () => {
  return (
    <div className={styles.messagesPageWrapper}>
        <ChatsSidebar/>
        <Chat/>
        {/* <InitialChat/> */}
    </div>
  )
}

export default MessagesPage