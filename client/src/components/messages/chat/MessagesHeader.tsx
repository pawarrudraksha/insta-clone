import React from 'react'
import { BsDot } from 'react-icons/bs'
import styles from '../../../styles/messages/messagesHeader.module.css'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { selectCurrentChatInfo } from '../../../app/features/messagesSlice'
import { selectCurrentUser } from '../../../app/features/authSlice'
import { defaultProfilePic } from '../../../data/common'

const MessagesHeader:React.FC= () => {
    const currentUser=useAppSelector(selectCurrentUser)
    const chatInfo=useAppSelector(selectCurrentChatInfo)
    const chatUser=chatInfo?.users?.length < 3 && chatInfo?.users.find(item => item._id !== currentUser?._id)
    const navigate=useNavigate()
    const handleViewProfile=()=>{
        if(chatUser && chatUser?._id){
            navigate(`/${chatUser?.username}`)
        }
    }    
    return (
        <div className={styles.messagesHeader}>
           {chatUser && <img src={chatUser?.profilePic ? chatUser?.profilePic :defaultProfilePic} alt="" />}
           {chatUser && <p>{chatUser?.name}</p>}
            <div className={styles.messagesHeaderUsernameContainer}>
                {chatUser && <p>{chatUser?.username}</p>}
                <BsDot/>
                <p>Instagram</p>
            </div>
            <button onClick={handleViewProfile} className={styles.messagesHeaderBtn}>View profile</button>
        </div>
    )
}

export default MessagesHeader