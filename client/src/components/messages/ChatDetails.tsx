import React from "react";
import styles from "../../styles/messages/chatDetails.module.css";
import Checkbox from "../miscellaneous/Checkbox";
import { Link } from "react-router-dom";
import UserProfileItem from "../miscellaneous/UserProfileItem";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteChat,
  selectCurrentChatInfo,
} from "../../app/features/messagesSlice";

const ChatDetails: React.FC = () => {
  const chatInfo = useAppSelector(selectCurrentChatInfo);
  const dispatch = useAppDispatch();
  const handleDeleteChat = async () => {
    dispatch(deleteChat(chatInfo?._id));
  };
  return (
    <div className={styles.chatDetailsContainer}>
      <div className={styles.chatDetailsHeader}>
        <p className={styles.chatDetailsHeaderTitle}>Details</p>
        <div className={styles.chatDetailsHeaderMuteContainer}>
          <p>Mute messages</p>
          <Checkbox value={false} setValue={() => {}} name="Mute" />
        </div>
      </div>
      <div className={styles.chatDetailsInfo}>
        <p>Members</p>
        <div className={styles.chatDetailsMembers}>
          {chatInfo &&
            chatInfo?.users?.length > 0 &&
            chatInfo?.users?.map((item, index) => (
              <Link
                to={`/${item?.username}`}
                className={styles.chatDetailMemberWrapper}
                key={index}
              >
                <UserProfileItem userInfo={item} />
              </Link>
            ))}
        </div>
      </div>
      <div className={styles.chatDetailsbtns}>
        {/* <button>Report</button>
          <button>Block</button> */}
        <button onClick={handleDeleteChat}>Delete Chat</button>
      </div>
    </div>
  );
};

export default ChatDetails;
