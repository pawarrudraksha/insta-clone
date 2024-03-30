import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/account/accountHighlight.module.css';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {  setActiveIndexOfHighlights, setActiveStoriesSetOfHighlights, setActiveStoryOfHighlights, setInactiveStoriesSetOfHighlights } from '../../app/features/highlightSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentUser } from '../../app/features/authSlice';
import { getHighlightById, getUserHighlightsWhenLoggedIn, getUserHighlightsWhenNotLoggedIn, setHighlights } from '../../app/features/accountSlice';
import { getAllActiveStories, getUserActiveStories, setActiveIndexOfHomeStories, setActiveStoriesSetOfHomeStories, setActiveStoryOfHomeStories, setInactiveStoriesSetOfHomeStories, setStoriesOfHomeStories } from '../../app/features/storySlice';

interface Highlight {
  caption: string;
  coverPic: string;
  firstStory:{};
  _id:string;
}

interface Story{
  _id:string;
  username:string;
  profilePic?:string;
  firstStory:{
    _id:string
  };
  areAllStoriesViewed:boolean
}

interface HighlightProps{
  isStory?:boolean
}


const AccountHighlight: React.FC<HighlightProps> = ({isStory}) => {
  const dispatch=useAppDispatch()
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [page,setPage]=useState<number>(1)
  const currentUser=useAppSelector(selectCurrentUser)
  const navigate=useNavigate()
  const {username}=useParams()
  const [highlightData,setHighlightData]=useState<Highlight[]>([])
  const [storyData,setStoryData]=useState<Story[]>([])
  useEffect(()=>{
    const fetchData=async()=>{
      let results;
      if(isStory){
        results=await dispatch(getAllActiveStories(page))
        setStoryData(results?.payload?.data)
      }else{
        if(username){
          if(currentUser?._id){
            results=await dispatch(getUserHighlightsWhenLoggedIn({username,page}))
          }else{
            results=await dispatch(getUserHighlightsWhenNotLoggedIn({username,page}))
          }
          setHighlightData(results?.payload?.data)      
        }
      }
    }
    fetchData()
  },[username,isStory])
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

  const handleStoryClick=async(itemId:string)=>{
    if(isStory){
      const inactive=storyData?.filter((item)=>item._id!==itemId)    
      const index=storyData.findIndex((item)=>item._id===itemId)    
      const user=storyData.find((item)=>item._id===itemId) 
      navigate(`/stories/${user?.username}/${user?.firstStory?._id}`)
      const userActiveStories=(await dispatch(getUserActiveStories(itemId)))?.payload?.data      
      dispatch(setActiveStoriesSetOfHomeStories(userActiveStories))
      dispatch(setStoriesOfHomeStories(storyData))
      dispatch(setActiveStoryOfHomeStories(userActiveStories?.activeStories[0]))
      dispatch(setInactiveStoriesSetOfHomeStories(inactive))
      dispatch(setActiveIndexOfHomeStories(index))
    }else{
      const highlight=(await dispatch(getHighlightById(itemId))).payload?.data
      const inactive=highlightData?.filter((item)=>item._id!==highlight._id)    
      const index=highlightData.findIndex((item)=>item._id===highlight._id)    
      navigate(`/stories/highlights/${itemId}`)
      dispatch(setActiveStoriesSetOfHighlights(highlight))
      dispatch(setHighlights(highlightData))
      dispatch(setActiveStoryOfHighlights(highlight?.stories[0]))
      dispatch(setInactiveStoriesSetOfHighlights(inactive))
      dispatch(setActiveIndexOfHighlights(index))
    }
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
        {!isStory && highlightData && highlightData?.length>=1 && highlightData.map((item,index)=>(
          <div className={styles.accountHighlight} key={index} onClick={()=>handleStoryClick(item._id)}>
            <img src={item?.coverPic} alt="item" className={`${isStory ? styles.accountStory : styles.accountHighlightCover}`}/>
            <p>{item?.caption}</p>
          </div>
        ))}
        {
          isStory && storyData?.map((item,index)=>(
            <div className={styles.accountHighlight} key={index} onClick={()=>handleStoryClick(item._id)} >
              <img src={item?.profilePic} alt="item" className={`${isStory ? styles.accountStory : styles.accountHighlightCover}`}/>
              <p>{item?.username}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default AccountHighlight;
