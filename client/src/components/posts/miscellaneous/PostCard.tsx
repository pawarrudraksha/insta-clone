import React, { useEffect, useRef, useState } from 'react'
import styles from '../../../styles/posts/postCard.module.css'
import Carousel from '../../miscellaneous/Carousel'
import { IoIosMore } from 'react-icons/io';
import Interactions from '../../miscellaneous/Interactions';
import { BsEmojiSmile } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../app/features/authSlice';
import { getPostByIdWhenLoggedIn, getPostByIdWhenNotLoggedIn, getPostCommentsWhenLoggedIn, getPostCommentsWhenNotLoggedIn, postComment, selectToReplyComment, setToReplyComment } from '../../../app/features/viewPostSlice';
import PostCommentCard from './PostCommentCard';
import { useNavigate } from 'react-router-dom';
import { defaultProfilePic } from '../../../data/common';
import { getTimeSinceUpdate } from '../../../utils/getTimeSinceUpdate';
import { getTDateSinceUpdate } from '../../../utils/getDateSinceUpdate';

interface ReceivedPostItem{
  content:{
    type:string;
    url:string
  }
}
interface Post{
  userInfo:{
    _id:string;
    username:string;
    profilePic:string
  };
  updatedAt:string;
  caption:string;
  noOfLikes:number;
  _id:string;
  isPostLiked:boolean
}
interface CarouselPostsType{
  type:string;
  url:string
}
const PostCard:React.FC = () => {
  const currentUser=useAppSelector(selectCurrentUser)
  const replyComment=useAppSelector(selectToReplyComment)  
  const navigate=useNavigate()
  const dispatch=useAppDispatch()
  const [comment,setComment]=useState<string>("")
  const [postComments,setPostComments]=useState([])
  const [commentsPage,setCommentsPage]=useState<number>(1)
  const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setComment(e.target.value)
  }
  const [filteredPost,setFilteredPost]=useState<CarouselPostsType[]>([])
  const postId=window.location.pathname.slice(3)
  const inputRef = useRef<HTMLInputElement>(null);
  const [post,setPost]=useState<Post>({_id:'',caption:'',userInfo:{_id:'',profilePic:'',username:''},updatedAt:'',noOfLikes:-1,isPostLiked:false})
  useEffect(()=>{ 
    if(postId){
      const fetchPosts=async()=>{
        if(currentUser?._id){
          const response=await dispatch(getPostByIdWhenLoggedIn(postId))
          setPost(response?.payload?.data);
          const filteredPosts=await response?.payload?.data?.posts?.map((item:ReceivedPostItem)=>{              
              return {
                type:item?.content?.type,
                url:item?.content?.url
              }
          })
          setFilteredPost(filteredPosts)//temporary
        }else{
          const response=await dispatch(getPostByIdWhenNotLoggedIn(postId))
          setPost(response?.payload?.data);
          const filteredPosts=await response?.payload?.data?.posts?.map((item:ReceivedPostItem)=>{
            return {
              type:item?.content?.type,
              url:item?.content?.url
            }
        })
          setFilteredPost(filteredPosts)
        }
      }
      fetchPosts()
    }
  },[postId])
  
  useEffect(()=>{
    if(postId){
      const fetchComments=async()=>{
        if(currentUser?._id){
          const results=await dispatch(getPostCommentsWhenLoggedIn({postId,page:commentsPage}))
          setPostComments(results?.payload?.data);
        }else{
          const results=await dispatch(getPostCommentsWhenNotLoggedIn({postId,page:commentsPage}))
          setPostComments(results?.payload?.data);
        }
      }
      fetchComments()
    }
  },[postId])

  useEffect(()=>{
    dispatch(setToReplyComment({username:'',commentId:''}))
  },[postId])
  const handlePostComment=async()=>{
    if(!currentUser._id){
      navigate("/accounts/login")
      return;
    }
    if(comment.trim()){
      if(replyComment?.commentId){
        await dispatch(postComment({postId,text:comment,toReplyCommentId:replyComment?.commentId}))
        setComment("")
        dispatch(setToReplyComment({username:'',commentId:''}))
      }else{
        await dispatch(postComment({postId,text:comment}))
        setComment("")
      }
    }
  }
  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && replyComment?.commentId &&(!comment.trim() ||inputRef.current?.selectionStart===0)) {
      dispatch(setToReplyComment({username:'',commentId:''}))
    }
  };  
  const postUpdatedTime=getTimeSinceUpdate(post?.updatedAt)
  const postUpdatedDate=getTDateSinceUpdate(post?.updatedAt)
  return (
    <div className={styles.postCardContainer}>
      <div className={styles.postCardWrapper}>
        <div className={styles.postCardImage}>
          <Carousel posts={filteredPost}/>
        </div>
        <div className={styles.postCardContentContainer}>
          <div className={styles.postCardContentHeader}>
            <div className={styles.postCardContentInnerHeader}>
              <img src={post?.userInfo?.profilePic ? post?.userInfo?.profilePic :defaultProfilePic} alt="" />
              <p>{post?.userInfo?.username}</p>
            </div>
            <IoIosMore/>
          </div>
          <div className={styles.postCardContent}>
            <div className={styles.postCardCaption}>
              <img src={post?.userInfo?.profilePic ?post?.userInfo?.profilePic :defaultProfilePic} alt="" />
              <div className={styles.postCardCaptionContent}>
                <div className={styles.postCardCaptionInnerContent}>
                  <p>{post?.userInfo?.username}</p>
                  <p className={styles.postCardCaptionInnerContentCaption}>{post?.caption}</p>
                </div>
                <p className={styles.postCardCaptionContentDate}>{postUpdatedTime}</p>
              </div>
            </div>
            <div className={styles.postCardCommentsContainer}>
              { postComments && postComments?.length >=1 &&
                postComments?.map((comment,index)=>(
                  <PostCommentCard comment={comment} key={index}/> 
                ))
              }
              {
                postComments?.length < 1 &&
                <p>This post has no comments yet</p>
              }
            </div>
          </div>
          <div className={styles.postCardInteractionSection}>
            <div className={styles.postCardInteractionSectionIcons}>
              <Interactions data={{isPostLiked:post?.isPostLiked,noOfLikes:post?.noOfLikes}} />
              <p className={styles.postCardInteractionSectionIconsDate}>
                {postUpdatedDate?.year > (new Date().getFullYear()) 
                ? `${postUpdatedDate?.date} ${postUpdatedDate?.month} ${postUpdatedDate?.year}`
                :` ${postUpdatedDate?.month} ${postUpdatedDate?.date} `
                }
              </p>
            </div>
            <div className={styles.postCardAddCommentSection}>
              <BsEmojiSmile />
              {
                replyComment && replyComment?.commentId && <p>{`@${replyComment?.username}`}</p>
              }
              {
                replyComment ? <input type="text" placeholder='' value={comment} ref={inputRef} onChange={handleInputChange} onKeyDown={handleBackspace} />
                            : <input type="text" placeholder='Add a comment...' value={comment}onChange={handleInputChange} />

              }
              <button
                disabled={! comment.trim() ? true:false} 
                onClick={handlePostComment}
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