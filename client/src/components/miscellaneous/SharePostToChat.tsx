import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "../../styles/miscellaneous/sharePostToChat.module.css";
import UserProfileItem from "./UserProfileItem";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getUserChats,
  resetCheckedUsers,
  selectCheckedUsers,
  selectSharePostId,
  setCheckedUsers,
  sharePost,
  toggleSharePostToChatModal,
} from "../../app/features/messagesSlice";

interface User {
  profilePic: string;
  username: string;
  _id: string;
  name: string;
}

interface ChatType {
  isGroupChat: boolean;
  chatName: string;
  _id: string;
  userInfo: {
    _id: string;
    username: string;
    profilePic: string;
    name: string;
  }[];
}
const SharePostToChat: React.FC = () => {
  const checkedUsers = useAppSelector(selectCheckedUsers);
  const dispatch = useAppDispatch();
  const [userChats, setUserChats] = useState<ChatType[]>();
  const sharePostId = useAppSelector(selectSharePostId);
  useEffect(() => {
    const fetchUserChats = async () => {
      const results = await dispatch(getUserChats());
      setUserChats(results?.payload?.data);
    };
    fetchUserChats();
  }, []);
  const handleModalClose = () => {
    dispatch(resetCheckedUsers());
    dispatch(toggleSharePostToChatModal());
  };
  const handlePropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleUncheckItem = (itemId: string) => {
    const filteredItems = checkedUsers?.filter((item) => item._id !== itemId);
    dispatch(setCheckedUsers(filteredItems));
  };
  const handleSharePost = () => {
    if (checkedUsers?.length > 0) {
      const filteredItems = checkedUsers.map((item) => item._id);
      filteredItems.forEach((chatId) => {
        dispatch(sharePost({ postId: sharePostId, chatId: chatId }));
      });
    }
    dispatch(resetCheckedUsers());
    dispatch(toggleSharePostToChatModal());
  };

  return (
    <div className={styles.sharePostToChatOverlay} onClick={handleModalClose}>
      <div
        className={styles.sharePostToChatModalContainer}
        onClick={handlePropagation}
      >
        <div className={styles.sharePostToChatModalHeader}>
          <p>Share Post</p>
          <IoMdClose onClick={handleModalClose} />
        </div>
        <div className={styles.sharePostToChatModalSearchBar}>
          <div className={styles.selectedItemsContainer}>
            <p>To:</p>
            {checkedUsers?.length > 0 &&
              checkedUsers?.map((item, index) => (
                <div className={styles.selectedItem} key={index}>
                  <p>{item?.username}</p>
                  <IoMdClose onClick={() => handleUncheckItem(item?._id)} />
                </div>
              ))}
          </div>
        </div>
        <div className={styles.sharePostToChatModalSearchResults}>
          {userChats &&
            userChats?.length >= 1 &&
            userChats.map((item, index) =>
              item?.isGroupChat ? (
                <UserProfileItem
                  isCheckbox
                  key={index}
                  userInfo={{
                    name: "",
                    profilePic: "",
                    _id: item?._id,
                    username: item?.chatName,
                  }}
                />
              ) : (
                <UserProfileItem
                  isCheckbox
                  key={index}
                  userInfo={{ ...item?.userInfo[0], _id: item?._id }}
                />
              )
            )}
        </div>
        <button
          className={styles.sharePostToChatModalChatBtn}
          onClick={handleSharePost}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default SharePostToChat;
