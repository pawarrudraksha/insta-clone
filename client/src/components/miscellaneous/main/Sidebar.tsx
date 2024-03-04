import styles from '../../../styles/miscellaneous/sidebar.module.css';
import { MdHomeFilled } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaInstagram, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { BsThreads } from "react-icons/bs";
import { GrMenu } from "react-icons/gr";
import {  useNavigate } from 'react-router-dom';
import { selectIsSearchModalOpen, toggleSearchModal } from '../../../app/features/appSlice';
import { BiMoviePlay } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleCreatePostModalOpen, toggleUploadPostModal } from '../../../app/features/createPostSlice';

const Sidebar = () => {
  const dispatch =useAppDispatch() 
  const isSearchModalOpen = useAppSelector(selectIsSearchModalOpen);
  const navigate=useNavigate()  
  const sidebarTab = [
    {
      name: "Home",
      icon: <MdHomeFilled />,
      onClick: () => {
        navigate("/")
      }
    },
    {
      name: "Search",
      icon: <FiSearch />,
      onClick: () => {        
        dispatch(toggleSearchModal())
      }
    },
    {
      name: "Explore",
      icon: <MdExplore />,
      onClick: () => {
        navigate("/explore/")
      }
    },
    {
      name: "Reels",
      icon: <BiMoviePlay/>,
      onClick: () => {
        navigate("/reels/12")
      }
    },
    {
      name: "Messages",
      icon: <FiSend />,
      onClick: () => {}
    },
    {
      name: "Notifications",
      icon: <FaRegHeart />,
      onClick: () => {}
    },
    {
      name: "Create",
      icon: <FaPlusSquare />,
      onClick: ()=>{
        dispatch(toggleCreatePostModalOpen())    
        dispatch(toggleUploadPostModal())
      }
    },
    {
      name: "Profile",
      icon: <RxAvatar />,
      onClick: () => {}
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
      icon: <GrMenu />
    }
  ];

  return (
    <div className={`${styles.sidebar} ${isSearchModalOpen && styles.sidebarHideName}`}>
        <p>{!isSearchModalOpen ? "Instagram" :<FaInstagram/>}</p>
      <div className={`${styles.sidebarTabs} ${isSearchModalOpen && styles.hideSidebarTabs}`}>
        {sidebarTab.map((tab, index) => (
          <div className={`${styles.sidebarTab} ${isSearchModalOpen && styles.hideSidebarTab}`} key={index} onClick={tab.onClick}>
            {tab.icon}
            {!isSearchModalOpen && <p>{tab.name}</p>}
          </div>
        ))}
      </div>
      <div className={`${styles.sidebarExtraTabs} ${isSearchModalOpen && styles.hideSidebarTabs}`}>
        {sidebarExtraTab.map((tab, index) => (
          <div className={`${styles.sidebarTab}  ${isSearchModalOpen && styles.hideSidebarTab}`} key={index} onClick={tab.onClick}>
            {tab.icon}
            {!isSearchModalOpen && <p>{tab.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
