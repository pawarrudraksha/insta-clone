import React from 'react'
import styles from '../../styles/notification/notificationModal.module.css'
import NotificationItem from './NotificationItem'
import { accountData } from '../../data/sampleAccount'
import { GoChevronRight, GoDotFill } from 'react-icons/go'
import { useAppDispatch } from '../../app/hooks'
import { toggleNotificationRequestsModal } from '../../app/features/appSlice'

const NotificationModal:React.FC= () => {
  const handlePropogation=(e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation()
  }  
  const dispatch=useAppDispatch()
  return (
    <div className={styles.notificationModalWrapper} onClick={handlePropogation}>
      <p className={styles.notificationModalTitle}>Notifications</p>
      <div className={styles.notificationFollowRequests}>
        <img src={accountData.profilePic} alt="" />
        <div className={styles.notificationFollowReqContent}>
          <div className={styles.notificationFollowReqInfo}>
            <p>Follow request</p>
            <p>{accountData.username}</p>
          </div>
          <div className={styles.notificationSvgs}>
            <GoDotFill  className={styles.notificationDotSvg}/>
            <GoChevronRight className={styles.notificationRightSvg} onClick={()=>dispatch(toggleNotificationRequestsModal())} />
          </div>
        </div>
      </div>
      <div className={styles.notificationsWrapper}>
        <div className={styles.notificationItemWrapper}>
          <p className={styles.notificationTitle}>Today</p>
          <NotificationItem isFollowRequest/>
          <NotificationItem isFollow/>
          <NotificationItem isLike/>
        </div>
        <div className={styles.notificationItemWrapper}>
          <p className={styles.notificationTitle}>This week</p>
          <NotificationItem isLike/>
          <NotificationItem isLike/>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal