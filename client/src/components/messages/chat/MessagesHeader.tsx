import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import { BsDot } from 'react-icons/bs'
import styles from '../../../styles/messages/messagesHeader.module.css'
import { useNavigate } from 'react-router-dom'

const MessagesHeader:React.FC= () => {
    const navigate=useNavigate()
    const handleViewProfile=()=>{
        navigate(`/${accountData.username}`)
    }
    return (
        <div className={styles.messagesHeader}>
            <img src={accountData.profilePic} alt="" />
            <p>{accountData.name}</p>
            <div className={styles.messagesHeaderUsernameContainer}>
                <p>{accountData.username}</p>
                <BsDot/>
                <p>Instagram</p>
            </div>
            <button onClick={handleViewProfile} className={styles.messagesHeaderBtn}>View profile</button>
        </div>
    )
}

export default MessagesHeader