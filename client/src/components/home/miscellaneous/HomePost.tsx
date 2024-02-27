import React, { useState } from 'react';
import styles from '../../../styles/home/homePost.module.css';
import { postData } from '../../../data/samplePost';
import { IoIosMore } from 'react-icons/io';
import Carousel from '../../miscellaneous/Carousel';
import { HiOutlineEmojiHappy } from "react-icons/hi";import { BsDot } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeProfileModal, openProfileModal, selectIsProfileModalOpen } from '../../../app/features/appSlice';
import ProfileModal from '../../miscellaneous/ProfileModal';
import { useNavigate } from 'react-router-dom';
import Interactions from '../../miscellaneous/Interactions';

interface Post {
    posts: Array<any>,
    username: string,
    profilePic: string,
    caption: string,
    noOfLikes: number,
    noOfComments: number,
}

const postDataTyped = postData as Post;

const HomePost: React.FC = () => {
    const navigate=useNavigate( )
    const dispatch=useAppDispatch()
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }

    const handleMouseEnter = () => {
        dispatch(openProfileModal());
    };

    const handleMouseLeave = () => {              
        dispatch(closeProfileModal())
    };
    const isProfileModalOpen=useAppSelector(selectIsProfileModalOpen)    
    const navigateToProfile=()=>{
        navigate(`/${postDataTyped.username}`)
    }   
    return (
        <div className={styles.homePost}>
            <div className={styles.homePostHeader} onMouseLeave={handleMouseLeave}>
                <div className={styles.homePostProflePic}>
                    <img src={postDataTyped.profilePic} alt="profile pic" onClick={navigateToProfile}/>
                </div>
                <div className={styles.homePostHeaderInfo}>
                    <div className={styles.homePostHeaderDetail} >
                        <p className={styles.homePostHeaderDetailUsername} 
                              onMouseEnter={handleMouseEnter}
                              onClick={navigateToProfile}
                        >
                            {postDataTyped.username}
                        </p>
                        <BsDot/>
                        <p>16h</p>
                    </div>
                    {/* <p>Original audio</p> */}
                </div>
                <div className={styles.homePostHeaderMore}>
                <IoIosMore />
                </div>
            </div>
            <div className={styles.homePostCarousel}>
                <Carousel/>
            </div>
            <Interactions noOfLikes={postDataTyped.noOfLikes}/>
            <div className={styles.homePostCaption}>
                <p onClick={navigateToProfile}>{postDataTyped.username}</p>
                <p>{postDataTyped.caption}</p>
            </div>
            <div className={styles.homePostCardComments}>
                <p>View all {postDataTyped.noOfComments} comments</p>
                <div className={styles.homePostCardAddComment}>
                    <input type="text" placeholder='Add a comment' className={styles.homePostCardAddCommentInput} onChange={handleCommentChange}/>
                    <HiOutlineEmojiHappy/>
                </div>
            </div>
                {isProfileModalOpen && 
                <ProfileModal 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />}
        </div>
    );
}

export default HomePost;
