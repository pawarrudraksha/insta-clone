import React, { useState } from 'react';
import ActiveStoryCard from '../components/story/ActiveStoryCard';
import styles from '../styles/story/storyPage.module.css';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  selectActiveIndex,
  selectActiveStoriesSet, 
  selectActiveStoryNo, 
  selectInactiveStoriesSet, 
  setActiveIndex, 
  setActiveStoriesSet, 
  setActiveStory, 
  setActiveStoryNo, 
  setInactiveStoriesSet 
} from '../app/features/storySlice';
import { accountData } from '../data/sampleAccount';
import InactiveStoryCard from '../components/story/InactiveStoryCard';

const Story: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeStoryNo = useAppSelector(selectActiveStoryNo);
  const activeStoriesSet = useAppSelector(selectActiveStoriesSet);
  const inactiveStoriesSet = useAppSelector(selectInactiveStoriesSet);
  const activeIndex=useAppSelector(selectActiveIndex)
  const [arrowHover, setArrowHover] = useState<boolean>(false);
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(-1);
  };
  const noOfStories = activeStoriesSet?.stories.length;
  const handleNavigation = (no: number) => {
    if (activeStoryNo === 0 && no === -1) {
      const index = accountData.highlights.findIndex(item => item.id === activeStoriesSet.id);
      if (!(index === 0)) {
        const newIndex = index - 1;
        dispatch(setActiveIndex(newIndex))
        dispatch(setActiveStoryNo(0));
        dispatch(setActiveStoriesSet(accountData.highlights[newIndex]));
        dispatch(setActiveStory(accountData.highlights[newIndex].stories[0]));        
        dispatch(setInactiveStoriesSet(accountData.highlights.filter((item) => item.id !== accountData.highlights[newIndex].id)));
      }
      return;
    }
    if (activeStoryNo === noOfStories - 1 && no === 1) {
      const index = accountData.highlights.findIndex(item => item.id === activeStoriesSet.id);
      if (!(index === accountData.highlights.length - 1)) {
        const newIndex = index + 1;
        dispatch(setActiveIndex(newIndex))
        dispatch(setActiveStoryNo(0));
        dispatch(setActiveStoriesSet(accountData.highlights[newIndex]));
        dispatch(setActiveStory(accountData.highlights[newIndex].stories[0]));          
        dispatch(setInactiveStoriesSet(accountData.highlights.filter((item) => item.id !== accountData.highlights[newIndex].id)));
      }
      return;
    }

    if (noOfStories > 1) {
      const newActiveStoryNo = activeStoryNo + no;

      dispatch(setActiveStoryNo(newActiveStoryNo));
      dispatch(setActiveStory(activeStoriesSet.stories[newActiveStoryNo]));
    }
  };    
  
  return (
    <div className={styles.storyOverlay}>
      <Link to={"/"}>Instagram</Link>
      <div className={styles.storyCloseIcon} onClick={handleClose}>
        <IoMdClose />
      </div>
      <div className={styles.storiesContainer}>
        <div className={styles.inactiveBox1Container}>
          {activeIndex>0 && inactiveStoriesSet.slice(activeIndex-2, activeIndex).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} />
            </div>
          ))}
          {(activeIndex>0 && activeIndex===1)&&inactiveStoriesSet.slice(0, 1).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} />
            </div>
          ))}
        </div>
        <div className={styles.activeStoryCard}>
            <div className={`${styles.storyArrow} ${styles.storyLeftArrow} ${arrowHover && styles.storyArrowHover}`}
              onMouseEnter={() => setArrowHover(true)}
              onMouseLeave={() => setArrowHover(false)}
              onClick={() => handleNavigation(-1)}
            >
              {!(activeIndex===0 )&& <GoChevronLeft />}
            </div>
            <div className={`${styles.storyArrow} ${styles.storyRightArrow}  ${arrowHover && styles.storyArrowHover}`}
              onMouseEnter={() => setArrowHover(true)}
              onMouseLeave={() => setArrowHover(false)}
              onClick={() => handleNavigation(1)}
            >
             {!(activeIndex===accountData.highlights.length -1 && activeStoryNo===activeStoriesSet.stories.length-1) && <GoChevronRight />}
            </div>
          <ActiveStoryCard />
        </div>
        <div className={styles.inactiveBox2Container}>
          {inactiveStoriesSet.slice(activeIndex, activeIndex+2).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;
