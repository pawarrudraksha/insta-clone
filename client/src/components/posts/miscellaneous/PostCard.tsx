import React, { useState } from 'react'
import styles from '../../../styles/posts/postCard.module.css'
import Carousel from '../../miscellaneous/Carousel'
import { IoIosMore } from 'react-icons/io';
import { postData } from '../../../data/samplePost';
import PostComment from './PostComment';
import Interactions from '../../miscellaneous/Interactions';
import { BsEmojiSmile } from 'react-icons/bs';
import { useAppSelector } from '../../../app/hooks';
import { selectCarouselData } from '../../../app/features/carouselSlice';

const PostCard:React.FC = () => {
  const [comment,setComment]=useState<string>("")
  const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setComment(e.target.value)
  }
  const posts=useAppSelector(selectCarouselData)

  return (
    <div className={styles.postCardContainer}>
      <div className={styles.postCardWrapper}>
        <div className={styles.postCardImage}>
          <Carousel posts={posts}/>
        </div>
        <div className={styles.postCardContentContainer}>
          <div className={styles.postCardContentHeader}>
            <div className={styles.postCardContentInnerHeader}>
              <img src={postData.profilePic} alt="" />
              <p>{postData.username}</p>
            </div>
            <IoIosMore/>
          </div>
          <div className={styles.postCardContent}>
            <div className={styles.postCardCaption}>
              <img src={postData.profilePic} alt="" />
              <div className={styles.postCardCaptionContent}>
                <div className={styles.postCardCaptionInnerContent}>
                  <p>{postData.username}</p>
                  <p className={styles.postCardCaptionInnerContentCaption}>{postData.caption}</p>
                </div>
                <p className={styles.postCardCaptionContentDate}>2w</p>
              </div>
            </div>
            <div className={styles.postCardCommentsContainer}>
              {
                postData.comments.map((comment,index)=>(
                  <PostComment  key={index}/>
                ))
              }
            </div>
          </div>
          <div className={styles.postCardInteractionSection}>
            <div className={styles.postCardInteractionSectionIcons}>
              <Interactions noOfLikes={postData.noOfLikes}/>
              <p className={styles.postCardInteractionSectionIconsDate}>February 8</p>
            </div>
            <div className={styles.postCardAddCommentSection}>
              <BsEmojiSmile />
              <input type="text" placeholder='Add a comment...' value={comment}onChange={handleInputChange} />
              <button
                disabled={comment==='' ? true:false} 
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard