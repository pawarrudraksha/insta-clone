import React from 'react'
import { IoMdClose } from 'react-icons/io'
import styles from '../../../styles/messages/newMessageModal.module.css'
import UserProfileItem from '../miscellaneous/UserProfileItem'
import { useAppDispatch } from '../../../app/hooks'
import { toggleNewMessageModal } from '../../../app/features/messagesSlice'

const NewMessageModal:React.FC= () => {
  const dispatch=useAppDispatch()
  const handleModalClose=()=>{
    dispatch(toggleNewMessageModal())
  }
  const handlePropagation=(e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation()
  }
  return (
    <div className={styles.newMessageOverlay} onClick={handleModalClose}>
      <div className={styles.newMessageModalContainer} onClick={handlePropagation}>
          <div className={styles.newMessageModalHeader}>
              <p>New message</p>
              <IoMdClose onClick={handleModalClose}/>
          </div>
          <div className={styles.newMessageModalSearchBar}>
              <div className={styles.selectedItemsContainer}>
              <p>To:</p>
                <div className={styles.selectedItem}>
                  <p>Quotes about life</p>
                  <IoMdClose/>
                </div>
              </div>
              <input type="text" placeholder='Search...' />
          </div>
          <div className={styles.newMessageModalSearchResults}>
            <UserProfileItem isCheckbox/>
            <UserProfileItem isCheckbox/>
            <UserProfileItem isCheckbox/>
          </div>
          <button className={styles.newMessageModalChatBtn}>Chat</button>
      </div>
    </div>
  )
}

export default NewMessageModal