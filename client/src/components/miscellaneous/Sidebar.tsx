import React from 'react'
import styles from '../../styles/sidebar.module.css'
import { MdHomeFilled } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { GoVideo } from "react-icons/go";
import { BsThreads } from "react-icons/bs";
import { GrMenu } from "react-icons/gr";
import { Link } from 'react-router-dom';


const Sidebar = () => {
  const sidebarTab = [
    {
        name: "Home",
        icon: <MdHomeFilled/>
    },
    {
        name: "Search",
        icon: <FiSearch/>
    },
    {
        name: "Explore",
        icon: <MdExplore/> 
    },
    {
        name: "Reels",
        icon: <GoVideo/>
    },
    {
        name: "Messages",
        icon: <FiSend/>
    },
    {
        name: "Notifications",
        icon: <FaRegHeart/>
    },
    {
        name: "Create",
        icon: <FaPlusSquare/>
    },
    {
        name: "Profile",
        icon: <RxAvatar/>
    },
];
  const sidebarExtraTab = [
    {
        name: "Threads",
        icon: <BsThreads/>
    },
    {
        name: "More",
        icon: <GrMenu/>
    }
];

  return (
    <div className={styles.sidebar}>
        <Link to="/"> <h3>Instagram</h3></Link>
        <div className={styles.sidebarTabs}>
          {
              sidebarTab.map((tab,index)=>(
                  <div className={styles.sidebarTab} key={index}>
              {tab.icon}
              <h3>{tab.name}</h3>
          </div>
              ))
          }
        </div>
        <div className={styles.sidebarExtraTabs}>
        {
              sidebarExtraTab.map((tab,index)=>(
                <div className={styles.sidebarTab} key={index}>
                    {tab.icon}
                    <h3>{tab.name}</h3>
                </div>
              ))
          }
        </div>
    </div>
  )
}

export default Sidebar