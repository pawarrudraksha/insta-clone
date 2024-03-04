import React, { useEffect, useRef, useState } from 'react'
import styles from '../../../../styles/create/managePostsModal.module.css'
import { IoAddSharp } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { deleteFile, selectPosts, setCreatePosts, uploadFiles } from '../../../../app/features/createPostSlice'
import { IoMdClose } from 'react-icons/io'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { selectCarouselActiveIndex, setCreatePostCarouseActiveIndex } from '../../../../app/features/carouselSlice'

const ManagePostsModal:React.FC = () => {
  const managePostsScrollRef=useRef<HTMLDivElement>(null)  
  const [showLeftArrow,setShowLeftArrow]=useState(false)
  const [showRightArrow,setShowRightArrow]=useState(false)
  const activeIndex=useAppSelector(selectCarouselActiveIndex)    
  const posts=useAppSelector(selectPosts)
  const dispatch=useAppDispatch()
  const handleAddFiles=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files=e.target.files;
    if(files){
      dispatch(uploadFiles(files))      
    }
  }  
  
  const handleDeletePost=(e: React.MouseEvent<SVGElement, MouseEvent>,id:string)=>{
    e.stopPropagation()
    const filteredPosts=posts.filter((post)=>post.id!==id)
    dispatch(deleteFile(id))
    dispatch(setCreatePosts(filteredPosts))
  }
  const handlePostClick=(index:number)=>{
    dispatch(setCreatePostCarouseActiveIndex(index))
  }
  
  useEffect(()=>{
    const handleScroll=()=>{
      if(managePostsScrollRef.current){
        const {scrollLeft,scrollWidth,clientWidth}=managePostsScrollRef.current
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth -1);                      
      }
    }
    if(managePostsScrollRef.current){
      managePostsScrollRef.current.addEventListener("scroll",handleScroll)
    }
    return ()=>{
      if(managePostsScrollRef.current){
        managePostsScrollRef.current.removeEventListener("scroll",handleScroll)
      }
    }
  },[])
  const handleScroll = (scrollOffset: number) => {
    if (managePostsScrollRef.current) {
      managePostsScrollRef.current.scrollLeft += scrollOffset;
    }
  };
  return (
    <div className={styles.managePostsOverlay}>
        <div className={styles.managePostsContainer} ref={managePostsScrollRef}>
          {
            posts.map((post,index)=>(
              <div className={`${styles.managePostsPostItem} ${activeIndex===index && styles.managePostsPostItemActive}`} key={index} onClick={()=>handlePostClick(index)}>
              {post.type==='video'? <video src={post.post} ></video>:<img src={post.post} alt='post' />}
                <IoMdClose onClick={(e)=>handleDeletePost(e,post.id)}/>
              </div>
            ))
          }
          <div className={styles.managePostsArrows}>
            {showLeftArrow && <MdKeyboardArrowLeft onClick={()=>handleScroll(-200)} className={styles.managePostsLeftArrow} />}
            {showRightArrow && <MdKeyboardArrowRight onClick={()=>handleScroll(200)} className={styles.managePostsRightArrow} />}
          </div>
        </div>
        <div className={styles.managePostsAddPostContainer}>
            <input type="file"  id="add-post" multiple onChange={handleAddFiles}/>
            <label htmlFor='add-post'>
            <IoAddSharp />
            </label>
        </div>
    </div>
  )
}

export default ManagePostsModal