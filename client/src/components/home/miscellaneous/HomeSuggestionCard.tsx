import React, { useState } from 'react'
import styles from "../../../styles/home/homeSuggestionCard.module.css"
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { closeSuggestionProfileModal, openSuggestionProfileModal, selectActiveSuggestionProfileModal, selectSuggestionProfileModal, setActiveSuggestionProfileModal } from '../../../app/features/homeSlice'
import ProfileModal from '../../miscellaneous/ProfileModal'
import { SuggestionUser } from './HomeSuggestions'
import { getUserInfo } from '../../../app/features/accountSlice'
import { setProfileModalData } from '../../../app/features/appSlice'
import { selectCurrentUser } from '../../../app/features/authSlice'

interface Props{
  isSelf?:boolean;
  user:SuggestionUser;
}

const HomeSuggestionCard :React.FC<Props>= ({isSelf,user}) => {
  const suggestionProfileModal=useAppSelector(selectSuggestionProfileModal)
  const activeModal=useAppSelector(selectActiveSuggestionProfileModal)
  const [isHovered,setIsHovered]=useState<boolean>(false)
  const currentUser=useAppSelector(selectCurrentUser)
  const dispatch=useAppDispatch()
  const handleMouseEnter = async() => {
    if(user?._id!==currentUser?._id){dispatch(setActiveSuggestionProfileModal(user._id))
    dispatch(openSuggestionProfileModal());
    const result=await dispatch(getUserInfo(user?.username))    
    dispatch(setProfileModalData(result?.payload?.data))
    setIsHovered(true)}else{
      setIsHovered(false)
    }
  };  
  const handleMouseLeave = () => {              
    dispatch(closeSuggestionProfileModal())
    setIsHovered(false)
  };  
  return (
    <div className={styles.homeSuggestionCard} onMouseLeave={handleMouseLeave}>
        <div className={styles.homeSuggestionCardImg}>
          <img src={user?.profilePic} alt="" />
        </div>
        <div className={styles.homeSuggestionCardContent} >
          <p className={styles.homeSuggestionCardInfoName}
            onMouseEnter={handleMouseEnter}
          >
            {user?.username}
          </p>
         {isSelf ? <p className={styles.homeSuggestionCardInfoIsSelf}>{user?.name}</p> 
         :
         <p className={styles.homeSuggestionCardInfo}>
            {user?.isFollower? "Follows you":"Suggested for you"}
          </p>}
        </div>
        <button className={styles.homeSuggestionsFollowBtn}>
          {isSelf?"Switch":"Follow"}
        </button>
        {isHovered && suggestionProfileModal && <ProfileModal onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>}
    </div>
  )
}

export default HomeSuggestionCard