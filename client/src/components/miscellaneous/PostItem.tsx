import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks';
import { openPostModal } from '../../app/features/viewPostSlice';
import styles from '../../styles/miscellaneous/postItem.module.css'
import { FaComment, FaHeart, FaImages, FaPlay } from 'react-icons/fa';
import {  BiSolidMoviePlay } from 'react-icons/bi';
import { AccountPost } from '../account/render/RenderPosts';

const PostItem:React.FC<{item:AccountPost,showReelIcon?:boolean}> = ({item,showReelIcon}) => {
    const [isInteractionVisible,setIsInteractionVisible]=useState<boolean>(false)
    const dispatch=useAppDispatch()    
    const handleNavigate=(postId:string)=>{
        dispatch(openPostModal())
        window.history.pushState(null, '', `/p/${postId}`);
    }    
    const handleMouseEnter=()=>{
        setIsInteractionVisible(true)
    }
    const handleMouseLeave=()=>{
        setIsInteractionVisible(false)
    }
    
    return (
        <div 
            className={`${styles.postItemContainer} ${isInteractionVisible && styles.postItemContainerInteractionActive}`} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            onClick={()=>handleNavigate(item?._id)}
        >
           {isInteractionVisible && 
                <div className={styles.postItemInteractionContainer}>
                    <div className={styles.postItemLikes}>
                        <FaHeart/>
                        <p>{item?.noOfLikes}</p>
                    </div>
                    <div className={styles.postItemComments}>
                        <FaComment/>
                        <p>{item?.noOfComments}</p>
                    </div>
                </div>
            }
            {
                <div className={styles.postItemTypeIndicator}>
                    {
                        (item?.post?.type==='reel'&& showReelIcon && item?.isStandAlone)  && <BiSolidMoviePlay/>
                    }
                    {
                        !item?.isStandAlone && <FaImages/>

                    }
                </div>
            }
            {
                (item?.post?.type==='reel'&& !showReelIcon && item?.isStandAlone)  && 
                <div className={styles.postReelViews}>
                    <FaPlay/>
                    <p>1M</p>
                </div>
            }
            {
                item?.post?.type==='post' && (
                    <div className={styles.postItem} >
                        <img src={item?.post?.url} alt="post" />
                    </div>
                )
            }
            {
                item?.post?.type==='reel' && (
                <div className={styles.postItemIsReel} >
                    <video
                        loop 
                        muted
                    >
                        <source src={item?.post?.url} type="video/mp4"   />
                        Your browser does not support the video tag.
                    </video>                      
                </div>
                )
            }
        </div>
    )
}

export default PostItem