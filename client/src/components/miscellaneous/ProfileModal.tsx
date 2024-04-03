import React, { useEffect, useState } from 'react'
import styles from '../../styles/miscellaneous/profileModal.module.css'
import { FiSend } from 'react-icons/fi'
import { selectProfileModalData } from '../../app/features/appSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUserPostsWhenLoggedIn } from '../../app/features/accountSlice'

interface ProfileModalProps {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

interface Post{
    post:{
        type:string;
        url:string;
    }
}
const ProfileModal: React.FC<ProfileModalProps> = ({ onMouseEnter, onMouseLeave }) => {
  const dispatch=useAppDispatch()
  const [posts,setPosts]=useState<Post[]>([])
  const profileData=useAppSelector(selectProfileModalData)
  useEffect(()=>{
    if(profileData?._id){
        const fetchPosts=async()=>{
            const posts=await dispatch(getUserPostsWhenLoggedIn({username:profileData?.username,page:1,limit:3}))
            setPosts(posts?.payload?.data)
        }
        fetchPosts()
    }
  },[])    
  return (
    <div className={styles.profileModalContainer} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
        <div className={styles.profileModalHeader}>
            <div className={styles.profileModalHeaderImage}>
                <img src={profileData?.profilePic} alt="" />
            </div>
            <div className={styles.profileModalInfo}>
                <p className={styles.profileModalInfoUsername}>{profileData?.username}</p>
                <p className={styles.profileModalInfoName}>{profileData?.name}</p>
            </div>
        </div>
        <div className={styles.profileModalAnalytics}>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{profileData?.noOfPosts}</p>
                <p>posts</p>
            </div>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{profileData?.noOfFollowers}</p>
                <p>followers</p>
            </div>
            <div className={styles.profileModalAnalyticsBox}>
                <p>{profileData?.noOfFollowing}</p>
                <p>following</p>
            </div>
        </div>
        <div className={styles.profileModalPosts}>
           {
            posts?.map((post,index)=>(
                post?.post?.type==='post' ?
                <img src={post?.post?.url} alt="" key={index} />
                :
            <video
             id={`video-${index}`}  
             loop 
             muted
             key={index}
             >
            <source src={post?.post?.url} type="video/mp4"   />
            Your browser does not support the video tag.
            </video>              
            ))
           }
        </div>
        <div className={styles.profileModalBtns}>
            <div className={styles.profileModalMessageBtn}>
                <FiSend/>
                <p>Message</p>
            </div>
            <button className={styles.profileModalFollowingBtn}>
                Following
            </button>
        </div>
    </div>
  )
}

export default ProfileModal