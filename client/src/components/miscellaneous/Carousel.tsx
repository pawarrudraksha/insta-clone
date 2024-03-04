import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/miscellaneous/carousel.module.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {  FaPlay } from "react-icons/fa";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { PiSpeakerSimpleSlashFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentAspectRatio, selectIsCropPostModalOpen } from '../../app/features/createPostSlice';
import { selectCarouselActiveIndex, setCarouselActiveType, setCreatePostCarouseActiveIndex } from '../../app/features/carouselSlice';


interface InterStyles {
  [key: string]: string;
}

interface Post{
  type:string;
  post:string;
}

interface CarouselProps{
  posts:Post[]
  isCreatePost?:boolean
}
const Carousel :React.FC<CarouselProps>=({posts,isCreatePost})=> {
  const dispatch=useAppDispatch()
  const [activeImage,setActiveImage]=useState<number>(0)  
  const [isPlaying,setIsPlaying]=useState<boolean>(true)  
  const [isMuted,setIsMuted]=useState<boolean>(true)  
  const isCropPostModalOpen=useAppSelector(selectIsCropPostModalOpen)
  const videoRef=useRef<HTMLVideoElement>(null)
 
  const createPostActiveIndex=useAppSelector(selectCarouselActiveIndex)
  useEffect(()=>{
    if(isCreatePost){
      const type=posts.find((_,index)=>index===0)?.type      
      dispatch(setCarouselActiveType(type))
    }
  },[])
  const handleClick=(no:number)=>{    
    setIsPlaying(false)    
    if(isCreatePost){
      
      if(no===-1 && createPostActiveIndex===0) return;
      if(no===1 && createPostActiveIndex===posts.length - 1) return;
      dispatch(setCreatePostCarouseActiveIndex(createPostActiveIndex+no))
      const type=posts.find((_,index)=>index===createPostActiveIndex+no)?.type      
      dispatch(setCarouselActiveType(type))
    }else{
      if(no===-1 && activeImage===0) return;
      if(no===1 && activeImage===posts.length - 1) return;
      setActiveImage((prev)=>(prev+no))
    }
    const video = document.getElementById(`video-${activeImage}`) as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
          video.pause(); 
      }}
  }

  const togglePlayPause = () => { 
    if(!isCropPostModalOpen){

      const video = document.getElementById(`video-${activeImage}`) as HTMLVideoElement;
      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
    
  };
  const currentAspectRatio=useAppSelector(selectCurrentAspectRatio)    
    const interStyles: InterStyles = {
        Original: styles.cropPostOriginal,
        "1:1": styles.cropPost1to1,
        "4:5": styles.cropPost4to5,
        "16:9": styles.cropPost16to9,
    };   
    const interStylesImage: InterStyles = {
        Original: styles.cropPostImageOriginal,
        "1:1": styles.cropPostOriginal,
        "4:5": styles.cropPost4to5,
        "16:9": styles.cropPostImage16to9,
    };   
  return (
    <div className={styles.carousel}  style={{width:`100%`,height:`100%`}} >
      
     {posts.length > 1 && <div className={styles.carouselArrows}>
     {!isCreatePost ?
    <>
        {!(activeImage === 0) && <MdKeyboardArrowLeft onClick={() => handleClick(-1)} className={styles.carouselLeftArrow} />}
        {!(activeImage === posts.length - 1) && <MdKeyboardArrowRight onClick={() => handleClick(1)} className={styles.carouselRightArrow} />}
    </>
    :
    <>
        {!(createPostActiveIndex === 0) && <MdKeyboardArrowLeft onClick={() => handleClick(-1)} className={styles.carouselLeftArrow} />}
        {!(createPostActiveIndex === posts.length - 1) && <MdKeyboardArrowRight onClick={() => handleClick(1)} className={styles.carouselRightArrow} />}
    </>
}

      </div>}
      {posts.map((img, index) => (
      <div  key={index}  className={styles.postContainer}>
         {img.type==="image" && 
            <img 
              src={img.post} 
              alt={`carousel-image-${index}`}  
              width={`100%`} 
              height={`100%`} 
              className={`${styles.carouselHiddenImage} ${!isCreatePost ? activeImage===index && interStylesImage[currentAspectRatio] : createPostActiveIndex===index && interStylesImage[currentAspectRatio] }`} 
            />
         }
         {
          img.type==="video" && 
          (
            <>
                <video
                id={`video-${index}`}  
                className={`${styles.carouselHiddenVideo} ${!isCreatePost ? activeImage===index && interStyles[currentAspectRatio] : createPostActiveIndex===index && interStyles[currentAspectRatio] }`} 
                loop 
                muted={isMuted} 
                controls={false}  
                onClick={togglePlayPause} 
                autoPlay={isCropPostModalOpen}
                ref={videoRef}
                >
                <source src={img.post} type="video/mp4"   />
                Your browser does not support the video tag.
                </video>
            
            {!isCropPostModalOpen && <button className={`${!isPlaying && (isCreatePost?createPostActiveIndex :activeImage)===index ? styles.playButton : styles.hidePlayButton} `}>
              <FaPlay  onClick={togglePlayPause}/>
            </button>}
            <button className={`${(isCreatePost?createPostActiveIndex :activeImage)===index ?styles.isMuted: styles.isMutedHidden}`}>
              {
                isMuted 
                ? <PiSpeakerSimpleSlashFill onClick={()=>setIsMuted(false)}/>
                : <HiMiniSpeakerWave onClick={()=>setIsMuted(true)}/> 
              }
            </button>

            </>
          )
         }
          </div>
          
          ))
        }
        <div className={styles.carouselDots}>
        {posts.length>1 && posts.map((_, index) => (
          <div key={index} 
          className={`${styles.dot} ${!isCreatePost ? (activeImage === index ? styles.activeDot : ''):(createPostActiveIndex === index ? styles.activeDot : '')}`}>
            <GoDotFill />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
