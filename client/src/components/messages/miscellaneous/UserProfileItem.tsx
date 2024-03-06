import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from '../../../styles//messages/chatDetailsMemberItem.module.css'
import SelectCheckbox from '../../miscellaneous/SelectCheckbox';

interface UserProfileItemProps{
  isCheckbox?:boolean;
}
const UserProfileItem:React.FC<UserProfileItemProps>= ({isCheckbox}) => {
  return (
    <div className={styles.chatDetailsMemberItemContainer}>
        <div className={styles.chatDetailsMemberItemContainerImg}>
          <img src={accountData.profilePic} alt="" />
        </div>
        <div className={styles.chatDetailsMemberItemInfo}>
            <p>{accountData.username}</p>
            <p>{accountData.name}</p>
        </div>
        <SelectCheckbox/>
    </div>
  )
}

export default UserProfileItem