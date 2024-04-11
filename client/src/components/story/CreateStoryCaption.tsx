import React, { useState } from "react";
import styles from "../../styles/story/createStoryCaption.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCreateStory,
  setCreateStory,
  toggleIStoryCaptionModalOpen,
} from "../../app/features/storySlice";

const CreateStoryCaption: React.FC = () => {
  const createStory = useAppSelector(selectCreateStory);
  const dispatch = useAppDispatch();
  const [color, setColor] = useState<string>("#fff");
  const [caption, setCaption] = useState<string>("");
  const colorCodes = [
    "#0064d1",
    "#45bd62",
    "#ff66bf",
    "#9360f7",
    "#f3425f",
    "#fc5776",
    "#2abba7",
    "#25d366",
    "#f7b928",
    "#000",
    "#fff",
  ];
  const handleCaptionDone = () => {
    if (caption.trim()) {
      dispatch(
        setCreateStory({ ...createStory, caption: { text: caption, color } })
      );
    }
    dispatch(toggleIStoryCaptionModalOpen());
  };
  return (
    <div className={styles.createStoryCaptionContainer}>
      <div className={styles.createStoryInput}>
        <textarea
          value={caption}
          style={{ color }}
          placeholder="Enter caption"
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      <div className={styles.createStoryColors}>
        <button
          className={styles.createStoryColorsDoneBtn}
          onClick={handleCaptionDone}
        >
          Done
        </button>
        {colorCodes.map((item, index) => (
          <button
            style={{ background: item }}
            key={index}
            onClick={() => setColor(item)}
            className={styles.createStoryCaptionColorBtn}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default CreateStoryCaption;
