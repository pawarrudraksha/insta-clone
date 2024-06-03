import React, { useState } from "react";
import styles from "../../styles/account/accountPosts.module.css";
import { BsGrid3X3 } from "react-icons/bs";
import { BiMoviePlay, BiUserPin } from "react-icons/bi";
import RenderPosts from "./render/RenderPosts";
import RenderReels from "./render/RenderReels";
import RenderTagged from "./render/RenderTagged";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authSlice";
import { FaRegBookmark } from "react-icons/fa";
import RenderSaved from "./render/RenderSaved";

const AccountPosts: React.FC = () => {
  const Tabs = [
    {
      name: "POSTS",
      icon: <BsGrid3X3 />,
    },
    {
      name: "REELS",
      icon: <BiMoviePlay />,
    },
    {
      name: "TAGGED",
      icon: <BiUserPin />,
    },
  ];
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const viewUsername = window.location.pathname.slice(1);
  const [activeTab, setActiveTab] = useState<string>("POSTS");
  const handleTabClick = (name: string) => {
    if (name === "TAGGED") {
      if (currentUser?._id) {
        setActiveTab(name);
      } else {
        navigate("/accounts/login");
      }
    }
    setActiveTab(name);
  };
  return (
    <div className={styles.accountPostsContainer}>
      <div className={styles.accountPostsTabs}>
        {Tabs.map((tab, index) => (
          <div
            className={`${styles.accountPostsTab} ${
              activeTab === tab.name && styles.accountPostsActiveTab
            }`}
            key={index}
            onClick={() => handleTabClick(tab.name)}
          >
            {tab.icon}
            <p>{tab.name}</p>
          </div>
        ))}
        {viewUsername === currentUser?.username && (
          <div
            className={`${styles.accountPostsTab} ${
              activeTab === "SAVED" && styles.accountPostsActiveTab
            }`}
            onClick={() => handleTabClick("SAVED")}
          >
            <FaRegBookmark />
            <p>SAVED</p>
          </div>
        )}
      </div>
      {activeTab === "POSTS" && <RenderPosts />}
      {activeTab === "REELS" && <RenderReels />}
      {activeTab === "TAGGED" && <RenderTagged />}
      {activeTab === "SAVED" && <RenderSaved />}
    </div>
  );
};

export default AccountPosts;
