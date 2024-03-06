import React from "react";
import styles from '../../../styles/miscellaneous/moreModal.module.css'
import { IoMdSettings } from "react-icons/io";
import { LuActivitySquare } from "react-icons/lu";
import { CgBookmark } from "react-icons/cg";
import { GoMoon } from "react-icons/go";
import { TbMessageReport } from "react-icons/tb";

const MoreModal:React.FC=()=>{
    const tabs = [
        {
          name: "Settings",
          icon: <IoMdSettings/>,
          onClick: () => {}
        },
        {
          name: "Your activity",
          icon: <LuActivitySquare/>,
          onClick: () => {}
        },
        {
          name: "Saved",
          icon: <CgBookmark/>,
          onClick: () => {}
        },
        {
          name: "Switch appearance",
          icon: <GoMoon/>,
          onClick: () => {}
        },
        {
          name: "Report a problem",
          icon: <TbMessageReport/>,
          onClick: () => {}
        }
      ];
    return(
        <div className={styles.moreModalWrapper}>
            <div className={styles.moreTabsWrapper}>
                { tabs.map((tab,index)=>(
                    <div className={styles.moreTab} key={index}>
                        {tab.icon}
                        <p>{tab.name}</p>
                    </div>
                ))
                }
            </div>
            <button className={styles.moreBtn}>Switch Accounts</button>
            <button className={styles.moreBtn}>Log out</button>
        </div>
    )
}

export default MoreModal;