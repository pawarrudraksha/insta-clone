import styles from '../../../styles/miscellaneous/sidebar.module.css';
import { MdHomeFilled, MdOutlineExplore } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaHeart, FaInstagram, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { BsFillSendFill, BsSend, BsThreads } from "react-icons/bs";
import { GrHomeRounded, GrMenu } from "react-icons/gr";
import {  useLocation, useNavigate } from 'react-router-dom';
import { selectIsSearchModalOpen, toggleSearchModal } from '../../../app/features/appSlice';
import { BiMoviePlay, BiSolidMoviePlay } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleCreatePostModalOpen, toggleUploadPostModal } from '../../../app/features/createPostSlice';
import Search from './Search';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PiHouseLight } from 'react-icons/pi';

const Sidebar = () => {
  const dispatch =useAppDispatch() 
  const isSearchModalOpen = useAppSelector(selectIsSearchModalOpen);
  const [activeTab,setActiveTab]=useState<string>("")
  const navigate=useNavigate()  
  const sidebarTab = [
    {
      name: "Home",
      icon:<PiHouseLight/>,
      activeIcon: <MdHomeFilled />,
      onClick: () => {
        setActiveTab("Home")
        navigate("/")
      }
    },
    {
      name: "Search",
      icon: <FiSearch />,
      onClick: (e:React.MouseEvent<HTMLDivElement>) => {    
        setActiveTab("Search")
        e.stopPropagation()    
        dispatch(toggleSearchModal())
      }
    },
    {
      name: "Explore",
      icon: <MdOutlineExplore/>,
      activeIcon: <MdExplore />,
      onClick: () => {
        setActiveTab("Explore")
        navigate("/explore/")
      }
    },
    {
      name: "Reels",
      icon: <BiMoviePlay/>,
      activeIcon:<BiSolidMoviePlay />,
      onClick: () => {
        setActiveTab("Reels")
        navigate("/reels/12")
      }
    },
    {
      name: "Messages",
      icon: <BsSend/>,
      activeIcon: <BsFillSendFill/>,
      onClick: () => {
        setActiveTab("Messages")
        navigate("/direct/inbox")
      }
    },
    {
      name: "Notifications",
      icon: <FaRegHeart />,
      activeIcon: <FaHeart />,
      onClick: () => {
        setActiveTab("Notifications")
        
      }
    },
    {
      name: "Create",
      icon: <FaPlusSquare />,
      onClick: ()=>{
        setActiveTab("Create")
        dispatch(toggleCreatePostModalOpen())    
        dispatch(toggleUploadPostModal())
      }
    },
    {
      name: "Profile",
      icon: <RxAvatar />,
      onClick: () => {
        setActiveTab("Profile")
      }
    },
  ];

  const sidebarExtraTab = [
    {
      name: "Threads",
      icon: <BsThreads />,
      onClick: () => {
        window.open("https://www.threads.net/login", "_blank") 
      }
    },
    {
      name: "More",
      icon: <GrMenu />,
      onClick: () => {

      }

    }
  ];
  const location=useLocation()
  const isMessages=location.pathname==='/direct/inbox'
  const hideSidebar=isMessages || isSearchModalOpen
  return (
    <div className={`${styles.sidebarWrapper} ${isMessages && styles.hideSidebarWrapper}`}>

    <div className={`${styles.sidebar} ${hideSidebar && styles.sidebarHideName}`}>
        <Link className={styles.sidebarLogo} to={"/"}>{hideSidebar ? <FaInstagram/>:"Instagram"}</Link>
      <div className={styles.sidebarTabs}>
        {sidebarTab.map((tab, index) => (
          <div className={`${styles.sidebarTab} ${(tab.name===activeTab && !tab.activeIcon) && styles.activeSidebarTab}`}key={index} onClick={tab.onClick}>
            {(tab.name===activeTab && tab.activeIcon)?tab.activeIcon:tab.icon}
            {!hideSidebar && <p>{tab.name}</p>}
          </div>
        ))}
      </div>
      <div className={styles.sidebarExtraTabs}>
        {sidebarExtraTab.map((tab, index) => (
          <div className={styles.sidebarTab}key={index} onClick={tab.onClick}>
            {tab.icon}
            {!hideSidebar && <p>{tab.name}</p>}
          </div>
        ))}
      </div>
    </div>
    {isSearchModalOpen && <Search/>}
        </div>
  );
}

export default Sidebar;
