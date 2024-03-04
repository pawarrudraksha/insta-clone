import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { accountData } from '../../../data/sampleAccount';
import { BsDot } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import styles from "../../../styles/miscellaneous/search.module.css"
import { IoCloseCircle } from 'react-icons/io5';

const Search:React.FC = () => {
    const [hideSearchIcon,setHideSearch]=useState(false)  
    return (
        <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
            <p className={styles.searchTitle}>Search</p>
            <div className={styles.searchHeader}>
                <div className={styles.searchHeaderInputContainer} onClick={()=>setHideSearch(true)}>
                    {!hideSearchIcon && <CiSearch/>}
                    <input type="text" placeholder="Search"  className={styles.searchHeaderInput} onChange={()=>{}}/>
                </div>
                {hideSearchIcon && <IoCloseCircle onClick={()=>setHideSearch(false)} className={styles.searchCloseIcon}/>}
            </div>
            <div className={styles.searchContent}>
                <div className={styles.searchContentHeader}>
                    <p>Recent</p>
                    <button className={styles.searchContainerClearAll}>Clear All</button>
                </div>
                <div className={styles.searchResults}>
                    <div className={styles.searchResult}>
                        <div className={styles.searchResultPic}>
                        <img src={accountData.profilePic} alt="" />
                        </div>
                        <div className={styles.searchResultContent}>
                            <div className={styles.searchResultInfo}>
                                <p className={styles.searchResultInfoUserName}>{accountData.username}</p>
                                <div className={styles.searchResultInfoNameAndFollowers}>
                                    <p>{accountData.name}</p>
                                    <BsDot/>
                                    <p>2.3M Followers</p>
                                </div>
                            </div>
                            <IoMdClose className={styles.searchResultCloseIcon}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
