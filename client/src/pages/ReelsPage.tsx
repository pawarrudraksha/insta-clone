import React, { useRef, useEffect } from 'react';
import styles from '../styles/reels/reelPage.module.css';
import { reelData } from '../data/reelData';
import ReelCard from '../components/reel/ReelCard';

const ReelsPage: React.FC = () => {
  const reelsPageContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const container = reelsPageContainerRef.current;
      if (container) {
        const { scrollTop, clientHeight } = container;
        const reelElements = container.getElementsByClassName(styles.reelCardWrapper);
        let currentReelId = '';

        for (let i = 0; i < reelElements.length; i++) {
          const reelElement = reelElements[i] as HTMLElement;
          const { offsetTop, offsetHeight } = reelElement;
          if (offsetTop >= scrollTop && offsetTop + offsetHeight <= scrollTop + clientHeight) { // 1. top edge is at or below. 2. bottom edge is at or above
            currentReelId = reelElement.dataset.reelId || '';
            break;
          }
        }

        if (currentReelId) {
          window.history.pushState(null, '', `/reels/${currentReelId}`);
        }
      }
    };

    const container = reelsPageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      const container = reelsPageContainerRef.current;
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
 
  return (
    <div ref={reelsPageContainerRef} className={styles.reelsPageContainer}>
      <div className={styles.reelsWrapper}>
        {reelData.map((reel, index) => (
          <div key={index} className={styles.reelCardWrapper} data-reel-id={reel.id}>
            <ReelCard reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
