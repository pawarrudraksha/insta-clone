import React, { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectActiveStoriesSet, selectActiveStory } from '../../app/features/storySlice'
import styles from '../../styles/story/activeStoryCard.module.css'
import { accountData } from '../../data/sampleAccount'
import { FaPause, FaPlay, FaRegHeart } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import { IoVolumeMuteSharp } from 'react-icons/io5'
import { BiMoviePlay } from 'react-icons/bi'
import { GoChevronRight } from 'react-icons/go'
import { FiSend } from 'react-icons/fi'

const ActiveStoryCard:React.FC = () => {
  const [isStoryPause,setIsStoryPause]=useState(false)
  const handleStoryPlay=()=>{    
    setIsStoryPause(!isStoryPause)
  }

  const selectedStoriesSet=useAppSelector(selectActiveStoriesSet)  
  const story=useAppSelector(selectActiveStory)  
  const selectedIndex=selectedStoriesSet.stories.findIndex((item)=>item.story===story.story)
    
  return (
    <div className={styles.storyCardWrapper}>
      <div className={styles.storyCardHeaderContainer}>
        <div className={styles.storyCardTimeline}>
          {
            selectedStoriesSet.stories.map((_,index)=>(
              <hr key={index} className={`${index===selectedIndex && styles.activehr}`}/>
            ))
          }
        </div>
        <div className={styles.storyCardHeaderContentWrapper}>
          <div className={styles.storyCardHeaderContent}>
            <div className={styles.storyCardHeaderPic}>
              <img src={accountData.profilePic} alt="" />
            </div>
            <div className={styles.storyCardHeaderProfileInfo}>
              <div className={styles.storyCardHeaderUsernameAndTime}>
                <p className={styles.storyCardHeaderUsername}>{selectedStoriesSet.username}</p>
                <p className={styles.storyCardHeaderTime}>21h</p>
              </div>
              { story?.type==='reel' &&
              <div className={styles.storyCardHeaderWatchReel}>
                <BiMoviePlay/>
                <p> Watch full reel</p>
                <GoChevronRight/>
              </div>
              }
              </div>
            </div>
            <div className={styles.storyCardIcons}>
              {story?.type==='reel' && <IoVolumeMuteSharp className={styles.storyCardPlayIcon}/>}
              {isStoryPause?
              <FaPlay className={styles.storyCardPlayIcon} onClick={handleStoryPlay}/> 
              :<FaPause className={styles.storyCardPlayIcon} onClick={handleStoryPlay}/>}
              <IoIosMore className={styles.storyCardMoreIcon}/>
            </div>
        </div>
      </div>
      <div className={styles.storyCardStory}>
          {story?.type==='post'&& 
          <img src={story?.story} alt="story"  />}
          {
            story?.type==='reel' &&
            <video src={story?.story}></video>
          }
      </div>
      <div className={styles.storyCardInteractionContainer}>
        <input type="text" placeholder={`Reply to ${selectedStoriesSet.username}...`} />
        <div>

        <FaRegHeart/>
        <FiSend/>
        </div>
      </div>
    </div>
  )
}

export default ActiveStoryCard