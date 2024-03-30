import React, { useEffect, useState } from 'react'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectCurrentUser } from '../../../app/features/authSlice'
import { getUserPostsWhenLoggedIn, getUserPostsWhenNotLoggedIn } from '../../../app/features/accountSlice'

export interface AccountPost{
  isCommentsOff:boolean; 
  isHideLikesAndViews:boolean;
  isStandAlone:boolean;
  noOfComments:number;
  noOfLikes:number;
  post: {type: string, url: string};
  _id:string
}
const RenderPosts:React.FC=()=>{
  const {username}=useParams()
  const [page,setPage]=useState<number>(1)
  const [posts,setPosts]=useState<AccountPost[]>([])
  const currentUser=useAppSelector(selectCurrentUser)
  const dispatch=useAppDispatch()
  useEffect(()=>{
    if(username){
      const fetchPosts=async()=>{
        let results;
        if(currentUser?._id){
          results=await dispatch(getUserPostsWhenLoggedIn({username,page}))
        }else{
          results=await dispatch(getUserPostsWhenNotLoggedIn({username,page}))
        }
        setPosts(results?.payload?.data);
      }
      fetchPosts()
    }
  },[username])  
  return (
    <div className={styles.accountPostsContent}>
    { posts && posts.length>=1 &&
      posts?.map((post, index) => (
        <div className={styles.accountPost}  key={index} >
        <PostItem 
          item={post}
          showReelIcon
          />
        </div>
      ))
    }
    </div>
)
      
}

export default RenderPosts