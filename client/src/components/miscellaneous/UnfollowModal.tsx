import React from "react";
import styles from "../../styles/miscellaneous/unFollowModal.module.css";
import { useAppDispatch } from "../../app/hooks";
import { toggleAccountUnfollowModal } from "../../app/features/accountSlice";
import { deleteFollowRequest, unfollowUser } from "../../app/features/appSlice";
import { deleteNotification } from "../../app/features/notificationSlice";

interface unfollowModal {
  userId: string;
  isRequestAccepted: boolean;
  followDocId: string;
}
const UnfollowModal: React.FC<unfollowModal> = ({
  userId,
  isRequestAccepted,
  followDocId,
}) => {
  const dispatch = useAppDispatch();
  const handleUnfollow = () => {
    if (!isRequestAccepted) {
      dispatch(deleteFollowRequest(followDocId));
    } else {
      dispatch(unfollowUser(userId));
    }
    dispatch(deleteNotification(userId));
    dispatch(toggleAccountUnfollowModal());
    window.location.reload();
  };
  return (
    <div className={styles.unFollowModal}>
      <button onClick={handleUnfollow}>Unfollow</button>
      <button onClick={() => dispatch(toggleAccountUnfollowModal())}>
        Cancel
      </button>
    </div>
  );
};

export default UnfollowModal;
