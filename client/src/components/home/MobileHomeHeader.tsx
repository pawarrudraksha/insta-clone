import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/home/mobileHomeHeader.module.css";
import { BsSend } from "react-icons/bs";

const MobileHomeHeader: React.FC = () => {
  return (
    <div className={styles.homeHeaderContainer}>
      <Link className={styles.sidebarLogo} to={"/"}>
        Instagram
      </Link>
      <Link className={styles.homeHeaderSendMsgBtn} to={"/direct/inbox"}>
        <BsSend />
      </Link>
    </div>
  );
};

export default MobileHomeHeader;
