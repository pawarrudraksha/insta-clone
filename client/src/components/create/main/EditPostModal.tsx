import React from 'react'
import styles from '../../../styles/create/editPostModal.module.css'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectIsAdjustmentsTabOpen, selectIsFiltersTabOpen, selectPosts, toggleCropPostModalOpen, toggleIsAdjustmentsTabOpen, toggleIsEditPostsModalOpen, toggleIsFiltersTabOpen, toggleIsSharePostModalOpen } from '../../../app/features/createPostSlice'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import Carousel from '../../miscellaneous/Carousel'
import { selectCarouselActiveType } from '../../../app/features/carouselSlice'
import EditVideo from '../miscellaneous/Edit/EditVideo'

const EditPostModal:React.FC = () => {
  const isAdjustmentsTabOpen=useAppSelector(selectIsAdjustmentsTabOpen)
  const isFiltersTabOpen=useAppSelector(selectIsFiltersTabOpen)
  const type=useAppSelector(selectCarouselActiveType)
  const dispatch=useAppDispatch()
  const handleBack=()=>{
    dispatch(toggleIsEditPostsModalOpen())
    dispatch(toggleCropPostModalOpen())
  }
  const handleNext=()=>{
    dispatch(toggleIsEditPostsModalOpen())
    dispatch(toggleIsSharePostModalOpen())
  }
  const handleFilters=()=>{
    if(isAdjustmentsTabOpen){
      dispatch(toggleIsAdjustmentsTabOpen())
    }
    dispatch(toggleIsFiltersTabOpen())
  }
  const handleAdjustments=()=>{
    if(isFiltersTabOpen){
      dispatch(toggleIsFiltersTabOpen())
    }
    dispatch(toggleIsAdjustmentsTabOpen())
  }
  const posts=useAppSelector(selectPosts)  
  return (
    <div className={styles.editPostContainer}>
      <div className={styles.editPostHeader}>
          <MdOutlineKeyboardBackspace onClick={handleBack}/>
          <p className={styles.editTitle}>Edit</p>
          <button className={styles.editPostHeaderNextBtn} onClick={handleNext}>Next</button>
      </div>
      <div className={styles.editPostContent}>
        <div className={styles.editPostCarousel}>
          <Carousel posts={posts} isCreatePost/>
        </div>
       {type==='post'&& <div className={styles.editPostTabsContainer}>
          <div className={styles.editPostTabs}>
            <button 
            onClick={handleFilters} 
            className={`${styles.editPostTabsBtn} ${isFiltersTabOpen && styles.editPostActiveBtn}`}
            >Filters
            </button>
            <button 
            onClick={handleAdjustments} 
            className={`${styles.editPostTabsBtn} ${isAdjustmentsTabOpen && styles.editPostActiveBtn}`}
            >Adjustments
            </button>
          </div>
          <div className={styles.editPostTabContent}>
            
          </div>
        </div>}
       {type==='reel'&& <div className={styles.editPostVideoContainer}>
           <EditVideo/>
        </div>
        }
      </div>
    </div>
  )
}

export default EditPostModal