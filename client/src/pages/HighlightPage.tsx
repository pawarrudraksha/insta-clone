import React, {  useState } from 'react';
import ActiveStoryCard from '../components/story/ActiveStoryCard';
import styles from '../styles/story/storyPage.module.css';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  selectActiveIndexOfHighlights,
  selectActiveStoriesSetOfHighlights, 
  selectActiveStoryNoOfHighlights, 
  selectInactiveStoriesSetOfHighlights, 
  setActiveIndexOfHighlights, 
  setActiveStoriesSetOfHighlights, 
  setActiveStoryOfHighlights, 
  setActiveStoryNoOfHighlights, 
  setInactiveStoriesSetOfHighlights 
} from '../app/features/highlightSlice';
import InactiveStoryCard from '../components/story/InactiveStoryCard';
import { getHighlightById, selectHighlights } from '../app/features/accountSlice';

const Highlight: React.FC = () => {
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeStoryNo = useAppSelector(selectActiveStoryNoOfHighlights);
  const activeStoriesSet = useAppSelector(selectActiveStoriesSetOfHighlights);
  const inactiveStoriesSet = useAppSelector(selectInactiveStoriesSetOfHighlights);
  const activeIndex=useAppSelector(selectActiveIndexOfHighlights)
  const highlights=useAppSelector(selectHighlights)
  const [arrowHover, setArrowHover] = useState<boolean>(false);
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(-1);
  };
  const noOfStories = activeStoriesSet?.stories?.length;
  const handleNavigation = async(no: number) => {
    if (activeStoryNo === 0 && no === -1) {
      const index = highlights.findIndex(item => item._id === activeStoriesSet._id);
      if (!(index === 0)) {
        const newIndex = index - 1;
        dispatch(setActiveIndexOfHighlights(newIndex))
        dispatch(setActiveStoryNoOfHighlights(0));
        const newHighlight=await dispatch(getHighlightById(highlights[newIndex]?._id))
        dispatch(setActiveStoriesSetOfHighlights(newHighlight?.payload?.data));
        dispatch(setActiveStoryOfHighlights(newHighlight?.payload?.data?.stories[0]));        
        dispatch(setInactiveStoriesSetOfHighlights(highlights.filter((item) => item._id !== highlights[newIndex]._id)));
      }
      return;
    }
    if (activeStoryNo === noOfStories - 1 && no === 1) {
      const index = highlights.findIndex(item => item._id === activeStoriesSet._id);
      if (!(index === highlights.length - 1)) {
        const newIndex = index + 1;
        dispatch(setActiveIndexOfHighlights(newIndex))
        dispatch(setActiveStoryNoOfHighlights(0));
        const newHighlight=await dispatch(getHighlightById(highlights[newIndex]?._id))
        dispatch(setActiveStoriesSetOfHighlights(newHighlight?.payload?.data));
        dispatch(setActiveStoryOfHighlights(newHighlight?.payload?.data?.stories[0]));        
        dispatch(setInactiveStoriesSetOfHighlights(highlights.filter((item) => item._id !== highlights[newIndex]._id)));
      }
      return;
    }

    if (noOfStories > 1) {
      const newActiveStoryNo = activeStoryNo + no;

      dispatch(setActiveStoryNoOfHighlights(newActiveStoryNo));
      dispatch(setActiveStoryOfHighlights(activeStoriesSet?.stories[newActiveStoryNo]));
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
          {activeIndex>1 && inactiveStoriesSet.slice(activeIndex-2, activeIndex).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} isStory={false}/>
            </div>
          ))}
          {(activeIndex>0 && activeIndex===1)&&inactiveStoriesSet.slice(0, 1).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} isStory={false} />
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
             {!(activeIndex===highlights?.length -1 && activeStoryNo===activeStoriesSet.stories.length-1) && <GoChevronRight />}
            </div>
          <ActiveStoryCard />
        </div>
        <div className={styles.inactiveBox2Container}>
          {inactiveStoriesSet.slice(activeIndex, activeIndex+2).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard story={story} isStory={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlight;
