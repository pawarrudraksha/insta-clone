import React from "react";
import HighlightNameModal from "./modals/HighlightNameModal";
import styles from "../../styles/createHighlight/highlightOverlay.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  resetCreateHighlightStories,
  selectIsCreateHighlightCoverPicOpen,
  selectIsCreateHighlightNameOpen,
  selectIsCreateHighlightStoriesOpen,
  setCreateHighlightName,
  toggleCreateHighlightCoverPicModal,
  toggleCreateHighlightModal,
  toggleCreateHighlightNameModal,
  toggleCreateHighlightStoriesModal,
} from "../../app/features/highlightSlice";
import HighlightSelectStoriesModal from "./modals/HighlightSelectStoriesModal";
import HighlightCoverPicModal from "./modals/HighlightCoverPicModal";

const HighlightOverlay: React.FC = () => {
  const isHighlightNameModalOpen = useAppSelector(
    selectIsCreateHighlightNameOpen
  );
  const isHighlightStoriesModalOpen = useAppSelector(
    selectIsCreateHighlightStoriesOpen
  );
  const isHighlightCoverPicModalOpen = useAppSelector(
    selectIsCreateHighlightCoverPicOpen
  );
  const dispatch = useAppDispatch();
  const handleCreateHighlightOverlayClick = () => {
    if (isHighlightNameModalOpen) {
      dispatch(toggleCreateHighlightNameModal());
    }
    if (isHighlightCoverPicModalOpen) {
      dispatch(toggleCreateHighlightCoverPicModal());
    }
    if (isHighlightStoriesModalOpen) {
      dispatch(toggleCreateHighlightStoriesModal());
    }
    dispatch(toggleCreateHighlightModal());
    dispatch(resetCreateHighlightStories());
    dispatch(setCreateHighlightName(""));
  };
  const handlePropogation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div
      className={styles.createHighlightOverlay}
      onClick={handleCreateHighlightOverlayClick}
    >
      {isHighlightNameModalOpen && (
        <div
          className={styles.highlightNameModalWrapper}
          onClick={handlePropogation}
        >
          <HighlightNameModal />
        </div>
      )}
      {isHighlightStoriesModalOpen && (
        <div
          className={styles.highlightStoriesModalWrapper}
          onClick={handlePropogation}
        >
          <HighlightSelectStoriesModal />
        </div>
      )}
      {isHighlightCoverPicModalOpen && (
        <div
          className={styles.highlightCoverPicModalWrapper}
          onClick={handlePropogation}
        >
          <HighlightCoverPicModal />
        </div>
      )}
    </div>
  );
};

export default HighlightOverlay;
