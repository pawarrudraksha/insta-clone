import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/explore/explorePage.module.css';
import { accountData } from '../data/sampleAccount';
import PostItem from '../components/miscellaneous/PostItem';
import Footer from '../components/miscellaneous/Footer';

const ExplorePage: React.FC = () => {
  const [hideSpacer, setHideSpacer] = useState(true); 
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && containerRef.current.scrollTop > 0) {
        setHideSpacer(true);
      } else {
        setHideSpacer(false);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  return (
    <div className={styles.explorePageContainer}>
      <div ref={containerRef} className={styles.explorePageWrapper}>
        {!hideSpacer && <div className={styles.explorePageSpacer}></div>}
        <div className={styles.explorePageWrapper}>
          <div className={styles.explorePageBox}>
            {accountData.mixed.slice(0, 5).map((data, index) => (
              <div
                className={`${index === 2 ? styles.explorePagePostBiggerItem1 : styles.explorePagePostItem}`}
                key={index}
              >
                <PostItem item={{ type: `${data.isPost === true ? 'post' : 'reel'}`, showReelIcon: true, ...data }} />
              </div>
            ))}
          </div>
          <div className={styles.explorePageBox}>
            {accountData.mixed.slice(0, 5).map((data, index) => (
              <div
                className={`${index === 0 ? styles.explorePagePostBiggerItem2 : styles.explorePagePostItem}`}
                key={index}
              >
                <PostItem item={{ type: `${data.isPost === true ? 'post' : 'reel'}`, showReelIcon: true, ...data }} />
              </div>
            ))}
          </div>
          <div className={`${styles.explorePageFooterWrapper} ${styles.scroll}`}>
            <div className={styles.explorePageFooter}>
              <Footer isPost />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
