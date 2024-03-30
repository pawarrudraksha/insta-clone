import React, { useEffect, useState } from 'react'
import styles from "../../../styles/account/renderContent.module.css"
import PostItem from '../../miscellaneous/PostItem'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {  getUserReelsWhenLoggedIn, getUserReelsWhenNotLoggedIn } from '../../../app/features/accountSlice'
import { selectCurrentUser } from '../../../app/features/authSlice'
import { AccountPost } from './RenderPosts'

interface AccountReel{
    _id: string;
    isHideLikesAndViews: boolean;
    updatedAt:string;
    noOfComments: number;
    noOfLikes: number;
    url: string
}
const RenderReels:React.FC=()=> {
  const {username}=useParams()
  const [page,setPage]=useState<number>(1)
  const [userReels,setUserReels]=useState<AccountPost[]>([])
  const currentUser=useAppSelector(selectCurrentUser)
  const dispatch=useAppDispatch()
  useEffect(() => {
    if (username) {
      const fetchPosts = async () => {
        let results;
        if (currentUser?._id) {
          results = await dispatch(getUserReelsWhenLoggedIn({ username, page }));
        } else {
          results = await dispatch(getUserReelsWhenNotLoggedIn({ username, page }));
        }
  
        let updatedResults: AccountPost[] = [];
        if (results?.payload?.data?.length >= 1) {
          updatedResults = await Promise.all(results.payload.data.map((item: AccountReel, index: number) => {
            return {
              _id: item._id,
              isHideLikesAndViews: item.isHideLikesAndViews,
              updatedAt: item.updatedAt,
              noOfComments: item.noOfComments,
              noOfLikes: item.noOfLikes,
              post: {
                type: 'reel',
                url: item.url
              },
              isStandAlone: true,
              isCommentsOff: false
            };
          }));
        }
        setUserReels(updatedResults);
      };
      fetchPosts();
    }
  }, [username]);
  
   
  return (
    <div className={styles.accountReelsContent}>
    { userReels && userReels?.length>=1 &&
      userReels?.map((reel, index) => (
        <div className={styles.accountPost}  key={index} >
          <PostItem 
            key={index} 
            item={reel} 
            showReelIcon={false}
          />
        </div>
      ))
    }
    {
      userReels && userReels?.length<1 &&
      <p>{username} has not posted any reels yet</p>
    }
    </div>
    )
      
}

export default RenderReels