import styles from '../../../styles/miscellaneous/sidebar.module.css';
import { MdHomeFilled, MdOutlineExplore } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaHeart, FaInstagram, FaRegHeart, FaRegUserCircle } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { BsFillSendFill, BsSend, BsThreads } from "react-icons/bs";
import {  GrMenu } from "react-icons/gr";
import {  useLocation, useNavigate } from 'react-router-dom';
import { selectIsNotificationModalOpen, selectIsNotificationRequestsModalOpen, selectIsSearchModalOpen, selectSidebarActiveTab, setSidebarActiveTab, toggleMoreModal, toggleNotificationModal, toggleSearchModal } from '../../../app/features/appSlice';
import { BiMoviePlay, BiSolidMoviePlay } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleCreatePostModalOpen, toggleUploadPostModal } from '../../../app/features/createPostSlice';
import Search from './Search';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PiHouseLight } from 'react-icons/pi';
import { selectCurrentUser } from '../../../app/features/authSlice';

const Sidebar = () => {
  const dispatch =useAppDispatch() 
  const currentUser=useAppSelector(selectCurrentUser)
  const isSearchModalOpen = useAppSelector(selectIsSearchModalOpen);
  const isNotificationModalOpen=useAppSelector(selectIsNotificationModalOpen)
  const isNotificationRequestsModal=useAppSelector(selectIsNotificationRequestsModalOpen)
  const activeTab=useAppSelector(selectSidebarActiveTab)
  const navigate=useNavigate()  
  const sidebarTab = [
    {
      name: "Home",
      icon:<PiHouseLight/>,
      activeIcon: <MdHomeFilled />,
      onClick: () => {
        dispatch(setSidebarActiveTab("Home"))
        navigate("/")
      }
    },
    {
      name: "Search",
      icon: <FiSearch />,
      onClick: (e:React.MouseEvent<HTMLDivElement>) => {    
        if(isNotificationModalOpen){
          dispatch(toggleNotificationModal())
        }
        e.stopPropagation()    
        if(!isSearchModalOpen){          
          dispatch(setSidebarActiveTab("Search"))
        }else{          
          dispatch(setSidebarActiveTab(""))
        }
        dispatch(toggleSearchModal())
      }
    },
    {
      name: "Explore",
      icon: <MdOutlineExplore/>,
      activeIcon: <MdExplore />,
      onClick: () => {
        dispatch(setSidebarActiveTab("Explore"))
        navigate("/explore/")
      }
    },
    {
      name: "Reels",
      icon: <BiMoviePlay/>,
      activeIcon:<BiSolidMoviePlay />,
      onClick: () => {
        dispatch(setSidebarActiveTab("Reels"))
        navigate("/reels/12")
      }
    },
    {
      name: "Messages",
      icon: <BsSend/>,
      activeIcon: <BsFillSendFill/>,
      onClick: () => {
        dispatch(setSidebarActiveTab("Messages"))
        navigate("/direct/inbox")
      }
    },
    {
      name: "Notifications",
      icon: <FaRegHeart />,
      activeIcon: <FaHeart />,
      onClick: (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if(!isNotificationModalOpen){
          dispatch(setSidebarActiveTab("Notifications"))
        }else{
          dispatch(setSidebarActiveTab(""))
        }
        dispatch(toggleNotificationModal())
      }
    },
    {
      name: "Create",
      icon: <FaPlusSquare />,
      onClick: ()=>{
        dispatch(setSidebarActiveTab("Create"))
        dispatch(toggleCreatePostModalOpen())    
        dispatch(toggleUploadPostModal())
      }
    },
    {
      name: "Profile",
      icon: <RxAvatar />,
      onClick: () => {
        dispatch(setSidebarActiveTab("Profile"))
        navigate(`/${currentUser?.username}`)
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
        dispatch(toggleMoreModal())
      }

    }
  ];
  const location=useLocation()
  const isMessages=location.pathname==='/direct/inbox' || location.pathname.includes("/direct/t")
  const hideSidebar=isMessages || isSearchModalOpen || isNotificationModalOpen || isNotificationRequestsModal 

  return (
    <div className={`${styles.sidebarWrapper} ${isMessages && styles.hideSidebarWrapper}`}>

    <div className={`${styles.sidebar} ${hideSidebar && styles.sidebarHideName}`}>
        <Link className={styles.sidebarLogo} to={"/"}>{hideSidebar ? <FaInstagram/>:"Instagram"}</Link>
      <div className={styles.sidebarTabs}>
        {sidebarTab.map((tab, index) => (
          <div className={`${styles.sidebarTab} ${(tab.name===activeTab && !tab.activeIcon) && styles.activeSidebarTab}`}key={index} onClick={tab.onClick}>
            {tab.name==='Profile' ? 
            (currentUser?.profilePic ?<img src={currentUser?.profilePic}/>:<FaRegUserCircle/> )
            : (tab.name===activeTab && tab.activeIcon)?tab.activeIcon:tab.icon
            }
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
