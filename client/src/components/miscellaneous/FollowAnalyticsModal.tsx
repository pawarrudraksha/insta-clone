import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "../../styles/miscellaneous/followAnalyticsModal.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { defaultProfilePic } from "../../data/common";
import { selectCurrentUser } from "../../app/features/authSlice";
import {
  fetchFollowers,
  fetchFollowing,
  selectFollowAnalyticsTargetUser,
  selectIsFollowersModalOpen,
  selectIsFollowingModalOpen,
  toggleIsFollowersModalOpen,
  toggleIsFollowingModalOpen,
} from "../../app/features/accountSlice";

interface FollowAnalyticsType {
  _id: string;
  followingDetails?: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
    isPrivate: string;
    hasStory: boolean;
  };
  followerDetails?: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
    isPrivate: string;
    hasStory: boolean;
  };
}
const FollowAnalyticsModal: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const targetUser = useAppSelector(selectFollowAnalyticsTargetUser);
  const dispatch = useAppDispatch();
  const [followDocs, setFollowDocs] = useState<FollowAnalyticsType[]>([]);
  const isFollowingModalOpen = useAppSelector(selectIsFollowingModalOpen);
  const isFollowerModalOpen = useAppSelector(selectIsFollowersModalOpen);
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (targetUser) {
      const fetchFollowDocs = async () => {
        let result;
        if (isFollowerModalOpen) {
          result = await dispatch(fetchFollowers({ page, userId: targetUser }));
        }
        if (isFollowingModalOpen) {
          result = await dispatch(fetchFollowing({ page, userId: targetUser }));
        }
        setFollowDocs(result?.payload?.data);
      };
      fetchFollowDocs();
    }
  }, [targetUser]);

  //   const handleFollow = (userId: string) => {
  //     if (!followReqSent.includes(userId)) {
  //       setFollowReqSent([...followReqSent, userId]);
  //       dispatch(followUser(userId));
  // dispatch(createNotification({ type: "follow", receiverId: user?._id }));

  //     }
  const handleClose = () => {
    if (isFollowerModalOpen) {
      dispatch(toggleIsFollowersModalOpen());
    }
    if (isFollowingModalOpen) {
      dispatch(toggleIsFollowingModalOpen());
    }
  };
  console.log(followDocs);

  return (
    <div className={styles.followOverlay}>
      <div
        className={styles.followModalContainer}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.followModalHeader}>
          <p></p>
          <p>{isFollowerModalOpen ? "Followers" : "Following"}</p>
          <IoMdClose onClick={handleClose} />
        </div>
        {isFollowerModalOpen && (
          <div className={styles.followModalContent}>
            {followDocs &&
              followDocs?.length > 0 &&
              followDocs.map((doc, index) => (
                <div className={styles.followModalFollow} key={index}>
                  <div
                    className={`${styles.followModalFollowContent} ${
                      doc?.followerDetails?.hasStory &&
                      styles.followModalContentActiveStory
                    }`}
                  >
                    <img
                      src={
                        doc?.followerDetails?.profilePic || defaultProfilePic
                      }
                      alt="profile pic"
                    />
                    <div className={styles.followModalFollowContentInfo}>
                      <p className={styles.followModalFollowContentUsername}>
                        {doc?.followerDetails?.username}
                      </p>
                      <p className={styles.followModalFollowContentName}>
                        {doc?.followerDetails?.name}
                      </p>
                    </div>
                  </div>
                  {/* {currentUser?.username !== doc?.userInfo?.username && (
                    <button
                      className={`${styles.followModalFollowBtn} ${
                        doc?.isFollowing && styles.followModalFollowingBtn
                      }`}
                      onClick={() => handleFollow(follow?.userInfo?._id)}
                    >
                      {follow?.isFollowing ||
                      followReqSent.includes(follow?.userInfo?._id)
                        ? !follow?.isFollowing && follow?.userInfo?.isPrivate
                          ? "Requested"
                          : "Following"
                        : "Follow"}
                    </button>
                  )} */}
                </div>
              ))}
          </div>
        )}
        {isFollowingModalOpen && (
          <div className={styles.followModalContent}>
            {followDocs &&
              followDocs?.length > 0 &&
              followDocs.map((doc, index) => (
                <div className={styles.followModalFollow} key={index}>
                  <div
                    className={`${styles.followModalFollowContent} ${
                      doc?.followingDetails?.hasStory &&
                      styles.followModalContentActiveStory
                    }`}
                  >
                    <img
                      src={
                        doc?.followingDetails?.profilePic || defaultProfilePic
                      }
                      alt="profile pic"
                    />
                    <div className={styles.followModalFollowContentInfo}>
                      <p className={styles.followModalFollowContentUsername}>
                        {doc?.followingDetails?.username}
                      </p>
                      <p className={styles.followModalFollowContentName}>
                        {doc?.followingDetails?.name}
                      </p>
                    </div>
                  </div>
                  {/* {currentUser?.username !== follow?.userInfo?.username && (
                    <button
                      className={`${styles.followModalFollowBtn} ${
                        follow?.isFollowing && styles.followModalFollowingBtn
                      }`}
                      onClick={() => handleFollow(follow?.userInfo?._id)}
                    >
                      {follow?.isFollowing ||
                      followReqSent.includes(follow?.userInfo?._id)
                        ? !follow?.isFollowing && follow?.userInfo?.isPrivate
                          ? "Requested"
                          : "Following"
                        : "Follow"}
                    </button>
                  )} */}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowAnalyticsModal;
