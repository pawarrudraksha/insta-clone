import React from 'react'
import { accountData } from '../../data/sampleAccount';
import { postData } from '../../data/samplePost';
import styles from '../../styles/notification/notificationItem.module.css'

interface NotificationItemProps{
    isFollow?:boolean;
    isLike?:boolean;
    isFollowRequest?:boolean;
}
const NotificationItem:React.FC<NotificationItemProps>= ({isFollow,isLike,isFollowRequest}) => {
  
  return (
    <div className={styles.notificationItemContainer} >
        <div className={styles.notificationProfilePic}>
        <img src={accountData.profilePic} alt="profile pic" />
        </div>
        <div className={styles.notificationInfo}>
            <p>
                {accountData.username}
                </p>
                <p>
                {isFollow&& " started following you."}
                { isLike &&" liked your photo."}
                {isFollowRequest && " requested to follow you."}
                </p>
            <p className={styles.notificationTime}>16h</p>
            </div>
            <div className={styles.interactedPost}>

            {
                isLike && 
               ( postData.posts[0].type==='image' 
                ?<img src={postData.posts[1].url} alt="" />
                :<video src={postData.posts[1].url}></video>)
            }
            {
                isFollow && 
                <button className={styles.notificationFollowBtn}>Follow</button>
            }
            {
                isFollowRequest && 
                <div className={styles.notificatonFollowReqBtns}>
                <button className={styles.notificationConfirmReqBtn}>Confirm</button>
                <button className={styles.notificationDeleteBtn}>Delete</button>
                </div>
            }
    </div>
                </div>
  )
}

export default NotificationItem