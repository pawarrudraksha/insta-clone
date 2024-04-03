import React from 'react'
import styles from '../../styles/story/inactiveStoryCard.module.css'
import { setActiveIndexOfHighlights, setActiveStoriesSetOfHighlights, setActiveStoryOfHighlights, setActiveStoryNoOfHighlights, setInactiveStoriesSetOfHighlights } from '../../app/features/highlightSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getHighlightById, selectHighlights } from '../../app/features/accountSlice';
import { getUserActiveStories, selectStories, setActiveIndexOfHomeStories, setActiveStoriesSetOfHomeStories, setActiveStoryNoOfHomeStories, setActiveStoryOfHomeStories, setInactiveStoriesSetOfHomeStories } from '../../app/features/storySlice';
import { defaultProfilePic } from '../../data/common';


export interface Story {
  coverPic?: string;
  _id: string;
  caption?:string;
  firstStory: {
    _id: string;
  content: {
    type: string,
    url: string
  };
  updatedAt: string;
  caption: {
    text: string,
    color: string,
    position: {
      top: string,
      left: string
    };
  };
  };
  username: string;
  areAllStoriesViewed?:boolean;
  profilePic?:string;
}

interface Props {
  story: Story;
  isStory:boolean
}

const InactiveStoryCard:React.FC<Props>= ({story,isStory}) => {    
  const dispatch=useAppDispatch()
  const highlights=useAppSelector(selectHighlights)
  const allStories=useAppSelector(selectStories)    
  const handleInactiveStoryClick=async()=>{
    if(isStory){
      const index = allStories?.findIndex(item => item._id === story?._id);
      dispatch(setActiveIndexOfHomeStories(index))
      dispatch(setActiveStoryNoOfHomeStories(0));
      const newStories=await (await dispatch(getUserActiveStories(allStories[index]?._id))).payload?.data      
      dispatch(setActiveStoriesSetOfHomeStories(newStories));
      dispatch(setActiveStoryOfHomeStories(newStories?.activeStories[0]));        
      dispatch(setInactiveStoriesSetOfHomeStories(allStories.filter((item) => item._id !== allStories[index]?._id)));
    }else{
      const index = highlights.findIndex(item => item._id === story?._id);
      dispatch(setActiveIndexOfHighlights(index))
      dispatch(setActiveStoryNoOfHighlights(0));
      const newHighlight=await (await dispatch(getHighlightById(highlights[index]?._id))).payload?.data
      dispatch(setActiveStoriesSetOfHighlights(newHighlight));
      dispatch(setActiveStoryOfHighlights(newHighlight?.stories[0]));        
      dispatch(setInactiveStoriesSetOfHighlights(highlights.filter((item) => item._id !== highlights[index]._id)));
    }
  }
  return (
    <div className={styles.inactiveStoryCardContainer} onClick={handleInactiveStoryClick}>
      <div className={styles.inactiveStoryProfile}>
        <img src={story?.coverPic ? story?.coverPic : (story?.profilePic ? story?.profilePic :defaultProfilePic)} alt="" />
        <div className={styles.inactiveStoryProfileInfo}>
          <p >{story?.caption ? story?.caption : story?.username}</p>
          <p className={styles.inactiveStoryProfileTime}>18h</p>
        </div>
      </div>
      <div className={styles.inactiveStory}>
        { story && story?.firstStory?.content?.type==='post' ?
          <img src={story?.firstStory?.content?.url} alt="" />
          : <video src={story?.firstStory?.content?.url}></video>
        }
      </div>
    </div>
  )
}

export default InactiveStoryCard