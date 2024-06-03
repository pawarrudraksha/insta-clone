import React, { useEffect, useState } from "react";
import styles from "../../styles/miscellaneous/profileModal.module.css";
import { FiSend } from "react-icons/fi";
import {
  followUser,
  selectProfileModalData,
} from "../../app/features/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserPostsWhenLoggedIn } from "../../app/features/accountSlice";
import { Link, useNavigate } from "react-router-dom";
import { defaultProfilePic } from "../../data/common";
import { createChat, findChat } from "../../app/features/messagesSlice";
import { createNotification } from "../../app/features/notificationSlice";

interface ProfileModalProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface Post {
  post: {
    type: string;
    url: string;
  };
}
const ProfileModal: React.FC<ProfileModalProps> = ({
  onMouseEnter,
  onMouseLeave,
}) => {
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<Post[]>([]);
  const profileData = useAppSelector(selectProfileModalData);
  const [isReqSent, setIsReqSent] = useState<boolean>(false);
  useEffect(() => {
    if (profileData?._id) {
      const fetchPosts = async () => {
        const posts = await dispatch(
          getUserPostsWhenLoggedIn({
            username: profileData?.username,
            page: 1,
            limit: 3,
          })
        );
        setPosts(posts?.payload?.data);
      };
      fetchPosts();
    }
  }, []);
  const handleFollowUser = () => {
    dispatch(followUser(profileData?._id));
    dispatch(
      createNotification({ type: "follow", receiverId: profileData?._id })
    );
    setIsReqSent(true);
  };
  const navigate = useNavigate();
  const handleChat = async () => {
    const result = await dispatch(findChat(profileData?._id));
    let chatId = result?.payload?.data?._id;
    if (chatId) {
      navigate(`/direct/t/${chatId}`);
    } else {
      const res = await dispatch(createChat([profileData?._id]));
      chatId = res?.payload?.data?._id;
      navigate(`/direct/t/${chatId}`);
    }
  };
  return (
    <div
      className={styles.profileModalContainer}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.profileModalHeader}>
        <div className={styles.profileModalHeaderImage}>
          <img src={profileData?.profilePic || defaultProfilePic} alt="" />
        </div>
        <div className={styles.profileModalInfo}>
          <Link
            to={`/${profileData?.username}`}
            className={styles.profileModalInfoUsername}
          >
            {profileData?.username}
          </Link>
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
        {posts?.map((post, index) =>
          post?.post?.type === "post" ? (
            <img src={post?.post?.url} alt="" key={index} />
          ) : (
            <video id={`video-${index}`} loop muted key={index}>
              <source src={post?.post?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>
      <div className={styles.profileModalBtns}>
        <button className={styles.profileModalMessageBtn} onClick={handleChat}>
          <FiSend />
          <p>Message</p>
        </button>
        <button
          className={styles.profileModalFollowingBtn}
          onClick={handleFollowUser}
        >
          {isReqSent
            ? profileData?.isPrivate
              ? "Requested"
              : "Following"
            : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
