import React, { useEffect, useState } from 'react'
import { GoChevronLeft } from 'react-icons/go'
import styles from '../../styles/notification/notificationRequestsModal.module.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { acceptFollowRequest, deleteFollowRequest, getFollowRequests } from '../../app/features/appSlice'
import { selectCurrentUser } from '../../app/features/authSlice'
import { defaultProfilePic } from '../../data/common'
import { toggleNotificationModal, toggleNotificationRequestsModal } from '../../app/features/notificationSlice'

interface RequestType{
  _id:string;
  follower:{
    name:string;
    username:string;
    profilePic:string,
    _id:string
  },
  updatedAt:string;
}
const NotificationRequestsModal:React.FC= () => {
  const [page,setPage]=useState<number>(1)
  const [followRequests,setFollowRequests]=useState<RequestType[]>([])
  const currentUser=useAppSelector(selectCurrentUser)
  const dispatch=useAppDispatch()
  const handleBack=()=>{
    dispatch(toggleNotificationRequestsModal())
    dispatch(toggleNotificationModal())
  }
  useEffect(()=>{
    if(currentUser?._id){
      const fetchRequests=async()=>{
        const result=await dispatch(getFollowRequests({page}))
        setFollowRequests(result?.payload?.data);
        
      }
      fetchRequests()
    }
  },[dispatch,page,currentUser?._id])
  const handleAcceptRequest=(followDocId:string)=>{
    dispatch(acceptFollowRequest(followDocId))
  }
  const handleDeleteRequest=(followDocId:string)=>{
    dispatch(deleteFollowRequest(followDocId))
  }
  return (
    <div className={styles.notificationRequestsModalContainer}>
        <div className={styles.notificationRequestHeader}>
          <GoChevronLeft onClick={handleBack}/>
          <p>Follow Requests</p>
        </div>
        <div className={styles.notificationRequestsWrapper}>
          {
            followRequests && followRequests?.length>0 &&
            followRequests?.map((item,index)=>(
              <div className={styles.notificationRequest} key={index}>
                <img src={item?.follower?.profilePic || defaultProfilePic} alt="" />
                <div className={styles.notificationRequestContent}>
                  <div className={styles.notificationRequestInfo}>
                    <p>{item?.follower?.username}</p>
                    <p>{item?.follower?.name}</p>
                  </div>
                  <div className={styles.notificationRequestBtns}>
                    <button className={styles.notificationReqConfirmBtn} onClick={()=>handleAcceptRequest(item?._id)}>Confirm</button>
                    <button className={styles.notificationReqDeleteBtn} onClick={()=>handleDeleteRequest(item?._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          }
          {
            (followRequests?.length<0 || !followRequests ) && 
            <div className={styles.notificationRequest}>You currently have no pending follow requests</div>
          }
        </div>
        {/* <div className={styles.notificationSuggestionWrapper}>
          <p>Suggested for you</p>
          
        </div> */}
    </div>
  )
}

export default NotificationRequestsModal