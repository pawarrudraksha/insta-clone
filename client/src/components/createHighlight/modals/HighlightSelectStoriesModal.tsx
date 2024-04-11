import React, { useEffect, useState } from "react";
import styles from "../../../styles/createHighlight/highlightSelectStoriesModal.module.css";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authSlice";
import {
  getSelfStories,
  resetCreateHighlightStories,
  selectCreateHighlightStories,
  setCreateHighlightName,
  toggleCreateHighlightCoverPicModal,
  toggleCreateHighlightModal,
  toggleCreateHighlightNameModal,
  toggleCreateHighlightStoriesModal,
} from "../../../app/features/highlightSlice";
import { GoChevronLeft } from "react-icons/go";
import SelectCheckbox from "../../miscellaneous/SelectCheckbox";

interface SelectStoryType {
  _id: string;
  content: {
    type: string;
    url: string;
  };
  updatedAt: string;
}
const HighlightSelectStoriesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [selectStoriesPage, setSelectStoriesPage] = useState<number>(1);
  const [selectStories, setSelectStories] = useState<SelectStoryType[]>([]);
  useEffect(() => {
    if (currentUser?._id) {
      const fetchStories = async () => {
        const result = await dispatch(
          getSelfStories({ page: selectStoriesPage })
        );
        if (result?.payload?.data && result?.payload?.data?.length > 0) {
          setSelectStories(result?.payload?.data);
        }
      };
      fetchStories();
    }
  }, [currentUser?._id]);
  const checkedStories = useAppSelector(selectCreateHighlightStories);
  const nextBtnDisabled = !Boolean(
    checkedStories?.find((item) => item?.selected === true)
  );
  const handleSelectStoriesBack = () => {
    dispatch(toggleCreateHighlightStoriesModal());
    dispatch(toggleCreateHighlightNameModal());
    dispatch(resetCreateHighlightStories());
  };
  const handleSelectStoriesClose = () => {
    dispatch(toggleCreateHighlightStoriesModal());
    dispatch(toggleCreateHighlightModal());
    dispatch(resetCreateHighlightStories());
    dispatch(setCreateHighlightName(""));
  };
  const handleSelectStoriesNext = () => {
    dispatch(toggleCreateHighlightStoriesModal());
    dispatch(toggleCreateHighlightCoverPicModal());
  };
  return (
    <div className={styles.createHighlightSelectStoriesModalContainer}>
      <div className={styles.selectStoriesModalHeader}>
        <GoChevronLeft onClick={handleSelectStoriesBack} />
        <p>Stories</p>
        <IoMdClose onClick={handleSelectStoriesClose} />
      </div>
      <div className={styles.selectStoriesModalStories}>
        {selectStories &&
          selectStories?.length > 0 &&
          selectStories?.map((story, index) => (
            <div className={styles.selectStoriesModalStory} key={index}>
              {story?.content?.type === "post" ? (
                <img src={story?.content?.url} alt="" />
              ) : (
                <video src={story?.content?.url}></video>
              )}
              <div className={styles.selectStoriesModalStoryCheckboxWrapper}>
                <SelectCheckbox _id={story._id} type="story" />
              </div>
            </div>
          ))}

        {(!selectStories || selectStories?.length === 0) && <p>No stories </p>}
      </div>
      <button
        className={`${styles.selectStoriesModalNextBtn} ${
          !nextBtnDisabled && styles.selectStoriesModalActiveNextBtn
        }`}
        disabled={nextBtnDisabled}
        onClick={handleSelectStoriesNext}
      >
        Next
      </button>
    </div>
  );
};

export default HighlightSelectStoriesModal;
