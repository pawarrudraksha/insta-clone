import React, { useEffect, useState } from 'react'
import styles from '../../styles/messages/chatsSidebar.module.css'
import { BiChevronDown } from 'react-icons/bi'
import { PiNotePencilDuotone } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import SidebarChatItem from './sidebar/SidebarChatItem'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {  getUserChats, toggleNewMessageModal } from '../../app/features/messagesSlice'
import { selectCurrentUser } from '../../app/features/authSlice'

export interface UserChatType{
  updatedAt:string;
  isGroupChat:boolean;
  chatName:string;
  latestMessage:{
    _id:string;
    message:{
      type:string;
      content:string;
    }
  },
  _id:string;
  userInfo:{_id:string;username:string,profilePic?:string}[]
}
const ChatsSidebar:React.FC= () => {
  const dispatch=useAppDispatch()
  const currentUser=useAppSelector(selectCurrentUser)
  const [userChats,setUserChats]=useState<UserChatType[]>([])
  useEffect(()=>{
    if(currentUser?._id){
      const fetchUserChats=async()=>{
        const results=await dispatch(getUserChats())
        console.log(results?.payload?.data);
        setUserChats(results?.payload?.data);
      }
      fetchUserChats()
    }
  },[currentUser?._id])
  return (
    <div className={styles.chatsSidebarWrapper}>
      <div className={styles.chatsSidebarHeader}>
        <div className={styles.chatsSidebarHeaderUsernameContainer}>
          <p>{currentUser?.username}</p>
          <BiChevronDown/>
        </div>
        <PiNotePencilDuotone onClick={()=>dispatch(toggleNewMessageModal())}/>
      </div>
      <div className={styles.chatsSidebarTabs}>
        <p>Messages</p>
        <Link to="/">Requests</Link>
      </div>
      <div className={styles.chatsSidebarChatItems}>
        {
          userChats && userChats?.length>0 &&
          userChats?.map((item,index)=>(
            <SidebarChatItem chatInfo={item} key={index}/>
          ))
        }        
      </div>
    </div>
  )
}

export default ChatsSidebar