import React from 'react';
import styles from '../../styles/miscellaneous/interactions.module.css';
import { FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

interface InteractionsProps{
  noOfLikes:number;
  isPostLiked:boolean
}
interface Props{
  data:InteractionsProps
}
const Interactions:React.FC <Props>= ({data}) => {
  return (
    <div className={styles.interactions}>
      <div className={styles.interactionsIcons}>
        <div className={styles.interactionsIconsReact}>
          {!data?.isPostLiked && <FaRegHeart />}
          {data?.isPostLiked && <FaHeart className={styles.likedPostIcon}/>}
          <FaRegComment/>
          <FiSend/>
        </div>
        <div>
          <FaRegBookmark />
        </div>
      </div>
      {data?.noOfLikes && data?.noOfLikes>1 ?<p>{data?.noOfLikes} likes</p> :<p>{data?.noOfLikes} like</p> }
    </div>
  )
}

export default Interactions