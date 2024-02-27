import React from 'react'
import { accountData } from '../../../data/sampleAccount'
import styles from "../../../styles/account/renderContent.module.css"
import { useNavigate } from 'react-router-dom'
import { openPostModal } from '../../../app/features/postSlice'
import { useAppDispatch } from '../../../app/hooks'
import PostItem from '../../miscellaneous/PostItem'

const RenderPosts:React.FC=()=>{
  return (
    <div className={styles.accountPostsContent}>
    {
      accountData.mixed.map((post, index) => (
        <PostItem 
          key={index} 
          item={{ type: `${post.isPost===true ? `post`:`reel`}`,showReelIcon:true, ...post }} 
  
        />
      ))
    }
    </div>
)
      
}

export default RenderPosts