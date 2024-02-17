import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/account/accountHighlight.module.css';
import { accountData } from '../../data/sampleAccount';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

interface Highlight {
  name: string;
  coverPic: string;
  stories: string[];
}

interface HighlightsData {
  highlights: Highlight[];
}

const highlightsData = accountData as HighlightsData;

const AccountHighlight: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
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
          <div className={styles.accountHighlight} key={index}>
            <img src={highlight.coverPic} alt="highlight" className={styles.accountHighlightCover}/>
            <p>{highlight.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountHighlight;
