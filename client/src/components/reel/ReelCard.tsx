import React, { useEffect, useState, useRef } from 'react';
import { FaRegComment, FaMusic, FaPlay, FaRegBookmark, FaRegHeart, FaUser } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { IoIosMore } from 'react-icons/io';
import styles from '../../styles/reels/reelCard.module.css';
import { PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import { BsDot } from 'react-icons/bs';

interface ReelCardProps {
  video: string;
  noOfLikes: number;
  noOfComments: number;
  username: string;
  music: string;
  caption: string;
  id: number;
  tagged: number;
  musicPic: string;
  profilePic: string;
}

interface Props {
  reel: ReelCardProps;
}

const ReelCard: React.FC<Props> = ({ reel }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleShowCaption = () => {
    setShowMore(!showMore);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: .5, 
    };
  
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // If the video is fully in view, play it
        setIsPlaying(true);
        const video = videoRef.current;
        if (video) {
          video.play();
        }
      } else {
        // If the video is not fully in view, pause it
        setIsPlaying(false);
        const video = videoRef.current;
        if (video) {
          video.pause();
        }
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
  

  return (
    <div className={styles.reelWrapper}>
      <div className={styles.reel}>
        <div className={styles.reelVideoContainer}>
          <video
            ref={videoRef}
            id={`video-${reel.id}`}
            loop
            muted={isMuted}
            controls={false}
            onClick={togglePlayPause}
          >
            <source src={reel.video} type="video/mp4" />
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
            <img src={reel.profilePic} alt="" />
            <div className={styles.reelCardContentHeaderInfo}>
              <p>{reel.username}</p>
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
              <p className={styles.reelCardScrollingMusic}>{reel.music}</p>
            </div>
            <div className={styles.reelCardTagged}>
              <FaUser />
              <p>{reel.tagged} people</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.reelCardInteractions}>
        <div className={styles.reelCardInteraction}>
          <FaRegHeart />
          <p>{reel.noOfLikes}</p>
        </div>
        <div className={styles.reelCardInteraction}>
          <FaRegComment />
          <p>{reel.noOfComments}</p>
        </div>
        <FiSend />
        <FaRegBookmark />
        <IoIosMore />
        <div className={styles.reelCardInteractionsMusic}>
          <img src={reel.musicPic} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ReelCard;