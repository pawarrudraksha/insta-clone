import React, { useState } from 'react'
import styles from '../../styles/account/accountPosts.module.css'
import { BsGrid3X3 } from 'react-icons/bs'
import { BiMoviePlay, BiUserPin } from "react-icons/bi";
import RenderPosts from './render/RenderPosts';
import RenderReels from './render/RenderReels';
import RenderTagged from './render/RenderTagged';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/features/authSlice';

const AccountPosts:React.FC = () => {
  const Tabs=[
    {
      name:"POSTS",
      icon:<BsGrid3X3 />,
    },
    {
      name:"REELS",
      icon: <BiMoviePlay/>
    },
    {
      name:"TAGGED",
      icon:<BiUserPin />

    }
  ]
  const currentUser=useAppSelector(selectCurrentUser)
  const navigate=useNavigate()
  const [activeTab,setActiveTab]=useState<string>("POSTS")
  const handleTabClick=(name:string)=>{
    if(name==="TAGGED"){
      if(currentUser?._id){
        setActiveTab(name)
      }else{
        navigate("/accounts/login")
      }
    }
    setActiveTab(name)
  }
  return (
    <div className={styles.accountPostsContainer}>
      <div className={styles.accountPostsTabs}>
        {
          Tabs.map((tab,index)=>(
            <div className={`${styles.accountPostsTab} ${activeTab===tab.name && styles.accountPostsActiveTab}`} key={index}  onClick={()=>handleTabClick(tab.name)}>
              {tab.icon}
              <p>{tab.name}</p>
            </div>
            ))
        }
      </div>
      {activeTab==="POSTS"  && <RenderPosts/>}
      {activeTab==="REELS"  && <RenderReels/>}
      {activeTab==="TAGGED"  && <RenderTagged/>}
    </div>
  )
}

export default AccountPosts