import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "../../../styles/messages/newMessageModal.module.css";
import UserProfileItem from "../miscellaneous/UserProfileItem";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  createChat,
  resetCheckedUsers,
  selectCheckedUsers,
  setCheckedUsers,
  toggleNewMessageModal,
} from "../../../app/features/messagesSlice";
import { searchUsers } from "../../../app/features/appSlice";
import { useNavigate } from "react-router-dom";

interface User {
  profilePic: string;
  username: string;
  _id: string;
  name: string;
}
const NewMessageModal: React.FC = () => {
  const checkedUsers = useAppSelector(selectCheckedUsers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const handleModalClose = () => {
    dispatch(toggleNewMessageModal());
  };
  const handlePropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleSearchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (searchQuery.trim()) {
      const results = await dispatch(
        searchUsers({ searchQuery: e.target.value, page: 1, limit: 6 })
      );
      setSearchResults(results?.payload?.data);
    }
  };
  const handleUncheckItem = (itemId: string) => {
    const filteredItems = checkedUsers?.filter((item) => item._id !== itemId);
    dispatch(setCheckedUsers(filteredItems));
  };
  const handleCreateChat = async () => {
    const filteredItems = checkedUsers?.map((item) => {
      return item._id;
    });
    const response = await dispatch(createChat(filteredItems));
    navigate(`/direct/t/${response?.payload?.data?._id}`);
    dispatch(toggleNewMessageModal());
  };
  return (
    <div className={styles.newMessageOverlay} onClick={handleModalClose}>
      <div
        className={styles.newMessageModalContainer}
        onClick={handlePropagation}
      >
        <div className={styles.newMessageModalHeader}>
          <p>New message</p>
          <IoMdClose onClick={handleModalClose} />
        </div>
        <div className={styles.newMessageModalSearchBar}>
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
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchUsers}
          />
        </div>
        <div className={styles.newMessageModalSearchResults}>
          {searchResults &&
            searchResults?.length >= 1 &&
            searchResults.map((item, index) => (
              <UserProfileItem isCheckbox key={index} userInfo={item} />
            ))}
        </div>
        <button
          className={styles.newMessageModalChatBtn}
          onClick={handleCreateChat}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default NewMessageModal;
