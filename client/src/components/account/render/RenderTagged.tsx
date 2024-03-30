import React, { useEffect, useState } from 'react'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'
import { useAppDispatch } from '../../../app/hooks'
import {useParams } from 'react-router-dom'
import { getUserTaggedPosts } from '../../../app/features/accountSlice'
import { AccountPost } from './RenderPosts'

const RenderTagged:React.FC=()=> {
  const {username}=useParams()
  const dispatch=useAppDispatch()
  const [page,setPage]=useState<number>(1)
  const [taggedPosts,setTaggedPosts]=useState<AccountPost[]>([])  
  useEffect(()=>{
    if(username){
      const fetchTaggedPosts=async()=>{
        const results=await dispatch(getUserTaggedPosts({username,page}))
        setTaggedPosts(results?.payload?.data)
      }
      fetchTaggedPosts()
    }
  },[username])  
  return (
    <div className={styles.accountTaggedContent}>
   { taggedPosts && taggedPosts?.length>=1 &&
      taggedPosts.map((post, index) => (
        <div className={styles.accountPost}  key={index} >
        <PostItem 
          key={index} 
          item={post} 
          showReelIcon
        />
        </div>
      ))
    }
    {
      (!taggedPosts||taggedPosts?.length<1) && <p>No tagged posts</p>
    }
    
    </div>
    )
      
}

export default RenderTagged