import React, { useState } from 'react'
import styles from '../../../styles/create/cropPostModal.module.css'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { toggleCropPostModalOpen ,selectIsAspectRatioModalOpen, toggleIsAspectRatioModalOpen, selectPosts, toggleIsManagePostsModalOpen, selectIsManagePostsModalOpen, setCreatePosts, toggleUploadPostModal, toggleIsEditPostsModalOpen, toggleIsFiltersTabOpen} from '../../../app/features/createPostSlice'
import Carousel from '../../miscellaneous/Carousel';
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { TbBoxMultiple } from "react-icons/tb";
import { FiMaximize2 } from 'react-icons/fi';
import AspectRatioModal from '../miscellaneous/Crop/AspectRatioModal';
import ManagePostsModal from '../miscellaneous/Crop/ManagePostsModal';
import { selectCarouselActiveType, setCreatePostCarouseActiveIndex } from '../../../app/features/carouselSlice';



const CropPostModal:React.FC = () => {
    const dispatch=useAppDispatch()  
    const [isGridVisible,setIsGridVisible]=useState<boolean>(false)
    const isAspectRatioModalOpen=useAppSelector(selectIsAspectRatioModalOpen)
    const isManagePostsModalOpen=useAppSelector(selectIsManagePostsModalOpen)
    const handleAspectRatio=()=>{        
        if(isManagePostsModalOpen){
            dispatch(toggleIsManagePostsModalOpen())
        }
        dispatch(toggleIsAspectRatioModalOpen())
    }
    const posts=useAppSelector(selectPosts)
    const handleBack=()=>{        
        dispatch(toggleCropPostModalOpen())
        dispatch(toggleUploadPostModal())
        if(isManagePostsModalOpen){
            dispatch(toggleIsManagePostsModalOpen())
        }
        if(isAspectRatioModalOpen){
            dispatch(toggleIsAspectRatioModalOpen())
        }
        dispatch(setCreatePosts([]))
    }

    const handleMultiplePosts=()=>{
        if(isAspectRatioModalOpen){
            dispatch(toggleIsAspectRatioModalOpen())
        }
        dispatch(toggleIsManagePostsModalOpen())
    }
    const handleMouseDown = () => {
        setIsGridVisible(true);        
    };

    const handleMouseUp = () => {        
        setIsGridVisible(false);
    };
    const handleNext=()=>{
        dispatch(setCreatePostCarouseActiveIndex(0))
        dispatch(toggleCropPostModalOpen())
        dispatch(toggleIsEditPostsModalOpen())
        dispatch(toggleIsFiltersTabOpen())
    }
    const type=useAppSelector(selectCarouselActiveType)    
    return (
        <div className={styles.cropPostModalContainer}>
            <div className={styles.cropPostHeader}>
                <MdOutlineKeyboardBackspace onClick={handleBack}/>
                <p className={styles.cropTitle}>Crop</p>
                <button className={styles.cropNextBtn} onClick={handleNext}>Next</button>
            </div>
            <div className={styles.cropPostContent} onMouseDown={handleMouseDown} >
                <Carousel posts={posts} isCreatePost/>
            </div>
            {isGridVisible && <div className={styles.cropPostGridBox}>
            {[...Array(9)].map((_, index) => (
                    <div key={index} className={styles.cropPostGridBoxCell} onMouseUp={handleMouseUp} ></div>
                ))}
            </div>}
            <div className={styles.cropPostBtns}>
            <FiMaximize2  
                onClick={handleAspectRatio} 
                className={`${isAspectRatioModalOpen &&styles.aspectRatioActiveBtn}`}
            />
            <TbBoxMultiple
                onClick={handleMultiplePosts}
                className={`${isManagePostsModalOpen &&styles.managePostsActiveBtn}`}
            />
            </div>
            {isAspectRatioModalOpen && <div className={styles.aspectRatioModalContainer}>
                <AspectRatioModal/>
            </div>}
            {
                isManagePostsModalOpen && <div className={styles.managePostsModalContainer}>
                    <ManagePostsModal/>
                </div>
            }
        </div>
    )
}

export default CropPostModal