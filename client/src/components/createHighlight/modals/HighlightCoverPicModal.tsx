import React, { useState } from "react";
import styles from "../../../styles/createHighlight/highlightCoverPicModal.module.css";
import { FaImage } from "react-icons/fa";
import { GoChevronLeft } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { uploadFiles } from "../../../app/features/createPostSlice";
import {
  createHighlight,
  resetCreateHighlightStories,
  selectCreateHighlightName,
  selectCreateHighlightStories,
  setCreateHighlightName,
  toggleCreateHighlightCoverPicModal,
  toggleCreateHighlightModal,
} from "../../../app/features/highlightSlice";

const HighlightCoverPicModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const [coverPic, setCoverPic] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const selectedStories = useAppSelector(selectCreateHighlightStories);
  const highlightName = useAppSelector(selectCreateHighlightName);
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const result = await dispatch(uploadFiles(e.target.files));
      if (
        result &&
        "payload" in result &&
        Array.isArray(result.payload) &&
        result.payload.length > 0
      ) {
        setCoverPic(result.payload[0].url);
      }
      setDisabled(false);
    }
  };
  const handlePost = async () => {
    const updatedStories = selectedStories
      ?.map((item) => {
        if (item.selected) {
          return item?._id;
        }
        return undefined;
      })
      .filter((id): id is string => !!id);
    if (updatedStories && updatedStories.length > 0) {
      const response = await dispatch(
        createHighlight({
          stories: updatedStories,
          caption: highlightName,
          coverPic,
        })
      );
      if (response?.payload?.statusCode === 201) {
        dispatch(setCreateHighlightName(""));
        dispatch(resetCreateHighlightStories());
        dispatch(toggleCreateHighlightCoverPicModal());
        dispatch(toggleCreateHighlightModal());
      }
    }
  };
  return (
    <div className={styles.createHighlightCoverPicContainer}>
      <div className={styles.createhighlightCoverPicHeader}>
        <GoChevronLeft />
        <p>Cover Picture</p>
        <IoMdClose />
      </div>
      <div className={styles.createHighlightUploadContainer}>
        {coverPic ? (
          <div className={styles.createHighlightCoverPicUploadSuccessContainer}>
            <p>Upload Successful . You can now click on post</p>
          </div>
        ) : (
          <label htmlFor="upload-cover-pic">
            <div className={styles.createHighlightUploadCoverPicLabel}>
              <FaImage />
              <p>upload</p>
            </div>
          </label>
        )}
        <input
          type="file"
          id="upload-cover-pic"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button
        className={`${styles.createhighlightCoverPicPostBtn} ${
          !disabled && styles.createhighlightCoverPicActivePostBtn
        }`}
        disabled={disabled}
        onClick={handlePost}
      >
        Post
      </button>
    </div>
  );
};

export default HighlightCoverPicModal;
