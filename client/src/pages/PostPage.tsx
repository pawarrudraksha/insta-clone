import React, { useEffect, useState } from 'react'
import styles from '../styles/posts/postPage.module.css'
import PostCard from '../components/posts/miscellaneous/PostCard'
import PostItem from '../components/miscellaneous/PostItem'
import Footer from '../components/miscellaneous/Footer'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../app/features/authSlice'
import { closePostModal, getPostByIdWhenLoggedIn, getPostByIdWhenNotLoggedIn, selectIsPostModalOpen } from '../app/features/viewPostSlice'
import { fetchFollowerDoc } from '../app/features/homeSlice'
import { getUserPostsWhenLoggedIn, getUserPostsWhenNotLoggedIn } from '../app/features/accountSlice'
import { AccountPost } from '../components/account/render/RenderPosts'


interface Post{
  userInfo:{
    _id:string;
    username:string;
    profilePic:string;
    isPrivate:boolean;
    noOfPostsOfUser:number
  };
  updatedAt:string;
  caption:string;
  noOfLikes:number;
  _id:string;
}

const PostPage:React.FC = () => {
  const currentUser=useAppSelector(selectCurrentUser)
  const postId=window.location.pathname.slice(3)
  const [post,setPost]=useState<Post>({_id:'',caption:'',userInfo:{_id:'',profilePic:'',username:'',isPrivate:true,noOfPostsOfUser:-1},updatedAt:'',noOfLikes:-1})
  const [userPosts,setUserPosts]=useState<AccountPost[]>([])
  const isPostModalOpen=useAppSelector(selectIsPostModalOpen)
  const [isAccessToPost,setIsAccessToPost]=useState<boolean>(false)
  const dispatch=useAppDispatch()
  useEffect(()=>{ 
    if(postId){
      const fetchPosts=async()=>{
        if(currentUser?._id){
          const response=await dispatch(getPostByIdWhenLoggedIn(postId))
          setPost(response?.payload?.data);
        }else{
          const response=await dispatch(getPostByIdWhenNotLoggedIn(postId))
          setPost(response?.payload?.data);
        }
      }
      fetchPosts()
    }
  },[postId])
  
  useEffect(()=>{
    if(postId && post?._id){
      const accessCheck=async()=>{
        if(currentUser && currentUser?._id){
          const isFollow=await dispatch(fetchFollowerDoc(post?.userInfo?._id))
          if(isFollow?.payload?.data && isFollow?.payload?.data?._id){
            setIsAccessToPost(true)
          }else if(currentUser?._id===post?.userInfo?._id){
            setIsAccessToPost(true)
          }
        }else if(!post?.userInfo?.isPrivate){
          setIsAccessToPost(true)
        }
      }
      accessCheck()
    }
  },[postId,post])
  
  useEffect(()=>{
    if(post && post?._id && postId && isAccessToPost){
      const fetchUserPosts=async()=>{
        if(currentUser?._id){
          const results=await dispatch(getUserPostsWhenLoggedIn({username:post?.userInfo?.username,page:1,filterPost:postId}))
          setUserPosts(results?.payload?.data);
        }else{
          const results=await dispatch(getUserPostsWhenNotLoggedIn({username:post?.userInfo?.username,page:1,filterPost:postId}))
          setUserPosts(results?.payload?.data);
        }
      }
      fetchUserPosts()
    }
  },[isAccessToPost,post])

  useEffect(()=>{
    if(isPostModalOpen){
      dispatch(closePostModal())
    }
  },[])
  return (
    <>
   {isAccessToPost ? <div className={styles.postPageContainer}>
      <div className={styles.postPageCardWrapper}>
        <PostCard/>
      </div>
      {post?.userInfo?.noOfPostsOfUser>1 && <div className={styles.morePostContainer}>
        <div className={styles.morePostContainerTitle}>
          <p>More posts from</p> 
          <p>{post?.userInfo?.username}</p>
        </div>
        <div className={styles.morePosts}>
          { userPosts && userPosts?.length>=1 &&
            userPosts?.map((post,index)=>(
              <div className={styles.postItem} key={index}>
              <PostItem item={post} showReelIcon />
              </div>
            ))
          }
        </div>
      </div>}
      <div className={styles.postPageFooter}>
        <Footer isPost={true}/>
      </div>
    </div>:<p>This is not the post you are looking for</p>}
    </>
  )
}

export default PostPage