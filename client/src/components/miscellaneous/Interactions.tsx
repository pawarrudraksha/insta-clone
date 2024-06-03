import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/miscellaneous/interactions.module.css";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actionOnPost,
  openPostModal,
  savePost,
  unsavePost,
} from "../../app/features/viewPostSlice";
import {
  setGetAllLikesTargetInfo,
  toggleLikesModal,
} from "../../app/features/appSlice";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../app/features/authSlice";
import {
  createNotification,
  deleteNotification,
} from "../../app/features/notificationSlice";
import {
  setSharePostId,
  toggleSharePostToChatModal,
} from "../../app/features/messagesSlice";

interface InteractionsProps {
  ownerId: string;
  noOfLikes: number;
  isPostLiked: boolean;
  _id: string;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
  setNoOfLikes: Dispatch<SetStateAction<number>>;
  isCommentsOff?: boolean;
  isHideLikesAndViews?: boolean;
  isPostSaved: boolean;
}
interface Props {
  data: InteractionsProps;
}
const Interactions: React.FC<Props> = ({ data }) => {
  const [isPostSaved, setIsPostSaved] = useState<boolean>(data?.isPostSaved);
  const currentUser = useAppSelector(selectCurrentUser);
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
  const handleLikePost = () => {
    if (data?.isPostLiked) {
      dispatch(
        actionOnPost({
          targetId: data?._id,
          targetType: "post",
          action: "unlike",
        })
      );
      if (currentUser?._id !== data?.ownerId) {
        dispatch(deleteNotification(data?._id));
      }
      data?.setIsLiked(false);
      data?.setNoOfLikes((prev) => prev - 1);
    } else {
      dispatch(
        actionOnPost({
          targetId: data?._id,
          targetType: "post",
          action: "like",
        })
      );
      if (currentUser?._id !== data?.ownerId) {
        dispatch(
          createNotification({
            type: "like",
            receiverId: data?.ownerId,
            postId: data?._id,
          })
        );
      }
      data?.setIsLiked(true);
      data?.setNoOfLikes((prev) => prev + 1);
    }
  };

  const handleSavePost = () => {
    if (isPostSaved) {
      dispatch(unsavePost(data?._id));
      setIsPostSaved(false);
    } else {
      dispatch(savePost(data?._id));
      setIsPostSaved(true);
    }
  };
  const handleSharePost = () => {
    dispatch(setSharePostId(data?._id));
    dispatch(toggleSharePostToChatModal());
  };
  return (
    <div className={styles.interactions} onClick={handleContainerClick}>
      <div className={styles.interactionsIcons}>
        <div className={styles.interactionsIconsReact}>
          {!data?.isPostLiked && <FaRegHeart onClick={handleLikePost} />}
          {data?.isPostLiked && (
            <FaHeart
              className={styles.likedPostIcon}
              onClick={handleLikePost}
            />
          )}
          {!data?.isCommentsOff && (
            <FaRegComment onClick={handleCommentClick} />
          )}
          <button onClick={handleSharePost}>
            <FiSend />
          </button>
        </div>
        <button onClick={handleSavePost}>
          {isPostSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      {!data?.isHideLikesAndViews && data?.noOfLikes && data?.noOfLikes > 1 ? (
        <button onClick={handleNoOfLikesClick}>{data?.noOfLikes} likes</button>
      ) : (
        <button onClick={handleNoOfLikesClick}>{data?.noOfLikes} like</button>
      )}
    </div>
  );
};

export default Interactions;
