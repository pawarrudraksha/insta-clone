import React, { useEffect, useState } from "react";
import styles from "../../styles/notification/notificationItem.module.css";
import { NotificationType } from "./NotificationModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authSlice";
import { defaultProfilePic } from "../../data/common";
import { getPostByIdWhenLoggedIn } from "../../app/features/viewPostSlice";
import { Link } from "react-router-dom";
import { getTimeSinceUpdate } from "../../utils/getTimeSinceUpdate";
import { fetchFollowingDoc } from "../../app/features/homeSlice";
import { followUser } from "../../app/features/appSlice";
import { createNotification } from "../../app/features/notificationSlice";

interface Notification {
  notification: NotificationType;
}

interface NotificationPostType {
  content: {
    type: string;
    url: string;
  };
  _id: string;
}
const NotificationItem: React.FC<Notification> = ({ notification }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<NotificationPostType>({
    content: { type: "", url: "" },
    _id: "",
  });
  useEffect(() => {
    if (notification?._id && notification?.postId) {
      const fetchPost = async () => {
        const response = await dispatch(
          getPostByIdWhenLoggedIn(notification?.postId)
        );
        setPost({
          _id: response?.payload?.data?._id,
          content: response?.payload?.data?.posts[0]?.content,
        });
      };
      fetchPost();
    }
  }, [notification?._id]);

  const [isFollowBtnVisible, setIsFollowBtnVisible] = useState<boolean>(true);
  useEffect(() => {
    if (notification?._id && notification?.type === "follow") {
      const checkFollowing = async () => {
        const response = await dispatch(
          fetchFollowingDoc(notification?.senderInfo?._id)
        );
        if (response?.payload?.data?._id) {
          setIsFollowBtnVisible(false);
        }
      };
      checkFollowing();
    }
  }, [notification?._id]);
  const updatedAtTime = getTimeSinceUpdate(notification?.updatedAt);
  const handleFollowUser = () => {
    dispatch(followUser(notification?.senderInfo?._id));
    dispatch(
      createNotification({
        type: "follow",
        receiverId: notification?.senderInfo?._id,
      })
    );
  };
  return (
    <div className={styles.notificationItemContainer}>
      <div className={styles.notificationProfilePic}>
        <img
          src={notification?.senderInfo?.profilePic || defaultProfilePic}
          alt="profile pic"
        />
      </div>
      <div className={styles.notificationInfo}>
        <p>
          {notification?.senderInfo?.username}
          {notification?.type === "follow" &&
            !currentUser?.isPrivate &&
            " started following you."}
          {notification?.type === "like" && " liked your post.  "}
          {notification?.type === "comment" &&
            ` commented  "${notification?.comment}" on your post.  `}
          {notification?.type === "follow" &&
            currentUser?.isPrivate &&
            " requested to follow you. "}
        </p>
        <p className={styles.notificationTime}>
          {"  "}
          {updatedAtTime}
        </p>
      </div>
      <div className={styles.interactedPost}>
        {notification?.type === "like" &&
          (post?._id && post?.content?.type === "post" ? (
            <Link to={`/p/${post?._id}`}>
              <img src={post?.content?.url} alt="post" />
            </Link>
          ) : (
            <Link to={`/p/${post?._id}`}>
              <video src={post?.content?.url}></video>
            </Link>
          ))}
        {notification?.type === "comment" &&
          (post?._id && post?.content?.type === "post" ? (
            <Link to={`/p/${post?._id}`}>
              <img src={post?.content?.url} alt="" />
            </Link>
          ) : (
            <Link to={`/p/${post?._id}`}>
              <video src={post?.content?.url}></video>
            </Link>
          ))}
        {notification?.type === "follow" &&
          !currentUser?.isPrivate &&
          isFollowBtnVisible && (
            <button
              className={styles.notificationFollowBtn}
              onClick={handleFollowUser}
            >
              Follow
            </button>
          )}
        {notification?.type === "follow" && currentUser?.isPrivate && (
          <div className={styles.notificatonFollowReqBtns}>
            <button className={styles.notificationConfirmReqBtn}>
              Confirm
            </button>
            <button className={styles.notificationDeleteBtn}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
