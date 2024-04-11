import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "../../styles/story/createStoryCard.module.css";
import {
  createStory,
  selectCreateStory,
  selectIsStoryCaptionModalOpen,
  setCreateStory,
  toggleIStoryCaptionModalOpen,
} from "../../app/features/storySlice";
import { HiSpeakerWave } from "react-icons/hi2";
import CreateStoryCaption from "./CreateStoryCaption";
import { IoIosAddCircleOutline, IoMdClose } from "react-icons/io";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { FaPause, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateStoryCard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isStoryPause, setIsStoryPause] = useState<boolean>(false);
  const [isStoryMute, setIsStoryMute] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const story = useAppSelector(selectCreateStory);
  const isStoryCaptionModalOpen = useAppSelector(selectIsStoryCaptionModalOpen);

  // Initialize position with percentages
  const [position, setPosition] = useState({ x: 20, y: 10 });
  const handleStoryPlay = () => {
    const video = document.getElementById(`video`) as HTMLVideoElement;
    if (video) {
      if (!isStoryPause) {
        video.pause();
      } else {
        video.play();
      }
      setIsStoryPause(!isStoryPause);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setIsDragging(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !captionRef.current) return;
    const { clientX, clientY } = event;
    const { offsetTop, offsetLeft } = captionRef.current
      .parentElement as HTMLElement;
    let limitedX = Math.max(clientX - offsetLeft, 0);
    let limitedY = Math.max(clientY - offsetTop, 0);
    limitedX = Math.min(limitedX, window.innerWidth - offsetLeft);
    limitedY = Math.min(limitedY, window.innerHeight - offsetTop);
    const percentageX = (limitedX / window.innerWidth) * 100;
    const percentageY = (limitedY / window.innerHeight) * 100;
    setPosition({
      x: percentageX,
      y: percentageY,
    });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleCloseStory = () => {
    dispatch(setCreateStory({}));
    navigate("/");
  };
  const handleOpenCaptionModal = () => {
    dispatch(toggleIStoryCaptionModalOpen());
  };

  const handleSendStory = async () => {
    const body = {
      ...story,
      caption: {
        ...story.caption,
        position: {
          top: `${Math.floor(position.y)}%`,
          left: `${Math.floor(position.x)}%`,
        },
      },
    };
    const res = await dispatch(createStory(body));
    if (res?.payload?.statusCode === 201) {
      navigate("/");
    }
  };
  return (
    <div className={styles.createStoryCardWrapper}>
      {!isStoryCaptionModalOpen && (
        <div className={styles.createStoryCardHeaderContainer}>
          <IoMdClose onClick={handleCloseStory} />
          <div className={styles.createStoryCardIcons}>
            {story?.content?.type === "reel" &&
              (!isStoryMute ? (
                <HiSpeakerWave
                  className={styles.createStoryCardPlayIcon}
                  onClick={() => setIsStoryMute(true)}
                />
              ) : (
                <IoVolumeMuteSharp
                  className={styles.createStoryCardPlayIcon}
                  onClick={() => setIsStoryMute(false)}
                />
              ))}
            {story?.content?.type === "reel" &&
              (isStoryPause ? (
                <FaPlay
                  className={styles.createStoryCardPlayIcon}
                  onClick={handleStoryPlay}
                />
              ) : (
                <FaPause
                  className={styles.createStoryCardPlayIcon}
                  onClick={handleStoryPlay}
                />
              ))}
            <button
              className={styles.createStoryCardHeaderCaptionBtn}
              onClick={handleOpenCaptionModal}
            >
              Aa
            </button>
          </div>
        </div>
      )}
      <div className={styles.createStoryCardStory}>
        {story?.content?.type === "post" && (
          <img src={story?.content?.url} alt="story" />
        )}
        {story?.content?.type === "reel" && (
          <video
            src={story?.content?.url}
            muted={isStoryMute}
            id="video"
          ></video>
        )}
      </div>
      {isStoryCaptionModalOpen && <CreateStoryCaption />}
      <p
        ref={captionRef}
        style={{
          color: story?.caption?.color,
          top: `${position.y}%`,
          left: `${position.x}%`,
        }}
        onMouseDown={handleMouseDown}
        className={styles.createStoryCardCaption}
      >
        {story?.caption?.text}
      </p>
      <button className={styles.addToStoryBtn} onClick={handleSendStory}>
        <IoIosAddCircleOutline />
        <span>Add to your story</span>
      </button>
    </div>
  );
};

export default CreateStoryCard;
