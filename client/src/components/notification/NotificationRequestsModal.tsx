import React from 'react'
import { GoChevronLeft } from 'react-icons/go'
import { accountData } from '../../data/sampleAccount'
import styles from '../../styles/notification/notificationRequestsModal.module.css'
import { useAppDispatch } from '../../app/hooks'
import { toggleNotificationModal, toggleNotificationRequestsModal } from '../../app/features/appSlice'
import HomeSuggestionCard from '../home/miscellaneous/HomeSuggestionCard'

const NotificationRequestsModal:React.FC= () => {
  const dispatch=useAppDispatch()
  const handleBack=()=>{
    dispatch(toggleNotificationRequestsModal())
    dispatch(toggleNotificationModal())
  }
  return (
    <div className={styles.notificationRequestsModalContainer}>
        <div className={styles.notificationRequestHeader}>
          <GoChevronLeft onClick={handleBack}/>
          <p>Follow Requests</p>
        </div>
        <div className={styles.notificationRequestsWrapper}>
          <div className={styles.notificationRequest}>
            <img src={accountData.profilePic} alt="" />
            <div className={styles.notificationRequestContent}>
              <div className={styles.notificationRequestInfo}>
                <p>{accountData.username}</p>
                <p>{accountData.name}</p>
              </div>
              <div className={styles.notificationRequestBtns}>
                <button className={styles.notificationReqConfirmBtn}>Confirm</button>
                <button className={styles.notificationReqDeleteBtn}>Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.notificationSuggestionWrapper}>
          <p>Suggested for you</p>
          
        </div>
    </div>
  )
}

export default NotificationRequestsModal