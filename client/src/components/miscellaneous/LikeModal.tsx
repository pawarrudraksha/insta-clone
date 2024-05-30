import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "../../styles/miscellaneous/likeModal.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGetAllLikesTarget } from "../../app/features/appSlice";
import { getAllLikes } from "../../app/features/viewPostSlice";
import { defaultProfilePic } from "../../data/common";

interface LikesType {
  _id: string;
  userInfo: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
  };
}
const LikeModal: React.FC = () => {
  const targetInfo = useAppSelector(selectGetAllLikesTarget);
  const dispatch = useAppDispatch();
  const [likes, setLikes] = useState<LikesType[]>([]);
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

  return (
    <div className={styles.likesOverlay}>
      <div className={styles.likesModalContainer}>
        <div className={styles.likesModalHeader}>
          <p></p>
          <p>Likes</p>
          <IoMdClose />
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
                <button className={styles.likesModalFollowBtn}>Follow</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LikeModal;
