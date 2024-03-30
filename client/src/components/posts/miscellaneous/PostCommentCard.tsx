import React, { useState } from 'react'
import styles from '../../../styles/posts/postCommentCard.module.css'
import { FaRegHeart } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../app/features/authSlice';
import { getCommentReplies, selectToReplyComment, setToReplyComment } from '../../../app/features/viewPostSlice';

interface PostCommentCardProps{
  _id:string;
  text:string;
  updatedAt:string;
  noOfReplies:number;
  noOfLikes:number;
  userInfo:{
    username:string;
    profilePic:string;
    _id:string;
  }
}
interface Props{
  comment:PostCommentCardProps
}
const PostCommentCard: React.FC<Props> = ({comment}) => {  
  const currentUser=useAppSelector(selectCurrentUser)
  const [replies,setReplies]=useState<PostCommentCardProps[]>()
  const [isShowReplies,setIsShowReplies]=useState<boolean>(false)
  const [repliesPage,setRepliesPage]=useState<number>(1)
  const dispatch=useAppDispatch()
  const handleRepliesClick=async()=>{
    if(currentUser?._id){
      const results=await dispatch(getCommentReplies({commentId:comment?._id,page:repliesPage}))
      setIsShowReplies(true)
      setReplies(results?.payload?.data)
    }
  }
  
  const handleReplyToComment=()=>{
    dispatch(setToReplyComment({username:currentUser?.username,commentId:comment?._id}))
  }
  return (
    <div className={styles.postCommentCardContainer}>
      <div className={styles.postCommentCardContentsContainer}>
        <div className={styles.postCommentCardProfilePic}>
          <img src={comment?.userInfo?.profilePic} alt="" />
        </div>
        <div className={styles.postCommentCardContentAndCommentWrapper}>
          <div className={styles.postCommentCardContentWrapper}>
            <div className={styles.postCommentCardContent}>
              <p className={styles.postCommentCardContentUsername}>{comment?.userInfo?.username}</p>
              <p className={styles.postCommentCardContentComment}>{comment?.text}</p>
            </div>
            <div className={styles.postCommentCardInfo}>
              <p>2d</p>
              <p>{comment?.noOfLikes} {comment?.noOfLikes > 1? "likes":"like"}</p>
              <button onClick={handleReplyToComment}>Reply</button>
            </div>
          </div>
          {comment?.noOfReplies>0 &&
          <div className={styles.postCommentCardReplySection}>
            <div className={styles.postCommentCardReplySectionHeader}>
              <hr />
              {!isShowReplies && <button onClick={handleRepliesClick}>View Replies ({comment?.noOfReplies})</button>}
              {isShowReplies && <button onClick={()=>setIsShowReplies(false)}>Hide Replies</button>}
            </div>
            {
              isShowReplies && replies && replies?.length>=1 &&
               replies.map((reply,index)=>(
                <PostCommentCard comment={reply} key={index}/>
               ))
            }
            </div>
          }
      </div>
        </div>
        <div className={styles.postCommentLikeBtn}>
            <FaRegHeart/>
        </div>
    </div>
  )
}

export default PostCommentCard