import React, { useState } from "react";
import styles from "../../../styles/home/homeSuggestionCard.module.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  closeSuggestionProfileModal,
  openSuggestionProfileModal,
  selectActiveSuggestionProfileModal,
  selectSuggestionProfileModal,
  setActiveSuggestionProfileModal,
} from "../../../app/features/homeSlice";
import ProfileModal from "../../miscellaneous/ProfileModal";
import { SuggestionUser } from "./HomeSuggestions";
import { getUserInfo } from "../../../app/features/accountSlice";
import {
  followUser,
  setProfileModalData,
} from "../../../app/features/appSlice";
import { selectCurrentUser } from "../../../app/features/authSlice";
import { defaultProfilePic } from "../../../data/common";
import { Link } from "react-router-dom";
import { createNotification } from "../../../app/features/notificationSlice";

interface Props {
  isSelf?: boolean;
  user: SuggestionUser;
}

const HomeSuggestionCard: React.FC<Props> = ({ isSelf, user }) => {
  const suggestionProfileModal = useAppSelector(selectSuggestionProfileModal);
  const [isHovered, setIsHovered] = useState<string>("");
  const currentUser = useAppSelector(selectCurrentUser);
  const [hasFollowedList, setHasFollowedList] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const handleMouseEnter = async () => {
    if (user?._id !== currentUser?._id) {
      dispatch(setActiveSuggestionProfileModal(user._id));
      dispatch(openSuggestionProfileModal());
      const result = await dispatch(getUserInfo(user?.username));
      dispatch(setProfileModalData(result?.payload?.data));
      setIsHovered(user?._id);
    } else {
      setIsHovered("");
    }
  };

  const handleMouseLeave = () => {
    dispatch(closeSuggestionProfileModal());
    setIsHovered("");
  };
  const handleFollow = () => {
    if (user?._id && !hasFollowedList.includes(user?._id)) {
      dispatch(followUser(user?._id));
      dispatch(createNotification({ type: "follow", receiverId: user?._id }));
      setHasFollowedList([...hasFollowedList, user?._id]);
      console.log(user?._id);
    }
  };
  return (
    <div className={styles.homeSuggestionCard} onMouseLeave={handleMouseLeave}>
      <div className={styles.homeSuggestionCardImg}>
        <img src={user?.profilePic || defaultProfilePic} alt="" />
      </div>
      <div className={styles.homeSuggestionCardContent}>
        <Link
          className={styles.homeSuggestionCardInfoName}
          onMouseEnter={handleMouseEnter}
          to={`/${user?.username}`}
        >
          {user?.username}
        </Link>
        {isSelf ? (
          <p className={styles.homeSuggestionCardInfoIsSelf}>{user?.name}</p>
        ) : (
          <p className={styles.homeSuggestionCardInfo}>
            {user?.isFollower ? "Follows you" : "Suggested for you"}
          </p>
        )}
      </div>
      <button
        className={styles.homeSuggestionsFollowBtn}
        onClick={handleFollow}
      >
        {isSelf
          ? "Switch"
          : hasFollowedList.includes(user?._id)
          ? "Following"
          : "Follow"}
      </button>
      {isHovered === user?._id && suggestionProfileModal && (
        <ProfileModal
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
};

export default HomeSuggestionCard;
