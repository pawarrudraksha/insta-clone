import React from 'react';
import styles from '../../styles/sidebar.module.css';
import { MdHomeFilled } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaInstagram, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { GoVideo } from "react-icons/go";
import { BsThreads } from "react-icons/bs";
import { GrMenu } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSearchModalOpen, toggleSearchModal } from '../../app/features/appSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSearchModalOpen = useSelector(selectIsSearchModalOpen);

  const sidebarTab = [
    {
      name: "Home",
      icon: <MdHomeFilled />,
      onClick: () => {}
    },
    {
      name: "Search",
      icon: <FiSearch />,
      onClick: () => dispatch(toggleSearchModal())
    },
    {
      name: "Explore",
      icon: <MdExplore />,
      onClick: () => {}
    },
    {
      name: "Reels",
      icon: <GoVideo />,
      onClick: () => {}
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
      onClick: () => {}
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
      icon: <BsThreads />
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
          <div className={`${styles.sidebarTab}  ${isSearchModalOpen && styles.hideSidebarTab}`} key={index}>
            {tab.icon}
            {!isSearchModalOpen && <p>{tab.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
