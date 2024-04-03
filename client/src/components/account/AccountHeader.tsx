import React from 'react';
import styles from "../../styles/account/accountHeader.module.css"
import { IoIosArrowDown } from "react-icons/io";
import { LuMoreHorizontal } from "react-icons/lu";
import { BsThreads } from 'react-icons/bs';
import { GoPersonAdd } from 'react-icons/go';
import { PiLinkSimpleLight } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { FollowDoc } from '../../pages/AccountDetail';
import { UserType } from '../../app/features/appSlice';
import { useAppDispatch } from '../../app/hooks';
import { createChat, findChat } from '../../app/features/messagesSlice';
import { defaultProfilePic } from '../../data/common';


const AccountHeader: React.FC<{user:UserType,isFollow:FollowDoc}> = ({user,isFollow}) => {  
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const handleCreateChat=async()=>{
    const item=[user?._id]
    const chat=await dispatch(findChat(user?._id))
    
    if(chat?.payload?.data?._id){
      navigate(`/direct/t/${chat?.payload?.data?._id}`)
    }else{
      const result=await dispatch(createChat(item))
      if(result?.payload?.data?._id){
          navigate(`/direct/t/${result?.payload?.data?._id}`)
        }
    }
  }
  return (
    <div className={styles.accountHeaderContainer}>
    <div className={styles.accountHeaderImageContainer}>
      <img src={user?.profilePic ? user?.profilePic : defaultProfilePic} alt="Profile Picture" />
    </div>
    <div className={styles.accountHeaderContent}>

      <div className={styles.accountHeaderContentTitle}>
        <p className={styles.accountHeaderContentUsername}>{user?.username}</p>
        <button className={`${styles.accountHeaderContentBtn} ${!isFollow?._id && styles.accountHeaderFollowBtn}`}>
          {isFollow?._id ?
          <>
          {isFollow?.isRequestAccepted ?<p>Following</p>:<p>Requested</p>}
          <IoIosArrowDown/>
          </>
          :<p>Follow</p>}
        </button>
        <button  className={styles.accountHeaderContentBtn} onClick={handleCreateChat}>
          Message
        </button>
        <div className={styles.accountHeaderContentSimilarAccountsBtn}>
        <GoPersonAdd />
        </div>
        <LuMoreHorizontal/>
      </div>

      <div className={styles.accountHeaderContentAnalytics}>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{user?.noOfPosts}</p>
              <p>posts</p>
            </div>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{user?.noOfFollowers}</p>
              <p>followers</p>
            </div>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{user?.noOfFollowing}</p>
              <p>following</p>
            </div>
       </div>

      <div className={styles.accountHeaderContentDescription}>
          <p className={styles.accountHeaderContentDescriptionName}>{user?.name}</p>
          <div className={styles.accountHeaderContentDescriptionThreads}>
            <BsThreads/>
            <p>{user?.username}</p>
          </div>
          <div className={styles.accountHeaderContentDescriptionInfo}>
          {user?.bio?.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
            ))}     
            </div>
          {user?.website &&<Link to={`https://${user?.website}`} target='_blank' className={styles.accountHeaderLink}>
            <PiLinkSimpleLight/>
            <p>{user?.website}</p>
          </Link>     }
      </div>
    </div>
    </div>
  );
};

export default AccountHeader;
