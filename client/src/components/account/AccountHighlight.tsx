import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/account/accountHighlight.module.css';
import { accountData } from '../../data/sampleAccount';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useAppDispatch } from '../../app/hooks';
import {  selectInactiveStoriesSet, setActiveIndex, setActiveStoriesSet, setActiveStory, setInactiveStoriesSet } from '../../app/features/storySlice';
import { useNavigate } from 'react-router-dom';

interface Highlight {
  name: string;
  coverPic: string;
  stories: any;
  id:number;
  username:string;
}

interface HighlightsData {
  highlights: Highlight[];
}

interface HighlightProps{
  isStory?:boolean
}

const highlightsData = accountData as HighlightsData;

const AccountHighlight: React.FC<HighlightProps> = ({isStory}) => {
  const dispatch=useAppDispatch()
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const navigate=useNavigate()
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      handleScroll(); 
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };

  }, []);
  const handleScroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleStoryClick=(highlight:Highlight)=>{
    const inactive=accountData.highlights.filter((item)=>item.id!==highlight.id)    
    const index=accountData.highlights.findIndex((item)=>item.id===highlight.id)    
    navigate(`/stories/${highlight.username}/${highlight.id}`)
    dispatch(setActiveStoriesSet(highlight))
    dispatch(setActiveStory(highlight.stories[0]))
    dispatch(setInactiveStoriesSet(inactive))
    dispatch(setActiveIndex(index))
  }
  return (
    <div className={styles.accountHighlightsContainer}>
      <div className={styles.accountHighlights} ref={scrollRef}>
      {showLeftArrow && (
          <div className={styles.accountHighlightArrows}>
            <GoChevronLeft onClick={() => handleScroll(-600)} />
          </div>
        )}
        {showRightArrow && (
          <div className={styles.accountHighlightArrows} style={{ right: 0 }}>
            <GoChevronRight onClick={() => handleScroll(600)} />
          </div>
        )}
        {highlightsData.highlights.map((highlight,index)=>(
          <div className={styles.accountHighlight} key={index} onClick={()=>handleStoryClick(highlight)}>
            <img src={highlight.coverPic} alt="highlight" className={`${isStory ? styles.accountStory : styles.accountHighlightCover}`}/>
            <p>{highlight.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountHighlight;
