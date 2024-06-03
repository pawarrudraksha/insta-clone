import React, { useState } from "react";
import styles from "../../../styles/miscellaneous/moreModal.module.css";
import { IoMdSettings } from "react-icons/io";
import { LuActivitySquare } from "react-icons/lu";
import { CgBookmark } from "react-icons/cg";
import { GoMoon } from "react-icons/go";
import { TbMessageReport } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  logout,
  selectCurrentUser,
  setCurrentUser,
} from "../../../app/features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  selectDisplayMode,
  setDisplayMode,
} from "../../../app/features/appSlice";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const MoreModal: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const displayMode = useAppSelector(selectDisplayMode);
  const tabs = [
    {
      name: "Settings",
      icon: <IoMdSettings />,
      onClick: () => {},
    },
    {
      name: "Your activity",
      icon: <LuActivitySquare />,
      onClick: () => {},
    },
    {
      name: "Saved",
      icon: <CgBookmark />,
      onClick: () => {
        navigate(`/${currentUser?.username}`);
      },
    },
    {
      name: "Switch appearance",
      icon: displayMode === "dark" ? <GoMoon /> : <MdOutlineLightMode />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsAppearanceModalOpen(!isAppearanceModalOpen);
      },
    },
    {
      name: "Report a problem",
      icon: <TbMessageReport />,
      onClick: () => {},
    },
  ];
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(setCurrentUser({}));
    dispatch(logout());
    navigate("/accounts/login");
  };
  const handleDarkMode = () => {
    dispatch(setDisplayMode("dark"));
  };
  const handleLightMode = () => {
    dispatch(setDisplayMode("light"));
  };
  return (
    <div className={styles.moreModalWrapper}>
      <div className={styles.moreTabsWrapper}>
        {tabs.map((tab, index) => (
          <button className={styles.moreTab} key={index} onClick={tab.onClick}>
            {tab.icon}
            <p>{tab.name}</p>
          </button>
        ))}
        {isAppearanceModalOpen && (
          <div className={styles.moreModalAppearanceModal}>
            <button onClick={handleLightMode}>
              <MdOutlineLightMode />
              <p>Light</p>
            </button>
            <button onClick={handleDarkMode}>
              <MdDarkMode />
              <p>Dark</p>
            </button>
          </div>
        )}
      </div>
      <button className={styles.moreBtn}>Switch Accounts</button>
      <button className={styles.moreBtn} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default MoreModal;
