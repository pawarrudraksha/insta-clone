import React, { useState } from 'react';
import styles from '../styles/carousel.module.css';
import { carouselData } from '../data/CarouselData';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaLeaf, FaPlay } from "react-icons/fa";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { PiSpeakerSimpleSlashFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";



function Carousel() {
  const [activeImage,setActiveImage]=useState<number>(0)  
  const [isPlaying,setIsPlaying]=useState<boolean>(true)  
  const [isMuted,setIsMuted]=useState<boolean>(true)  
  const handleClick=(no:number)=>{    
    setIsPlaying(false)    
    if(no===-1 && activeImage===0) return;
    if(no===1 && activeImage===carouselData.content.length - 1) return;
    setActiveImage((prev)=>(prev+no))
    const video = document.getElementById(`video-${activeImage}`) as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
          video.pause(); 
      }}
  }

  const togglePlayPause = () => { 
        const video = document.getElementById(`video-${activeImage}`) as HTMLVideoElement;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
            setIsPlaying(!isPlaying);
        }
    
};
  return (
    <div className={styles.carousel}  style={{width:`${carouselData.width}`,height:`${carouselData.height}`}} >
      <div className={styles.carouselArrows}>
        <MdKeyboardArrowLeft onClick={()=>handleClick(-1)}/>
        <MdKeyboardArrowRight onClick={()=>handleClick(1)}/>
      </div>
      {carouselData.content.map((img, index) => (
      <div  key={index} style={{height:"100%"}}>
         {img.type==="image" && 
         <img 
          src={img.url} 
          alt={`carousel-image-${index}`}  
          width={carouselData.width} 
          height={carouselData.height} 
          className={`${styles.carouselHiddenImage} ${activeImage===index && styles.carouselActiveImage}`} 
         />}
         {
          img.type==="video" && 
          (
            <>
            <div className={styles.carouselVideoContainer}>

            <video
             id={`video-${index}`}  
             className={`${styles.carouselHiddenVideo} ${activeImage===index && styles.carouselActiveVideo}`} 
             autoPlay 
             loop 
             muted={isMuted} 
             controls={false}  
             onClick={togglePlayPause} 
             >
            <source src={img.url} type="video/mp4"   />
            Your browser does not support the video tag.
            </video>
            
            
            </div>
            <button className={`${!isPlaying && activeImage===index ? styles.playButton : styles.hidePlayButton} `}>
              <FaPlay/>
            </button>
            <button className={`${activeImage===index ?styles.isMuted: styles.isMutedHidden}`}>
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
        {carouselData.content.map((_, index) => (
          <div key={index} className={`${styles.dot} ${activeImage === index ? styles.activeDot : ''}`}>
            <GoDotFill />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
