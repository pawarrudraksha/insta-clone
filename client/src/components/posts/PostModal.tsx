import React from 'react'
import styles from '../../styles/posts/postModal.module.css'
import PostCard from './miscellaneous/PostCard'
import { IoMdClose } from 'react-icons/io'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { useAppDispatch } from '../../app/hooks'
import { closePostModal } from '../../app/features/postSlice'

const PostModal:React.FC = () => {
  const dispatch=useAppDispatch()
  const handleCloseModal=()=>{
    dispatch(closePostModal())
    window.history.back();
  }
  const handleEventPropogation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
  }
  const handleLeftClick=(e: React.MouseEvent<HTMLOrSVGElement>)=>{
    e.stopPropagation(); 
  }
  const handleRightClick=(e: React.MouseEvent<HTMLOrSVGElement>)=>{
    e.stopPropagation(); 
  }
  return (
    <div className={styles.postModalContainer} onClick={handleCloseModal}>
      <div className={styles.postModalCloseIcon} onClick={handleCloseModal}>
        <IoMdClose/>
      </div>
      <div className={styles.postModalArrows}>
        <MdKeyboardArrowLeft onClick={handleLeftClick}/>
        <MdKeyboardArrowRight onClick={handleRightClick}/>
      </div>
      <div className={styles.postModalWrapper} onClick={handleEventPropogation}>
        <PostCard/>
      </div>
    </div>
  )
}

export default PostModal