import React, { useState } from "react";
import styles from "../../../styles/createHighlight/highlightNameModal.module.css";
import { IoMdClose } from "react-icons/io";
import {
  setCreateHighlightName,
  toggleCreateHighlightModal,
  toggleCreateHighlightNameModal,
  toggleCreateHighlightStoriesModal,
} from "../../../app/features/highlightSlice";
import { useAppDispatch } from "../../../app/hooks";

const HighlightNameModal: React.FC = () => {
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(toggleCreateHighlightNameModal());
    dispatch(toggleCreateHighlightModal());
  };
  const handleCreateHighlightNameNext = () => {
    dispatch(setCreateHighlightName(name));
    dispatch(toggleCreateHighlightNameModal());
    dispatch(toggleCreateHighlightStoriesModal());
  };
  return (
    <div className={styles.highlightNameModalContainer}>
      <div className={styles.highlightNameModalHeader}>
        <div></div>
        <p>New Highlight</p>
        <IoMdClose onClick={handleClose} />
      </div>
      <div className={styles.highlightNameModalInputContainer}>
        <input
          type="text"
          placeholder="Highlight Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button
        className={`${styles.highlightNameModalNextBtn} ${
          name.trim() && styles.highlightNameModalNextActiveBtn
        }`}
        disabled={!name}
        onClick={handleCreateHighlightNameNext}
      >
        Next
      </button>
    </div>
  );
};

export default HighlightNameModal;
