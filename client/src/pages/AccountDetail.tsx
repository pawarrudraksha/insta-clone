import React, { useEffect, useState } from 'react'
import styles from '../styles/account/accountDetail.module.css'
import AccountHeader from '../components/account/AccountHeader'
import AccountHighlight from '../components/account/AccountHighlight'
import AccountPosts from '../components/account/AccountPosts'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectIsPostModalOpen } from '../app/features/viewPostSlice'
import { useParams } from 'react-router-dom'
import { getUserInfo } from '../app/features/accountSlice'
import { fetchFollowingDoc } from '../app/features/homeSlice'
import { UserType } from '../app/features/appSlice'

export interface FollowDoc{
  _id:string;
  isRequestAccepted:boolean
  userId:string;
  follower:string;
}
const AccountDetail:React.FC=()=> {
  const isPostModalOpen = useAppSelector(selectIsPostModalOpen);
  const {username}=useParams()
  const dispatch=useAppDispatch()
  const [user,setUser]=useState<UserType>({_id:'',name:'',username:'',profilePic:'',isPrivate:true})
  const [isFollow,setIsFollow]=useState<FollowDoc>({_id:'',userId:'',follower:'',isRequestAccepted:false})
  useEffect(()=>{
    if(username){
      const fetchUserInfo=async()=>{
        const data=await dispatch(getUserInfo(username))
        setUser(data?.payload?.data);
      }
      fetchUserInfo()
    }
  },[username]) 
  useEffect(()=>{
    if(user._id){
      const getFollowDoc=async()=>{
        const data=await dispatch(fetchFollowingDoc(user._id))
        setIsFollow(data?.payload?.data);
      }
      getFollowDoc()
    }
  },[user]) 
  
  return (
    <div className={`${styles.accountDetailPage} ${isPostModalOpen && styles.accountDetailActOverlay}`}>
      {user?._id?
      <div className={styles.accountDetailContainer}>
        <AccountHeader user={user} isFollow={isFollow}/>
        {(user?.isPrivate && !isFollow?._id)
        ?<div>User account is private</div>
        :<>
        <AccountHighlight/>
        <AccountPosts/>
        </>
        }
      </div>:
      <div className={styles.accountDetailContainer}>
        <p>User does not exist</p>
      </div>}
    </div>
  )
}

export default AccountDetail