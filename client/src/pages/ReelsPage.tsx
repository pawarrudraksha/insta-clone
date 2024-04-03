import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/reels/reelPage.module.css';
import ReelCard from '../components/reel/ReelCard';
import { useAppDispatch } from '../app/hooks';
import { getAllReels } from '../app/features/viewPostSlice';

export interface Reel{
  _id:string;
  isHideLikesAndViews:boolean;
  isCommentsOff:boolean;
  taggedUsers:string[];
  noOfLikes:number;
  noOfComments:number;
  userInfo:{
    _id:string;
    username:string;
    profilePic:string
  },
  posts:{
    content:{
      type:string;
      url:string;
    },
    audioTrack:{
      track:string;
      coverPic:string;
      author:string;
    },
    updatedAt:string
  },
  caption:string
}
const ReelsPage: React.FC = () => {
  const reelsPageContainerRef = useRef<HTMLDivElement>(null);
  const dispatch=useAppDispatch()
  const [page,setPage]=useState<number>(1)
  const [reels,setReels]=useState<Reel[]>([])
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
  useEffect(()=>{
    const fetchReels=async()=>{
      const results=await dispatch(getAllReels(page))
      setReels(results?.payload?.data);
    }
    fetchReels()
  },[page])  
  return (
    <div ref={reelsPageContainerRef} className={styles.reelsPageContainer}>
      <div className={styles.reelsWrapper}>
        {reels && reels?.length>0 && reels?.map((reel, index) => (
          <div key={index} className={styles.reelCardWrapper} data-reel-id={reel?._id}>
            <ReelCard reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
