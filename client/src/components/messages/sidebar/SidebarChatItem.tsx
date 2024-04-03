import React, { useState } from 'react'
import { BsDot } from 'react-icons/bs'
import styles from '../../../styles/messages/sidebarChatItem.module.css'
import { UserChatType } from '../ChatsSidebar'
import { useNavigate } from 'react-router-dom'
import { defaultProfilePic } from '../../../data/common'

interface SidebarChatItemProps {
  chatInfo: UserChatType;
}

const SidebarChatItem:React.FC<SidebarChatItemProps>= ({chatInfo}) => {
  const selected=false;
  const navigate=useNavigate()
  const otherUser=chatInfo && !chatInfo?.isGroupChat && chatInfo?.userInfo?.[0]
  const groupUsers=chatInfo && chatInfo?.isGroupChat && chatInfo?.userInfo
  const handleChatClick=()=>{
    navigate(`/direct/t/${chatInfo?._id}`)
  }
  const activeChatId=(window.location.pathname.slice(10));
  
  return (
    <div className={`${styles.sidebarChatItemContainer} ${activeChatId && activeChatId===chatInfo?._id && styles.selectedChatItem}`} onClick={handleChatClick}>
        <div className={styles.sidebarChatItemProfilePic}>
          {otherUser &&<img src={otherUser?.profilePic ? otherUser?.profilePic :defaultProfilePic} alt="" />}
          {groupUsers && groupUsers?.map((item,index)=>(
            <img src={item?.profilePic ? item?.profilePic :defaultProfilePic} alt="" key={index} />
          ))}
        </div>
        <div className={styles.sidebarChatItemInfo}>
          {otherUser && <p>{otherUser?.username}</p>}
          {groupUsers && <p>{groupUsers[0]?.username}</p>}
          {chatInfo?.latestMessage?.message?.type &&<div className={styles.sidebarChatItemLastMsg}>
            {chatInfo?.latestMessage?.message?.type==='text' && <p>{chatInfo?.latestMessage?.message?.content}</p>}
            {chatInfo?.latestMessage?.message?.type===('post'||'reel')&& <p>Attachment sent</p>}
            <BsDot/>
            <p>16h</p>
          </div>}
        </div>
    </div>
  )
}

export default SidebarChatItem