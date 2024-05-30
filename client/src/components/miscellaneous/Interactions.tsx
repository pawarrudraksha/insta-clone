import React from "react";
import styles from "../../styles/miscellaneous/interactions.module.css";
import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useAppDispatch } from "../../app/hooks";
import { openPostModal } from "../../app/features/viewPostSlice";
import {
  setGetAllLikesTargetInfo,
  toggleLikesModal,
} from "../../app/features/appSlice";
import { useNavigate } from "react-router-dom";

interface InteractionsProps {
  noOfLikes: number;
  isPostLiked: boolean;
  _id: string;
}
interface Props {
  data: InteractionsProps;
}
const Interactions: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleCommentClick = () => {
    if (window.innerWidth > 768) {
      dispatch(openPostModal());
      window.history.pushState(null, "", `/p/${data?._id}`);
    } else {
      navigate(`/p/${data?._id}`);
    }
  };
  const handleNoOfLikesClick = () => {
    if (data?.noOfLikes > 0) {
      dispatch(toggleLikesModal());
      dispatch(setGetAllLikesTargetInfo({ _id: data?._id, type: "post" }));
    }
  };
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div className={styles.interactions} onClick={handleContainerClick}>
      <div className={styles.interactionsIcons}>
        <div className={styles.interactionsIconsReact}>
          {!data?.isPostLiked && <FaRegHeart />}
          {data?.isPostLiked && <FaHeart className={styles.likedPostIcon} />}
          <FaRegComment onClick={handleCommentClick} />
          <FiSend />
        </div>
        <div>
          <FaRegBookmark />
        </div>
      </div>
      {data?.noOfLikes && data?.noOfLikes > 1 ? (
        <button onClick={handleNoOfLikesClick}>{data?.noOfLikes} likes</button>
      ) : (
        <button onClick={handleNoOfLikesClick}>{data?.noOfLikes} like</button>
      )}
    </div>
  );
};

export default Interactions;
