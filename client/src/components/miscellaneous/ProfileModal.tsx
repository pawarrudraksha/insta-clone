import React, { useEffect } from 'react'
import styles from '../../styles/miscellaneous/profileModal.module.css'
import { accountData } from '../../data/sampleAccount'
import { FiSend } from 'react-icons/fi'
import { openProfileModal } from '../../app/features/appSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface ProfileModalProps {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}
const ProfileModal: React.FC<ProfileModalProps> = ({ onMouseEnter, onMouseLeave }) => {
    const dispatch=useAppDispatch()

  return (
    <div className={styles.profileModalContainer} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
        <div className={styles.profileModalHeader}>
            <div className={styles.profileModalHeaderImage}>
                <img src={accountData.profilePic} alt="" />
            </div>
            <div className={styles.profileModalInfo}>
                <p className={styles.profileModalInfoUsername}>{accountData.username}</p>
                <p className={styles.profileModalInfoName}>{accountData.name}</p>
            </div>
        </div>
        <div className={styles.profileModalAnalytics}>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{accountData.noOfPosts}</p>
                <p>posts</p>
            </div>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{accountData.noOfFollowers}</p>
                <p>followers</p>
            </div>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{accountData.noOfFollowing}</p>
                <p>following</p>
            </div>
        </div>
        <div className={styles.profileModalPosts}>
           {
            accountData.mixed.slice(0,3).map((post,index)=>(
                post.isPost ?
                <img src={post.images[0]} alt="" key={index} />
                :
            <video
             id={`video-${index}`}  
             loop 
             muted
             key={index}
             >
            <source src={post.images[0]} type="video/mp4"   />
            Your browser does not support the video tag.
            </video>              
            ))
           }
        </div>
        <div className={styles.profileModalBtns}>
            <div className={styles.profileModalMessageBtn}>
                <FiSend/>
                <p>Message</p>
            </div>
            <button className={styles.profileModalFollowingBtn}>
                Following
            </button>
        </div>
    </div>
  )
}

export default ProfileModal