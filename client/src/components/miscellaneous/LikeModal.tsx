import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "../../styles/miscellaneous/likeModal.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  followUser,
  selectGetAllLikesTarget,
  toggleLikesModal,
} from "../../app/features/appSlice";
import { getAllLikes } from "../../app/features/viewPostSlice";
import { defaultProfilePic } from "../../data/common";
import { selectCurrentUser } from "../../app/features/authSlice";
import { createNotification } from "../../app/features/notificationSlice";

interface LikesType {
  _id: string;
  userInfo: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
    isPrivate: string;
  };
  isFollowing: boolean;
}
const LikeModal: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const targetInfo = useAppSelector(selectGetAllLikesTarget);
  const dispatch = useAppDispatch();
  const [likes, setLikes] = useState<LikesType[]>([]);
  const [followReqSent, setFollowReqSent] = useState<string[]>([]);
  useEffect(() => {
    if (targetInfo?._id) {
      const fetchLikes = async () => {
        const result = await dispatch(
          getAllLikes({
            targetId: targetInfo?._id,
            targetType: targetInfo?.type,
          })
        );
        setLikes(result?.payload?.data);
      };
      fetchLikes();
    }
  }, [targetInfo?._id]);

  const handleFollow = (userId: string) => {
    if (!followReqSent.includes(userId)) {
      setFollowReqSent([...followReqSent, userId]);
      dispatch(followUser(userId));
      dispatch(createNotification({ type: "follow", receiverId: userId }));
    }
  };
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div className={styles.likesOverlay}>
      <div className={styles.likesModalContainer} onClick={handleModalClick}>
        <div className={styles.likesModalHeader}>
          <p></p>
          <p>Likes</p>
          <IoMdClose onClick={() => dispatch(toggleLikesModal())} />
        </div>
        <div className={styles.likesModalContent}>
          {likes &&
            likes?.length > 0 &&
            likes.map((like, index) => (
              <div className={styles.likesModalLike} key={index}>
                <div className={styles.likesModalLikeContent}>
                  <img
                    src={like?.userInfo?.profilePic || defaultProfilePic}
                    alt="profile pic"
                  />
                  <div className={styles.likesModalLikeContentInfo}>
                    <p className={styles.likesModalLikeContentUsername}>
                      {like?.userInfo?.username}
                    </p>
                    <p className={styles.likesModalLikeContentName}>
                      {like?.userInfo?.name}
                    </p>
                  </div>
                </div>
                {currentUser?.username !== like?.userInfo?.username && (
                  <button
                    className={`${styles.likesModalFollowBtn} ${
                      like?.isFollowing && styles.likesModalFollowingBtn
                    }`}
                    onClick={() => handleFollow(like?.userInfo?._id)}
                  >
                    {like?.isFollowing ||
                    followReqSent.includes(like?.userInfo?._id)
                      ? !like?.isFollowing && like?.userInfo?.isPrivate
                        ? "Requested"
                        : "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LikeModal;
