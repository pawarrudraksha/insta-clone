import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/explore/explorePage.module.css';
import PostItem from '../components/miscellaneous/PostItem';
import Footer from '../components/miscellaneous/Footer';
import { useAppDispatch } from '../app/hooks';
import { getAllPublicPosts } from '../app/features/viewPostSlice';

interface ExploreItem{
  isCommentsOff:boolean; 
  isHideLikesAndViews:boolean;
  isStandAlone:boolean;
  noOfComments:number;
  noOfLikes:number;
  post: {type: string, url: string};
  _id:string
}
const ExplorePage: React.FC = () => {
  const [hideSpacer, setHideSpacer] = useState(false); 
  const dispatch=useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null);
  const [page,setPage]=useState<number>(1)
  const [posts,setPosts]=useState<ExploreItem[]>([])
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
  useEffect(()=>{
    const fetchPosts=async()=>{
      const results=await dispatch(getAllPublicPosts({page,limit:10}))
      setPosts(results?.payload?.data)
    }
    fetchPosts()
  },[page])  
  return (
    <div className={styles.explorePageContainer} >
        {!hideSpacer && <div className={styles.explorePageSpacer}></div>}
        <div className={styles.explorePageWrapper} ref={containerRef} >
          <div className={styles.explorePageBox}>
            {posts && posts?.length>0 && posts?.slice(0, 5).map((data, index) => (
              <div
                className={`${index === 2 ? styles.explorePagePostBiggerItem1 : styles.explorePagePostItem}`}
                key={index}
              >
                <PostItem item={data} showReelIcon />
              </div>
            ))}
          </div>
          <div className={styles.explorePageBox}>
            {posts && posts?.length>5 && posts?.slice(5, 10).map((data, index) => (
              <div
                className={`${index === 8 ? styles.explorePagePostBiggerItem2 : styles.explorePagePostItem}`}
                key={index}
              >
                <PostItem item={data} showReelIcon />
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
  );
};

export default ExplorePage;
