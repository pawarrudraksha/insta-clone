import React, { useState } from 'react'
import styles from '../../styles/account/accountPosts.module.css'
import { BsGrid3X3 } from 'react-icons/bs'
import { GoVideo } from 'react-icons/go'
import { BiUserPin } from "react-icons/bi";
import { accountData } from '../../data/sampleAccount';
import RenderPosts from './render/RenderPosts';
import RenderReels from './render/RenderReels';
import RenderTagged from './render/RenderTagged';

const AccountPosts:React.FC = () => {
  const Tabs=[
    {
      name:"POSTS",
      icon:<BsGrid3X3 />,
    },
    {
      name:"REELS",
      icon: <GoVideo/>
    },
    {
      name:"TAGGED",
      icon:<BiUserPin />

    }
  ]
  const [activeTab,setActiveTab]=useState<string>("POSTS")
  return (
    <div className={styles.accountPostsContainer}>
      <div className={styles.accountPostsTabs}>
        {
          Tabs.map((tab,index)=>(
            <div className={`${styles.accountPostsTab} ${activeTab===tab.name && styles.accountPostsActiveTab}`} key={index}  onClick={()=>setActiveTab(tab.name)}>
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