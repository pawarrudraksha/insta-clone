import React from 'react'
import styles from '../../styles/create/createPostOverlay.module.css'
import UploadPostModal from './main/UploadPostModal'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectIsCropPostModalOpen, selectIsEditPostsModalOpen, selectIsSharePostModalOpen, selectIsSuccessModalOpen, selectIsUploadPostModalOpen, setCreatePosts, toggleCreatePostModalOpen, toggleCropPostModalOpen, toggleIsEditPostsModalOpen, toggleIsSharePostModalOpen, toggleIsSuccessModalOpen, toggleUploadPostModal } from '../../app/features/createPostSlice'
import CropPostModal from './main/CropPostModal'
import EditPostModal from './main/EditPostModal'
import { IoMdClose } from 'react-icons/io'
import { setCreatePostCarouseActiveIndex } from '../../app/features/carouselSlice'
import SharePostModal from './main/SharePostModal'
import SuccessPostModal from './main/SuccessPostModal'

const CreatePostOverlay:React.FC = () => {
  const isCropPostModalOpen=useAppSelector(selectIsCropPostModalOpen)
  const isUploadPostModalOpen=useAppSelector(selectIsUploadPostModalOpen)  
  const isEditPostsModalOpen=useAppSelector(selectIsEditPostsModalOpen)  
  const isSharePostModalOpen=useAppSelector(selectIsSharePostModalOpen)  
  const isSuccessPostModalOpen=useAppSelector(selectIsSuccessModalOpen)  
  const dispatch=useAppDispatch()
  const handleClose=()=>{    
    dispatch(toggleCreatePostModalOpen())
    if(isUploadPostModalOpen){
      dispatch(toggleUploadPostModal())
    }
    if(isCropPostModalOpen){
      dispatch(toggleCropPostModalOpen())
    }
    if(isEditPostsModalOpen){
      dispatch(toggleIsEditPostsModalOpen())
    }
    if(isSharePostModalOpen){
      dispatch(toggleIsSharePostModalOpen())
    }
    if(isSuccessPostModalOpen){
      dispatch(toggleIsSuccessModalOpen())
    }
    dispatch(setCreatePostCarouseActiveIndex(0))
    dispatch(setCreatePosts([]))
  }
  const handlePropogation=(e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation()
  }
  return (
    <div className={styles.createPostOverlay}  onClick={handleClose}>
        <div className={styles.createPostOverlayCloseIcon} >
          <IoMdClose onClick={handleClose}/>
        </div>
        {isUploadPostModalOpen && <div className={styles.uploadPostModalContainer}  onClick={handlePropogation}>
          <UploadPostModal/>
        </div>}
        {isCropPostModalOpen && <div className={styles.cropPostModalContainer} onClick={handlePropogation}>
          <CropPostModal/>
        </div>}
        {
          isEditPostsModalOpen && <div className={styles.editPostModalContainer} onClick={handlePropogation}>
            <EditPostModal/>
          </div>
        }
        {
          isSharePostModalOpen && <div className={styles.sharePostModalContainer} onClick={handlePropogation}>
            <SharePostModal/>
          </div>
        }
        {
          isSuccessPostModalOpen && <div className={styles.successPostModalContainer} onClick={handlePropogation}>
          <SuccessPostModal/>
        </div>
        }
    </div>
  )
}

export default CreatePostOverlay