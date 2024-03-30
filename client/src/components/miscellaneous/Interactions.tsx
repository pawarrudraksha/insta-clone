import React from 'react';
import styles from '../../styles/miscellaneous/interactions.module.css';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

interface InteractionsProps{
  noOfLikes:number
}
const Interactions:React.FC <InteractionsProps>= ({noOfLikes}) => {
  return (
    <div className={styles.interactions}>
      <div className={styles.interactionsIcons}>
        <div className={styles.interactionsIconsReact}>
          <FaRegHeart />
          <FaRegComment/>
          <FiSend/>
        </div>
        <div>
          <FaRegBookmark />
        </div>
      </div>
      {noOfLikes && noOfLikes>1 ?<p>{noOfLikes} likes</p> :<p>{noOfLikes} like</p> }
    </div>
  )
}

export default Interactions