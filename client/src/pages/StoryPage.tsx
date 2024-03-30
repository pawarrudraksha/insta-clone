import React, { useState } from 'react';
import ActiveStoryCard from '../components/story/ActiveStoryCard';
import styles from '../styles/story/storyPage.module.css';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  getStoryById,
  selectActiveIndexOfHomeStories,
  selectActiveStoriesSetOfHomeStories,
  selectActiveStoryNoOfHomeStories,
  selectInactiveStoriesSetOfHomeStories,
  selectStories,
  setActiveIndexOfHomeStories,
  setActiveStoriesSetOfHomeStories,
  setActiveStoryOfHomeStories,
  setActiveStoryNoOfHomeStories,
  setInactiveStoriesSetOfHomeStories,
  getUserActiveStories

} from '../app/features/storySlice';
import InactiveStoryCard from '../components/story/InactiveStoryCard';



const Story: React.FC = () => {
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeStoryNo = useAppSelector(selectActiveStoryNoOfHomeStories);
  const activeStoriesSet = useAppSelector(selectActiveStoriesSetOfHomeStories);
  const inactiveStoriesSet = useAppSelector(selectInactiveStoriesSetOfHomeStories);
  const allStories=useAppSelector(selectStories)
  const activeIndex=useAppSelector(selectActiveIndexOfHomeStories)
  const [arrowHover, setArrowHover] = useState<boolean>(false);
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(-1);
  };
  const noOfStories = activeStoriesSet?.activeStories?.length;
  console.log(allStories);
  
  const handleNavigation = async(no: number) => {
    if (activeStoryNo === 0 && no === -1) {
      const index = allStories?.findIndex(item => item._id === activeStoriesSet?.userInfo?._id);
      if (!(index === 0)) {
        const newIndex = index - 1;
        dispatch(setActiveIndexOfHomeStories(newIndex));
        dispatch(setActiveStoryNoOfHomeStories(0));
        const newStories=await dispatch(getUserActiveStories(allStories[newIndex]?._id))
        dispatch(setActiveStoriesSetOfHomeStories(newStories?.payload?.data));
        dispatch(setActiveStoryOfHomeStories(newStories?.payload?.data?.activeStories[0]));        
        dispatch(setInactiveStoriesSetOfHomeStories(allStories.filter((item) => item._id !== allStories[newIndex]?._id)));

      }
      return;
    }
    if (activeStoryNo === noOfStories - 1 && no === 1) {
      const index = allStories.findIndex(item => item._id === activeStoriesSet?.userInfo?._id);
      if (!(index === allStories.length - 1)) {
        const newIndex = index + 1;
        dispatch(setActiveIndexOfHomeStories(newIndex));
        dispatch(setActiveStoryNoOfHomeStories(0));
        const newStories=await dispatch(getUserActiveStories(allStories[newIndex]?._id))        
        dispatch(setActiveStoriesSetOfHomeStories(newStories?.payload?.data));
        dispatch(setActiveStoryOfHomeStories(newStories?.payload?.data?.activeStories[0]));        
        dispatch(setInactiveStoriesSetOfHomeStories(allStories.filter((item) => item._id !== allStories[newIndex]?._id)))
      }
      return;
    }

    if (noOfStories > 1) {
      const newActiveStoryNo = activeStoryNo + no;
      dispatch(setActiveStoryNoOfHomeStories(newActiveStoryNo));
      dispatch(setActiveStoryOfHomeStories(activeStoriesSet?.activeStories[newActiveStoryNo]));
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
              <InactiveStoryCard isStory story={story} />
            </div>
          ))}
          {(activeIndex>0 && activeIndex===1)&&inactiveStoriesSet.slice(0, 1).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard isStory story={story} />
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
             {!(activeIndex===allStories?.length -1 && activeStoryNo===activeStoriesSet?.activeStories?.length-1) && <GoChevronRight />}
            </div>
          <ActiveStoryCard isStory/>
        </div>
        <div className={styles.inactiveBox2Container}>
          {inactiveStoriesSet?.slice(activeIndex, activeIndex+2).map((story, index) => (
            <div className={styles.inactiveStoryCard} key={index}>
              <InactiveStoryCard isStory story={story} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;
