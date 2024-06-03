import React, { useEffect, useState, useRef } from "react";
import {
  FaRegComment,
  FaMusic,
  FaPlay,
  FaRegBookmark,
  FaRegHeart,
  FaUser,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoIosMore } from "react-icons/io";
import styles from "../../styles/reels/reelCard.module.css";
import { PiSpeakerSimpleSlashFill } from "react-icons/pi";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { BsDot } from "react-icons/bs";
import { Reel } from "../../pages/ReelsPage";
import { defaultProfilePic } from "../../data/common";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actionOnPost,
  savePost,
  unsavePost,
} from "../../app/features/viewPostSlice";
import {
  createNotification,
  deleteNotification,
} from "../../app/features/notificationSlice";
import { selectCurrentUser } from "../../app/features/authSlice";
import {
  setSharePostId,
  toggleSharePostToChatModal,
} from "../../app/features/messagesSlice";

interface Props {
  reel: Reel;
}

const ReelCard: React.FC<Props> = ({ reel }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReelLiked, setIsReelLiked] = useState<boolean>(reel?.isReelLiked);
  const [isReelSaved, setIsReelSaved] = useState<boolean>(reel?.isReelSaved);
  const [noOfLikes, setNoOfLikes] = useState<number>(reel?.noOfLikes);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleShowCaption = () => {
    setShowMore(!showMore);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      try {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error occurred while toggling play/pause:", error);
      }
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      try {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          const video = videoRef.current;
          if (video) {
            video.play();
          }
        } else {
          setIsPlaying(false);
          const video = videoRef.current;
          if (video) {
            video.pause();
          }
        }
      } catch (error) {
        console.log("Error playing/pausing video:", error);
      }
    }, options);

    const video = videoRef.current;
    if (video) {
      observer.observe(video);
    }

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, []);

  const handleLikeReel = async () => {
    if (isReelLiked) {
      dispatch(
        actionOnPost({
          targetId: reel?._id,
          targetType: "post",
          action: "unlike",
        })
      );
      if (currentUser?._id !== reel?.userInfo?._id) {
        dispatch(deleteNotification(reel?._id));
      }
      setIsReelLiked(false);
      setNoOfLikes((prev) => prev - 1);
    } else {
      dispatch(
        actionOnPost({
          targetId: reel?._id,
          targetType: "post",
          action: "like",
        })
      );
      if (currentUser?._id !== reel?.userInfo?._id) {
        dispatch(
          createNotification({
            type: "like",
            receiverId: reel?.userInfo?._id,
            postId: reel?._id,
          })
        );
      }
      setIsReelLiked(true);
      setNoOfLikes((prev) => prev + 1);
    }
  };
  const handleSharePost = () => {
    dispatch(setSharePostId(reel?._id));
    dispatch(toggleSharePostToChatModal());
  };
  const handleSavePost = () => {
    if (isReelSaved) {
      dispatch(unsavePost(reel?._id));
      setIsReelSaved(false);
    } else {
      dispatch(savePost(reel?._id));
      setIsReelSaved(true);
    }
  };
  return (
    <div className={styles.reelWrapper}>
      <div className={styles.reel}>
        <div className={styles.reelVideoContainer}>
          <video
            ref={videoRef}
            id={`video-${reel?._id}`}
            loop
            muted={isMuted}
            controls={false}
            onClick={togglePlayPause}
          >
            <source src={reel?.posts?.content?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {!isPlaying && (
          <button className={styles.reelPlayBtn}>
            <FaPlay onClick={togglePlayPause} />
          </button>
        )}
        <button className={styles.reelSpeakerBtn}>
          {isMuted ? (
            <PiSpeakerSimpleSlashFill onClick={() => setIsMuted(false)} />
          ) : (
            <HiMiniSpeakerWave onClick={() => setIsMuted(true)} />
          )}
        </button>
        <div className={styles.reelCardContent}>
          <div className={styles.reelCardContentHeader}>
            <img
              src={
                reel?.userInfo?.profilePic
                  ? reel?.userInfo?.profilePic
                  : defaultProfilePic
              }
              alt=""
            />
            <div className={styles.reelCardContentHeaderInfo}>
              <p>{reel?.userInfo?.username}</p>
              <BsDot />
              <button>Follow</button>
            </div>
          </div>

          {reel.caption.length > 24 && !showMore ? (
            <div className={styles.reelCardContentMoreCaption}>
              <p>{reel.caption.slice(0, 24)}</p>
              {!showMore && (
                <button onClick={handleShowCaption}>... more</button>
              )}
            </div>
          ) : (
            <div className={styles.reelCardContentMoreCaption}>
              <p>{reel.caption}</p>
              {showMore && (
                <button onClick={handleShowCaption}>show less</button>
              )}
            </div>
          )}
          <div className={styles.reelCardMusicAndTagged}>
            <FaMusic />
            <div className={styles.reelCardScrollingMusicContainer}>
              <p className={styles.reelCardScrollingMusic}>
                {reel?.posts?.audioTrack?.track}
              </p>
            </div>
            <div className={styles.reelCardTagged}>
              <FaUser />
              <p>{reel?.taggedUsers?.length} people</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.reelCardInteractions}>
        <div
          className={`${styles.reelCardInteraction} ${
            isReelLiked && styles.reelCardInteractionWhenLiked
          }`}
        >
          <button onClick={handleLikeReel}>
            {isReelLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <p>{noOfLikes}</p>
        </div>
        <div className={styles.reelCardInteraction}>
          <FaRegComment />
          <p>{reel?.noOfComments}</p>
        </div>
        <button
          className={styles.reelCardInteractionsBtn}
          onClick={handleSharePost}
        >
          <FiSend />
        </button>
        <button
          className={styles.reelCardInteractionsBtn}
          onClick={handleSavePost}
        >
          {isReelSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
        <button className={styles.reelCardInteractionsBtn}>
          <IoIosMore />
        </button>
        <div className={styles.reelCardInteractionsMusic}>
          <img src={reel?.posts?.audioTrack?.coverPic} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
