import React from 'react';
import styles from "../../styles/account/accountHeader.module.css"
import { IoIosArrowDown } from "react-icons/io";
import { LuMoreHorizontal } from "react-icons/lu";
import { BsThreads } from 'react-icons/bs';
import { GoPersonAdd } from 'react-icons/go';
import { PiLinkSimpleLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { FollowDoc } from '../../pages/AccountDetail';
import { UserType } from '../../app/features/appSlice';


const AccountHeader: React.FC<{user:UserType,isFollow:FollowDoc}> = ({user,isFollow}) => {
  return (
    <div className={styles.accountHeaderContainer}>
    <div className={styles.accountHeaderImageContainer}>
      <img src={user?.profilePic} alt="Profile Picture" />
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
        <button  className={styles.accountHeaderContentBtn}>
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
          {user?.website &&<Link to={`${user?.website}`} className={styles.accountHeaderLink}>
            <PiLinkSimpleLight/>
            <p>{user?.website}</p>
          </Link>     }
      </div>
    </div>
    </div>
  );
};

export default AccountHeader;
