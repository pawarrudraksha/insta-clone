import React from 'react'
import styles from "../../../styles/home/homeSuggestionCard.module.css"
import { accountData } from '../../../data/sampleAccount'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { closeSuggestionProfileModal, openSuggestionProfileModal, selectActiveSuggestionProfileModal, selectSuggestionProfileModal, setActiveSuggestionProfileModal } from '../../../app/features/homeSlice'
import ProfileModal from '../../miscellaneous/ProfileModal'

interface Props{
  isSelf?:boolean;
  id:number;
}
const HomeSuggestionCard :React.FC<Props>= ({isSelf,id}) => {
  const suggestionProfileModal=useAppSelector(selectSuggestionProfileModal)
  const activeModal=useAppSelector(selectActiveSuggestionProfileModal)
  const dispatch=useAppDispatch()
  const handleMouseEnter = () => {
    dispatch(setActiveSuggestionProfileModal(id))
    dispatch(openSuggestionProfileModal());
  };

  const handleMouseLeave = () => {              
    dispatch(closeSuggestionProfileModal())
  };
  return (
    <div className={styles.homeSuggestionCard} onMouseLeave={handleMouseLeave}>
        <div className={styles.homeSuggestionCardImg}>
          <img src={accountData.profilePic} alt="" />
        </div>
        <div className={styles.homeSuggestionCardContent} >
          <p className={styles.homeSuggestionCardInfoName}
            onMouseEnter={handleMouseEnter}
          >
            {accountData.username}
          </p>
         {isSelf ? <p className={styles.homeSuggestionCardInfoIsSelf}>{accountData.name}</p> 
         :<p className={styles.homeSuggestionCardInfo}>Follows you</p>}
        </div>
        <button className={styles.homeSuggestionsFollowBtn}>
          {isSelf?"Switch":"Follow"}
        </button>
        {activeModal===id&& suggestionProfileModal && <ProfileModal onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>}
    </div>
  )
}

export default HomeSuggestionCard