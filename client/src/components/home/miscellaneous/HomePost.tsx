import React, { useState } from "react";
import styles from "../../../styles/home/homePost.module.css";
import { IoIosMore } from "react-icons/io";
import Carousel from "../../miscellaneous/Carousel";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  closeProfileModal,
  openProfileModal,
  selectIsProfileModalOpen,
  setProfileModalData,
} from "../../../app/features/appSlice";
import ProfileModal from "../../miscellaneous/ProfileModal";
import { useNavigate } from "react-router-dom";
import Interactions from "../../miscellaneous/Interactions";
import { HomePostData } from "../HomePosts";
import { getUserInfo } from "../../../app/features/accountSlice";
import {
  actionOnPost,
  openPostModal,
  postComment,
} from "../../../app/features/viewPostSlice";
import { defaultProfilePic } from "../../../data/common";
import { getTimeSinceUpdate } from "../../../utils/getTimeSinceUpdate";
import { selectCurrentUser } from "../../../app/features/authSlice";
import {
  createNotification,
  deleteNotification,
} from "../../../app/features/notificationSlice";

const HomePost: React.FC<{ data: HomePostData }> = ({ data }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [noOfLikes, setNoOfLikes] = useState<number>(data?.noOfLikes);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(data?.isPostLiked);
  const [comment, setComment] = useState<string>("");
  const [noOfComments, setNoOfComments] = useState<number>(data?.noOfComments);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleMouseEnter = async () => {
    const result = await dispatch(getUserInfo(data?.userInfo?.username));
    dispatch(setProfileModalData(result?.payload?.data));
    dispatch(openProfileModal());
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    dispatch(closeProfileModal());
    setIsHovered(false);
  };
  const isProfileModalOpen = useAppSelector(selectIsProfileModalOpen);
  const navigateToProfile = () => {
    navigate(`/${data?.userInfo?.username}`);
  };
  const handleViewAllComments = () => {
    if (window.innerWidth > 768) {
      dispatch(openPostModal());
      window.history.pushState(null, "", `/p/${data?._id}`);
    } else {
      navigate(`/p/${data?._id}`);
    }
  };
  const handleLikePost = async () => {
    if (isLiked) {
      dispatch(
        actionOnPost({
          targetId: data?._id,
          targetType: "post",
          action: "unlike",
        })
      );
      if (currentUser?._id !== data?.userInfo?._id) {
        dispatch(deleteNotification(data?._id));
      }
      setIsLiked(false);
      setNoOfLikes((prev) => prev - 1);
    } else {
      dispatch(
        actionOnPost({
          targetId: data?._id,
          targetType: "post",
          action: "like",
        })
      );
      if (currentUser?._id !== data?.userInfo?._id) {
        dispatch(
          createNotification({
            type: "like",
            receiverId: data?.userInfo?._id,
            postId: data?._id,
          })
        );
      }
      setIsLiked(true);
      setNoOfLikes((prev) => prev + 1);
    }
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const handlePostComment = async () => {
    dispatch(
      postComment({
        postId: data?._id,
        text: comment,
      })
    );

    dispatch(
      createNotification({
        type: "comment",
        receiverId: data?.userInfo?._id,
        postId: data?._id,
        comment,
      })
    );
    setNoOfComments((prev) => prev + 1);
    setComment("");
  };
  const postUpdatedTiime = getTimeSinceUpdate(data?.updatedAt);

  return (
    <div className={styles.homePost}>
      <div className={styles.homePostHeader} onMouseLeave={handleMouseLeave}>
        <div className={styles.homePostProflePic}>
          <img
            src={
              data?.userInfo?.profilePic
                ? data?.userInfo?.profilePic
                : defaultProfilePic
            }
            alt="profile pic"
            onClick={navigateToProfile}
          />
        </div>
        <div className={styles.homePostHeaderInfo}>
          <div className={styles.homePostHeaderDetail}>
            <p
              className={styles.homePostHeaderDetailUsername}
              onMouseEnter={handleMouseEnter}
              onClick={navigateToProfile}
            >
              {data?.userInfo?.username}
            </p>
            <BsDot />
            <p>{postUpdatedTiime}</p>
          </div>
          {/* <p>Original audio</p> */}
        </div>
        <div className={styles.homePostHeaderMore}>
          <IoIosMore />
        </div>
      </div>
      <div className={styles.homePostCarousel} onDoubleClick={handleLikePost}>
        <Carousel posts={data?.posts} />
      </div>
      <div className={styles.homeInteractionsWrapper}>
        <Interactions
          data={{
            noOfLikes: noOfLikes,
            isPostLiked: isLiked,
            setIsLiked: setIsLiked,
            setNoOfLikes: setNoOfLikes,
            _id: data?._id,
            isCommentsOff: data?.isCommentsOff,
            isHideLikesAndViews: data?.isHideLikesAndViews,
            ownerId: data?.userInfo?._id,
            isPostSaved: data?.isPostSaved,
          }}
        />
      </div>
      <div className={styles.homePostCaption}>
        <p onClick={navigateToProfile}>{data?.userInfo?.username}</p>
        <p>{data?.caption}</p>
      </div>
      {!data?.isCommentsOff && (
        <div className={styles.homePostCardComments}>
          <button onClick={handleViewAllComments}>
            View all {noOfComments} comments
          </button>
          <div className={styles.homePostCardAddComment}>
            <input
              type="text"
              placeholder="Add a comment"
              className={styles.homePostCardAddCommentInput}
              onChange={handleCommentChange}
              value={comment}
            />
            <HiOutlineEmojiHappy />
            <button
              disabled={!comment.trim() ? true : false}
              onClick={handlePostComment}
            >
              Post
            </button>
          </div>
        </div>
      )}
      {isProfileModalOpen && isHovered && (
        <ProfileModal
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
};

export default HomePost;
