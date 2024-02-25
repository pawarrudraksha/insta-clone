import React from 'react';
import styles from '../../../styles/home/homePost.module.css';
import { postData } from '../../../data/samplePost';
import { IoIosMore } from 'react-icons/io';
import Carousel from '../../miscellaneous/Carousel';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FiSend } from 'react-icons/fi';
import { BsDot } from 'react-icons/bs';

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
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }
    return (
        <div className={styles.homePost}>
            <div className={styles.homePostHeader}>
                <div className={styles.homePostProflePic}>
                    <img src={postDataTyped.profilePic} alt="profile pic" />
                </div>
                <div className={styles.homePostHeaderInfo}>
                    <div className={styles.homePostHeaderDetail}>
                        <p className={styles.homePostHeaderDetailUsername}>{postDataTyped.username}</p>
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
            <div className={styles.homePostInteractions}>
                <div className={styles.homePostInteractionsIcons}>
                    <div className={styles.homePostInteractionsIconsReact}>
                    <FaRegHeart />
                    <FaRegComment/>
                    <FiSend/>
                    </div>
                    <div>
                    <FaRegBookmark />
                    </div>
                </div>
                <p>{postDataTyped.noOfLikes} likes</p>
            </div>
            <div className={styles.homePostCaption}>
                <p>{postDataTyped.username}</p>
                <p>{postDataTyped.caption}</p>
            </div>
            <div className={styles.homePostCardComments}>
                <p>View all {postDataTyped.noOfComments} comments</p>
                <div className={styles.homePostCardAddComment}>
                    <input type="text" placeholder='Add a comment' className={styles.homePostCardAddCommentInput} onChange={handleCommentChange}/>
                    <HiOutlineEmojiHappy/>
                </div>
            </div>
        </div>
    );
}

export default HomePost;