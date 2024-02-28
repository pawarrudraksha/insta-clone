import React from 'react'
import styles from '../../styles/story/inactiveStoryCard.module.css'
import { accountData } from '../../data/sampleAccount';
import { useDispatch } from 'react-redux';
import { setActiveIndex, setActiveStoriesSet, setActiveStory, setActiveStoryNo, setInactiveStoriesSet } from '../../app/features/storySlice';


interface Story {
  coverPic: string;
  id: number;
  name: string;
  stories: {
    story: string;
    type: string;
  }[];
  username: string;
}

interface Props {
  story: Story;
}

const InactiveStoryCard:React.FC<Props>= ({story}) => {  
  const dispatch=useDispatch()
  const handleInactiveStoryClick=()=>{
    const index = accountData.highlights.findIndex(item => item.id === story.id);
    dispatch(setActiveIndex(index))
    dispatch(setActiveStoryNo(0));
    dispatch(setActiveStoriesSet(accountData.highlights[index]));
    dispatch(setActiveStory(accountData.highlights[index].stories[0]));        
    dispatch(setInactiveStoriesSet(accountData.highlights.filter((item) => item.id !== accountData.highlights[index].id)));
    console.log(story);
    
  }
  return (
    <div className={styles.inactiveStoryCardContainer} onClick={handleInactiveStoryClick}>
      <div className={styles.inactiveStoryProfile}>
        <img src={story.coverPic} alt="" />
        <div className={styles.inactiveStoryProfileInfo}>
          <p >{story.username}</p>
          <p className={styles.inactiveStoryProfileTime}>18h</p>
        </div>
      </div>
      <div className={styles.inactiveStory}>
        <img src={story.stories[0].story} alt="" />
      </div>
    </div>
  )
}

export default InactiveStoryCard