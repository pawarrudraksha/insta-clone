import React, { useState } from "react";
import styles from "../../../styles/posts/postCommentCard.module.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authSlice";
import {
  actionOnLike,
  getCommentReplies,
  selectToReplyComment,
  setToReplyComment,
} from "../../../app/features/viewPostSlice";
import { defaultProfilePic } from "../../../data/common";
import { getTimeSinceUpdate } from "../../../utils/getTimeSinceUpdate";
import { userInfo } from "os";

interface PostCommentCardProps {
  _id: string;
  text: string;
  updatedAt: string;
  noOfReplies: number;
  noOfLikes: number;
  userInfo: {
    username: string;
    profilePic: string;
    _id: string;
  };
  isCommentLiked: boolean;
}
interface Props {
  comment: PostCommentCardProps;
}
const PostCommentCard: React.FC<Props> = ({ comment }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [replies, setReplies] = useState<PostCommentCardProps[]>();
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false);
  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(
    comment?.isCommentLiked
  );
  const [noOfLikes, setNoOfLikes] = useState<number>(comment?.noOfLikes);
  const [repliesPage, setRepliesPage] = useState<number>(1);
  const dispatch = useAppDispatch();
  const handleRepliesClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentUser?._id) {
      const results = await dispatch(
        getCommentReplies({ commentId: comment?._id, page: repliesPage })
      );
      setIsShowReplies(true);
      setReplies(results?.payload?.data);
    }
  };

  const handleReplyToComment = () => {
    dispatch(
      setToReplyComment({
        username: comment?.userInfo?.username,
        commentId: comment?._id,
      })
    );
  };
  const handleLikeComment = () => {
    if (isCommentLiked) {
      dispatch(
        actionOnLike({
          targetId: comment?._id,
          targetType: "comment",
          action: "unlike",
        })
      );
      setIsCommentLiked(false);
      setNoOfLikes((prev) => prev - 1);
    } else {
      console.log(comment?._id, "unlike");
      dispatch(
        actionOnLike({
          targetId: comment?._id,
          targetType: "comment",
          action: "like",
        })
      );
      setIsCommentLiked(true);
      setNoOfLikes((prev) => prev + 1);
    }
  };
  const timeSinceUpdate = getTimeSinceUpdate(comment?.updatedAt);
  return (
    <div className={styles.postCommentCardContainer}>
      <div className={styles.postCommentCardContentsContainer}>
        <div className={styles.postCommentCardProfilePic}>
          <img
            src={
              comment?.userInfo?.profilePic
                ? comment?.userInfo?.profilePic
                : defaultProfilePic
            }
            alt=""
          />
        </div>
        <div className={styles.postCommentCardContentAndCommentWrapper}>
          <div className={styles.postCommentCardContentWrapper}>
            <div className={styles.postCommentCardContent}>
              <p className={styles.postCommentCardContentUsername}>
                {comment?.userInfo?.username}
              </p>
              <p className={styles.postCommentCardContentComment}>
                {comment?.text}
              </p>
            </div>
            <div className={styles.postCommentCardInfo}>
              <p>{timeSinceUpdate}</p>
              <p>
                {noOfLikes} {noOfLikes > 1 ? "likes" : "like"}
              </p>
              <button onClick={handleReplyToComment}>Reply</button>
            </div>
          </div>
          {comment?.noOfReplies > 0 && (
            <div className={styles.postCommentCardReplySection}>
              <div className={styles.postCommentCardReplySectionHeader}>
                <hr />
                {!isShowReplies && (
                  <button onClick={handleRepliesClick}>
                    View Replies ({comment?.noOfReplies})
                  </button>
                )}
                {isShowReplies && (
                  <button onClick={() => setIsShowReplies(false)}>
                    Hide Replies
                  </button>
                )}
              </div>
              {isShowReplies &&
                replies &&
                replies?.length >= 1 &&
                replies.map((reply, index) => (
                  <PostCommentCard comment={reply} key={index} />
                ))}
            </div>
          )}
        </div>
      </div>
      <button
        className={`${styles.postCommentLikeBtn} ${
          isCommentLiked && styles.postCommentLikeBtnLiked
        }`}
        onClick={handleLikeComment}
        disabled={!currentUser?._id}
      >
        {isCommentLiked ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default PostCommentCard;
