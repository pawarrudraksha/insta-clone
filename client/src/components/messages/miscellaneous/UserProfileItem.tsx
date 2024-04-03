import React from 'react'
import styles from '../../../styles//messages/chatDetailsMemberItem.module.css'
import SelectCheckbox from '../../miscellaneous/SelectCheckbox';
import { defaultProfilePic } from '../../../data/common';

interface UserProfileItemProps{
  isCheckbox?:boolean;
  userInfo:{
    username:string;
    name:string;
    profilePic:string;
    _id:string
  }
}
const UserProfileItem:React.FC<UserProfileItemProps>= ({isCheckbox,userInfo}) => {
  return (
    <div className={styles.chatDetailsMemberItemContainer}>
        <div className={styles.chatDetailsMemberItemContainerImg}>
          <img src={userInfo?.profilePic ? userInfo?.profilePic :defaultProfilePic} alt="" />
        </div>
        <div className={styles.chatDetailsMemberItemInfo}>
            <p>{userInfo?.username}</p>
            <p>{userInfo?.name}</p>
        </div>
        {isCheckbox && <SelectCheckbox username={userInfo.username} _id={userInfo._id} />}
    </div>
  )
}

export default UserProfileItem