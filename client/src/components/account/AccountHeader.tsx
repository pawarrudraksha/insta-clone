import React from 'react';
import { accountData } from '../../data/sampleAccount';
import styles from "../../styles/account/accountHeader.module.css"
import { IoIosArrowDown } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { LuMoreHorizontal } from "react-icons/lu";
import { BsThreads } from 'react-icons/bs';
import { GoPersonAdd } from 'react-icons/go';
import { PiLinkSimpleLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';


interface HeaderData {
  profilePic: string;
  username: string;
  noOfPosts: number;
  noOfFollowers: number;
  following:number,
  name: string;
  description: string;
  link: string;
}

// Type assertion
const accountHeaderData = accountData as HeaderData;

const AccountHeader: React.FC = () => {
  return (
    <div className={styles.accountHeaderContainer}>
    <div className={styles.accountHeaderImageContainer}>
      <img src={accountHeaderData.profilePic} alt="Profile Picture" />
    </div>
    <div className={styles.accountHeaderContent}>

      <div className={styles.accountHeaderContentTitle}>
        <p className={styles.accountHeaderContentUsername}>{accountHeaderData.username}</p>
        <button className={styles.accountHeaderContentBtn}>
          <p>Following</p>
          <IoIosArrowDown/>
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
              <p>{accountHeaderData.noOfPosts}</p>
              <p>posts</p>
            </div>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{accountHeaderData.noOfFollowers}</p>
              <p>followers</p>
            </div>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{accountHeaderData.following}</p>
              <p>following</p>
            </div>
       </div>

      <div className={styles.accountHeaderContentDescription}>
          <p className={styles.accountHeaderContentDescriptionName}>{accountHeaderData.name}</p>
          <div className={styles.accountHeaderContentDescriptionThreads}>
            <BsThreads/>
            <p>{accountHeaderData.username}</p>
          </div>
          <div className={styles.accountHeaderContentDescriptionInfo}>
          {accountHeaderData.description.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
            ))}     
            </div>
      <Link to={`${accountHeaderData?.link}`} className={styles.accountHeaderLink}>
        <PiLinkSimpleLight/>
        <p>{accountHeaderData?.link}</p>
      </Link>     
      </div>
    </div>
    </div>
  );
};

export default AccountHeader;
