import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks';
import { openPostModal } from '../../app/features/viewPostSlice';
import styles from '../../styles/miscellaneous/postItem.module.css'
import { FaComment, FaHeart, FaImages, FaPlay } from 'react-icons/fa';
import {  BiSolidMoviePlay } from 'react-icons/bi';
import { resetCarouselData, setCarouselData } from '../../app/features/carouselSlice';


interface PostItemProps{
    images:string[];
    type:string;
    noOfLikes:number;
    noOfComments:number;
    id:number;
    showReelIcon?:boolean;
}

interface PostItemProp{
    item:PostItemProps
}
const PostItem:React.FC<PostItemProp> = ({item}) => {
    const [isInteractionVisible,setIsInteractionVisible]=useState<boolean>(false)
    const dispatch=useAppDispatch()
    const handleNavigate=(id:number)=>{
        dispatch(resetCarouselData())
        dispatch(setCarouselData({type:item.type,post:item.images}))
        dispatch(openPostModal())
        window.history.pushState(null, '', `/p/${id}`);
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
            onClick={()=>handleNavigate(item.id)}
        >
           {isInteractionVisible && 
                <div className={styles.postItemInteractionContainer}>
                    <div className={styles.postItemLikes}>
                        <FaHeart/>
                        <p>{item.noOfLikes}</p>
                    </div>
                    <div className={styles.postItemComments}>
                        <FaComment/>
                        <p>{item.noOfComments}</p>
                    </div>
                </div>
            }
            {
                <div className={styles.postItemTypeIndicator}>
                    {
                        (item.type==='video'&& item.showReelIcon && item.images.length <= 1)  && <BiSolidMoviePlay/>
                    }
                    {
                        item.images.length>1 && <FaImages/>

                    }
                </div>
            }
            {
                (item.type==='video'&& !item.showReelIcon && item.images.length <= 1)  && 
                <div className={styles.postReelViews}>
                    <FaPlay/>
                    <p>1M</p>
                </div>
            }
            {
                item.type==='image' && (
                    <div className={styles.postItem} >
                        <img src={item.images[0]} alt="post" />
                    </div>
                )
            }
            {
                item.type==='video' && (
                <div className={styles.postItemIsReel} >
                    <video
                        loop 
                        muted
                    >
                        <source src={item.images[0]} type="video/mp4"   />
                        Your browser does not support the video tag.
                    </video>                      
                </div>
                )
            }
        </div>
    )
}

export default PostItem