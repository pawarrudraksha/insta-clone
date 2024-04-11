import React, { useEffect, useState } from "react";
import styles from "../../styles/notification/notificationModal.module.css";
import NotificationItem from "./NotificationItem";
import { GoChevronRight, GoDotFill } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getFollowRequests } from "../../app/features/appSlice";
import { selectCurrentUser } from "../../app/features/authSlice";
import { toggleNotificationRequestsModal } from "../../app/features/notificationSlice";

interface RequestType {
  _id: string;
  follower: {
    name: string;
    username: string;
    profilePic: string;
    _id: string;
  };
  updatedAt: string;
}
const NotificationModal: React.FC = () => {
  const handlePropogation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [latestFollowRequest, setLatestFollowRequest] = useState<RequestType>({
    _id: "",
    updatedAt: "",
    follower: { _id: "", name: "", username: "", profilePic: "" },
  });
  useEffect(() => {
    if (currentUser?._id) {
      const fetchRequests = async () => {
        const result = await dispatch(getFollowRequests({ page: 1, limit: 1 }));
        if (result?.payload?.data?.length > 0) {
          setLatestFollowRequest(result?.payload?.data[0]);
        }
      };
      fetchRequests();
    }
  }, [dispatch, currentUser?._id]);
  useEffect(() => {});
  return (
    <div
      className={styles.notificationModalWrapper}
      onClick={handlePropogation}
    >
      <p className={styles.notificationModalTitle}>Notifications</p>
      {currentUser?.isPrivate && latestFollowRequest?._id && (
        <div className={styles.notificationFollowRequests}>
          <img src={latestFollowRequest?.follower?.profilePic} alt="" />
          <div className={styles.notificationFollowReqContent}>
            <div className={styles.notificationFollowReqInfo}>
              <p>Follow request</p>
              <p>{latestFollowRequest?.follower?.username}</p>
            </div>
            <div className={styles.notificationSvgs}>
              <GoDotFill className={styles.notificationDotSvg} />
              <GoChevronRight
                className={styles.notificationRightSvg}
                onClick={() => dispatch(toggleNotificationRequestsModal())}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.notificationsWrapper}>
        <div className={styles.notificationItemWrapper}>
          <p className={styles.notificationTitle}>Today</p>
          <NotificationItem isFollowRequest />
          <NotificationItem isFollow />
          <NotificationItem isLike />
        </div>
        <div className={styles.notificationItemWrapper}>
          <p className={styles.notificationTitle}>This week</p>
          <NotificationItem isLike />
          <NotificationItem isLike />
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
