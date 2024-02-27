import React from 'react'
import { postData } from '../../../data/samplePost';
import styles from '../../../styles/posts/postCommentCard.module.css'
import { FaRegHeart } from 'react-icons/fa';

// interface PostCommentCardProps{
//     profilePic:string;
//     noOfLikes:number;
//     username:string;
//     comment:string;
// }

// interface PostCommentCardProp{
//     comment:PostCommentCardProps
// }
const PostCommentCard:React.FC = () => {
  return (
    <div className={styles.postCommentCardContainer}>
        <div className={styles.postCommentCardProfilePic}>
          <img src={postData.comments[0].profilePic} alt="" />
        </div>
        <div className={styles.postCommentCardContentAndCommentWrapper}>
          <div className={styles.postCommentCardContentWrapper}>
            <div className={styles.postCommentCardContent}>
              <p className={styles.postCommentCardContentUsername}>{postData.comments[0].username}</p>
              <p className={styles.postCommentCardContentComment}>{postData.comments[0].comment}</p>
            </div>
            <div className={styles.postCommentCardInfo}>
              <p>2d</p>
              <p>{postData.comments[0].noOfLikes} likes</p>
              <p>Reply</p>
            </div>
          </div>
          <div className={styles.postCommentCardReplySection}>
            <hr />
            <p>View Replies (1)</p>
          </div>
        </div>
        <div className={styles.postCommentLikeBtn}>
            <FaRegHeart/>
        </div>
    </div>
  )
}

export default PostCommentCard