import React, { useState } from 'react';
import styles from '../../../styles/home/homePost.module.css';
import { IoIosMore } from 'react-icons/io';
import Carousel from '../../miscellaneous/Carousel';
import { HiOutlineEmojiHappy } from "react-icons/hi";import { BsDot } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeProfileModal, openProfileModal, selectIsProfileModalOpen, setProfileModalData } from '../../../app/features/appSlice';
import ProfileModal from '../../miscellaneous/ProfileModal';
import { useNavigate } from 'react-router-dom';
import Interactions from '../../miscellaneous/Interactions';
import { HomePostData } from '../HomePosts';
import { getUserInfo } from '../../../app/features/accountSlice';
import { actionOnPost, openPostModal } from '../../../app/features/viewPostSlice';
import { defaultProfilePic } from '../../../data/common';
import { getTimeSinceUpdate } from '../../../utils/getTimeSinceUpdate';


const HomePost: React.FC<{ data: HomePostData }> = ({ data }) => {    
    const [isHovered,setIsHovered]=useState<boolean>(false)
    const navigate=useNavigate()
    const dispatch=useAppDispatch()
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    const handleMouseEnter = async() => {
        const result=await dispatch(getUserInfo(data?.userInfo?.username))
        dispatch(setProfileModalData(result?.payload?.data))
        dispatch(openProfileModal());
        setIsHovered(true)
    };

    const handleMouseLeave = () => {              
        dispatch(closeProfileModal())
        setIsHovered(false)
    };
    const isProfileModalOpen=useAppSelector(selectIsProfileModalOpen)    
    const navigateToProfile=()=>{
        navigate(`/${data?.userInfo?.username}`)
    }   
    const handleViewAllComments=()=>{
        dispatch(openPostModal())
        window.history.pushState(null, '', `/p/${data?._id}`);   
    }
    const handleLikePost=async()=>{
        if(data?.isPostLiked){
            dispatch(actionOnPost({targetId:data?._id,targetType:"post",action:"unlike"}))
        }else{
            dispatch(actionOnPost({targetId:data?._id,targetType:"post",action:"like"}))  
        }
    }
    const postUpdatedTiime=getTimeSinceUpdate(data?.updatedAt)
    return (
        <div className={styles.homePost}>
            <div className={styles.homePostHeader} onMouseLeave={handleMouseLeave}>
                <div className={styles.homePostProflePic}>
                    <img src={data?.userInfo?.profilePic ? data?.userInfo?.profilePic :defaultProfilePic} alt="profile pic" onClick={navigateToProfile}/>
                </div>
                <div className={styles.homePostHeaderInfo}>
                    <div className={styles.homePostHeaderDetail} >
                        <p className={styles.homePostHeaderDetailUsername} 
                              onMouseEnter={handleMouseEnter}
                              onClick={navigateToProfile}
                        >
                            {data?.userInfo?.username}
                        </p>
                        <BsDot/>
                        <p>{postUpdatedTiime}</p>
                    </div>
                    {/* <p>Original audio</p> */}
                </div>
                <div className={styles.homePostHeaderMore}>
                <IoIosMore />
                </div>
            </div>
            <div className={styles.homePostCarousel} onDoubleClick={handleLikePost}>
                <Carousel posts={data?.posts}/>
            </div>
            <Interactions data={{ noOfLikes: data?.noOfLikes, isPostLiked: data?.isPostLiked }} />
            <div className={styles.homePostCaption}>
                <p onClick={navigateToProfile}>{data?.userInfo?.username}</p>
                <p>{data?.caption}</p>
            </div>
           {!data?.isCommentsOff && <div className={styles.homePostCardComments}>
                <button onClick={handleViewAllComments}>View all {data?.noOfComments} comments</button>
                <div className={styles.homePostCardAddComment}>
                    <input type="text" placeholder='Add a comment' className={styles.homePostCardAddCommentInput} onChange={handleCommentChange}/>
                    <HiOutlineEmojiHappy/>
                </div>
            </div>}
                {isProfileModalOpen && isHovered &&
                <ProfileModal 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />}
        </div>
    );
}

export default HomePost;
