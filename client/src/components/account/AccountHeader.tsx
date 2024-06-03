import React from "react";
import styles from "../../styles/account/accountHeader.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuMoreHorizontal } from "react-icons/lu";
import { BsThreads } from "react-icons/bs";
import { GoPersonAdd } from "react-icons/go";
import { PiLinkSimpleLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { FollowDoc } from "../../pages/AccountDetail";
import { UserType, followUser } from "../../app/features/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createChat, findChat } from "../../app/features/messagesSlice";
import { defaultProfilePic } from "../../data/common";
import { selectCurrentUser } from "../../app/features/authSlice";
import {
  selectIsAccountUnfollowModal,
  selectIsFollowersModalOpen,
  selectIsFollowingModalOpen,
  setFollowAnalyticsTargetUser,
  toggleAccountUnfollowModal,
  toggleIsFollowersModalOpen,
  toggleIsFollowingModalOpen,
} from "../../app/features/accountSlice";
import UnfollowModal from "../miscellaneous/UnfollowModal";
import { createNotification } from "../../app/features/notificationSlice";

const AccountHeader: React.FC<{ user: UserType; isFollow: FollowDoc }> = ({
  user,
  isFollow,
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isFollowersModalOpen = useAppSelector(selectIsFollowersModalOpen);
  const isFollowingModalOpen = useAppSelector(selectIsFollowingModalOpen);
  const navigate = useNavigate();
  const handleCreateChat = async () => {
    if (currentUser?._id) {
      const item = [user?._id];
      const chat = await dispatch(findChat(user?._id));

      if (chat?.payload?.data?._id) {
        navigate(`/direct/t/${chat?.payload?.data?._id}`);
      } else {
        const result = await dispatch(createChat(item));
        if (result?.payload?.data?._id) {
          navigate(`/direct/t/${result?.payload?.data?._id}`);
        }
      }
    }
  };
  const handleToggleFollow = () => {
    if (currentUser?._id) {
      if (isFollow?._id) {
        dispatch(toggleAccountUnfollowModal());
      } else {
        dispatch(followUser(user?._id));
        dispatch(createNotification({ type: "follow", receiverId: user?._id }));
        window.location.reload();
      }
    }
  };
  const IsAccountUnfollowModal = useAppSelector(selectIsAccountUnfollowModal);
  const notDisableBtn =
    currentUser?._id !== "" &&
    ((isFollow && isFollow?.isRequestAccepted) ||
      currentUser?._id === user?._id);
  const handleShowFollowers = () => {
    if (isFollowingModalOpen) {
      dispatch(toggleIsFollowingModalOpen());
    }
    dispatch(setFollowAnalyticsTargetUser(user?._id));
    dispatch(toggleIsFollowersModalOpen());
  };
  const handleShowFollowing = () => {
    if (isFollowersModalOpen) {
      dispatch(toggleIsFollowersModalOpen());
    }
    dispatch(setFollowAnalyticsTargetUser(user?._id));
    dispatch(toggleIsFollowingModalOpen());
  };

  return (
    <div className={styles.mobileAccountHeaderWrapper}>
      <div className={styles.accountHeaderContainer}>
        <div className={styles.accountHeaderImageContainer}>
          <img
            src={user?.profilePic ? user?.profilePic : defaultProfilePic}
            alt="Profile Picture"
          />
        </div>
        <div className={styles.accountHeaderContent}>
          {currentUser?._id !== user?._id && (
            <div className={styles.accountHeaderContentTitle}>
              <p className={styles.accountHeaderContentUsername}>
                {user?.username}
              </p>
              <button
                className={`${styles.accountHeaderContentBtn} ${
                  !isFollow?._id && styles.accountHeaderFollowBtn
                }`}
                onClick={handleToggleFollow}
              >
                {isFollow?._id ? (
                  <>
                    {isFollow?.isRequestAccepted ? (
                      <p>Following</p>
                    ) : (
                      <p>Requested</p>
                    )}
                    {IsAccountUnfollowModal ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </>
                ) : (
                  <p>Follow</p>
                )}
              </button>
              <button
                className={styles.accountHeaderContentBtn}
                onClick={handleCreateChat}
              >
                Message
              </button>
              <div className={styles.accountHeaderContentSimilarAccountsBtn}>
                <GoPersonAdd />
              </div>
              <LuMoreHorizontal />
              {IsAccountUnfollowModal && (
                <div className={styles.accountHeaderUnfollowModalWrapper}>
                  <UnfollowModal
                    userId={user?._id}
                    isRequestAccepted={isFollow?.isRequestAccepted}
                    followDocId={isFollow?._id}
                  />
                </div>
              )}
            </div>
          )}

          <div className={styles.accountHeaderContentAnalytics}>
            <div className={styles.accountHeaderContentAnalyticsBox}>
              <p>{user?.noOfPosts}</p>
              <p>posts</p>
            </div>
            <button
              className={styles.accountHeaderContentAnalyticsBox}
              disabled={!notDisableBtn}
              onClick={handleShowFollowers}
            >
              <p>{user?.noOfFollowers}</p>
              <p>followers</p>
            </button>
            <button
              className={styles.accountHeaderContentAnalyticsBox}
              disabled={!notDisableBtn}
              onClick={handleShowFollowing}
            >
              <p>{user?.noOfFollowing}</p>
              <p>following</p>
            </button>
          </div>

          <div className={styles.accountHeaderContentDescription}>
            <p className={styles.accountHeaderContentDescriptionName}>
              {user?.name}
            </p>
            <div className={styles.accountHeaderContentDescriptionThreads}>
              <BsThreads />
              <p>{user?.username}</p>
            </div>
            <div className={styles.accountHeaderContentDescriptionInfo}>
              {user?.bio?.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            {user?.website && (
              <Link
                to={`https://${user?.website}`}
                target="_blank"
                className={styles.accountHeaderLink}
              >
                <PiLinkSimpleLight />
                <p>{user?.website}</p>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles.accountHeaderContentDescriptionMobile}>
        <p className={styles.accountHeaderContentDescriptionName}>
          {user?.name}
        </p>
        <div className={styles.accountHeaderContentDescriptionThreads}>
          <BsThreads />
          <p>{user?.username}</p>
        </div>
        <div className={styles.accountHeaderContentDescriptionInfo}>
          {user?.bio?.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        {user?.website && (
          <Link
            to={`https://${user?.website}`}
            target="_blank"
            className={styles.accountHeaderLink}
          >
            <PiLinkSimpleLight />
            <p>{user?.website}</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AccountHeader;
