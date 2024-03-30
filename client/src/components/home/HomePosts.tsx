import React, { useEffect, useState } from 'react'
import HomePost from './miscellaneous/HomePost'
import styles from '../../styles/home/homePosts.module.css'
import { useAppDispatch } from '../../app/hooks'
import { getUserFeed } from '../../app/features/homeSlice'

export interface Post {
  type:string;
  url:string
}

export interface HomePostData{
  isCommentsOff:boolean;
  isHideLikesAndViews:boolean
  noOfComments:number;
  noOfLikes:number;
  caption?:string;
  posts:Post[];
  taggedUsers:[];
  updatedAt:string;
  userInfo:{
    username:string;
    profilePic?:string;
  };
  _id:string
}
const HomePosts:React.FC = () => {
  const dispatch=useAppDispatch()
  const [page,setPage]=useState<number>(1)
  const [feed,setFeed]=useState<HomePostData[]>([])
  useEffect(()=>{
    const fetchFeed=async()=>{
      const results=await dispatch(getUserFeed(page))
      setFeed(results.payload?.data);
    }
    fetchFeed()
  },[])  
  return (
    <div className={styles.homePosts}>
       { feed && feed?.length>1 && feed.map((post,index)=>(
          <HomePost data={post} key={index}/> 
        ))
      }
    </div>
  )
}

export default HomePosts