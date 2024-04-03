import React, { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { HighlightType, selectActiveStoriesSetOfHighlights, selectActiveStoryOfHighlights } from '../../app/features/highlightSlice'
import styles from '../../styles/story/activeStoryCard.module.css'
import { FaPause, FaPlay, FaRegHeart } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import { IoVolumeMuteSharp } from 'react-icons/io5'
import { BiMoviePlay } from 'react-icons/bi'
import { GoChevronRight } from 'react-icons/go'
import { FiSend } from 'react-icons/fi'
import { ActiveStoriesSetType, selectActiveStoriesSetOfHomeStories, selectActiveStoryOfHomeStories } from '../../app/features/storySlice'
import { HiSpeakerWave } from 'react-icons/hi2'
import { defaultProfilePic } from '../../data/common'

interface Story{
  _id:string;
  content:{
    type:string;
    url:string;
  }
}
const ActiveStoryCard: React.FC<{ isStory?: boolean }> = ({ isStory }) => {
  const [isStoryPause,setIsStoryPause]=useState<boolean>(false)
  const [isStoryMute,setIsStoryMute]=useState<boolean>(false)
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
  }
  
  let selectedStoriesSet:HighlightType | ActiveStoriesSetType;
  let story:Story;
  let selectedIndex:number;
  const activeStoriesSetOfHighlights = useAppSelector(selectActiveStoriesSetOfHighlights) as HighlightType;
  const activeStoryOfHighlights = useAppSelector(selectActiveStoryOfHighlights);
  const activeStoriesSetOfHomeStories = useAppSelector(selectActiveStoriesSetOfHomeStories) as ActiveStoriesSetType;
  const activeStoryOfHomeStories = useAppSelector(selectActiveStoryOfHomeStories);
 
  if (isStory) {
    selectedStoriesSet = activeStoriesSetOfHomeStories;
    story = activeStoryOfHomeStories;
    selectedIndex = selectedStoriesSet?.activeStories?.findIndex((item) => item?._id === story?._id);
  } else {
    selectedStoriesSet = activeStoriesSetOfHighlights;
    story = activeStoryOfHighlights;
    selectedIndex = selectedStoriesSet?.stories?.findIndex((item) => item?._id === story?._id);
  }
  
  return (
    <div className={styles.storyCardWrapper}>
      <div className={styles.storyCardHeaderContainer}>
        <div className={styles.storyCardTimeline}>
          { isStory?
            (selectedStoriesSet as ActiveStoriesSetType)?.activeStories?.map((_,index)=>(
              <hr key={index} className={`${index===selectedIndex && styles.activehr}`}/>
            ))
            :
            (selectedStoriesSet as HighlightType)?.stories?.map((_,index)=>(
              <hr key={index} className={`${index===selectedIndex && styles.activehr}`}/>
            ))
          }
        </div>
        <div className={styles.storyCardHeaderContentWrapper}>
          <div className={styles.storyCardHeaderContent}>
            <div className={styles.storyCardHeaderPic}>
              <img src={isStory?((selectedStoriesSet as ActiveStoriesSetType)?.userInfo?.profilePic || defaultProfilePic):(selectedStoriesSet as HighlightType)?.coverPic} alt="" />
            </div>
            <div className={styles.storyCardHeaderProfileInfo}>
              <div className={styles.storyCardHeaderUsernameAndTime}>
                <p className={styles.storyCardHeaderUsername}>{isStory?(selectedStoriesSet as ActiveStoriesSetType)?.userInfo?.username :(selectedStoriesSet as HighlightType)?.caption}</p>
                <p className={styles.storyCardHeaderTime}>21h</p>
              </div>
              {/* { story?.content?.type==='reel' &&
              <div className={styles.storyCardHeaderWatchReel}>
                <BiMoviePlay/>
                <p> Watch full reel</p>
                <GoChevronRight/>
              </div>
              } */}
              </div>
            </div>
            <div className={styles.storyCardIcons}>
              {story?.content?.type==='reel' &&(
                !isStoryMute? <HiSpeakerWave className={styles.storyCardPlayIcon} onClick={()=>setIsStoryMute(true)} /> : <IoVolumeMuteSharp className={styles.storyCardPlayIcon} onClick={()=>setIsStoryMute(false)}/>)}
              {story?.content?.type==='reel' &&(isStoryPause?
              <FaPlay className={styles.storyCardPlayIcon} onClick={handleStoryPlay}/> 
              :<FaPause className={styles.storyCardPlayIcon} onClick={handleStoryPlay}/>)}
              <IoIosMore className={styles.storyCardMoreIcon}/>
            </div>
        </div>
      </div>
      <div className={styles.storyCardStory}>
          {story?.content?.type==='post'&& 
          <img src={story?.content?.url} alt="story"  />}
          {
            story?.content?.type==='reel' &&
            <video src={story?.content?.url} muted={isStoryMute} id='video'></video>
          }
      </div>
      <div className={styles.storyCardInteractionContainer}>
        {isStory ?<input type="text" placeholder={`Reply to ${(selectedStoriesSet as ActiveStoriesSetType)?.userInfo?.username}...`}/> :<input type="text" placeholder={`Reply to ${(selectedStoriesSet as HighlightType)?.user?.username}...`} />}
        <div>

        <FaRegHeart/>
        <FiSend/>
        </div>
      </div>
    </div>
  )
}

export default ActiveStoryCard