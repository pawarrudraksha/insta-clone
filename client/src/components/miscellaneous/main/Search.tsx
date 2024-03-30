import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { BsDot } from 'react-icons/bs';
import styles from "../../../styles/miscellaneous/search.module.css"
import { IoCloseCircle } from 'react-icons/io5';
import { useAppDispatch } from '../../../app/hooks';
import { searchUsers, setSidebarActiveTab, toggleSearchModal } from '../../../app/features/appSlice';
import { useNavigate } from 'react-router-dom';


export interface ResultUser{
    _id:string,
    name:string,
    profilePic:string,
    createdAt:string,
    username:string,
    noOfFollowers:string
}
const Search:React.FC = () => {
    const navigate=useNavigate()
    const [searchQuery,setSearchQuery]=useState("")   
    const [hideSearchIcon,setHideSearch]=useState(false)
    const dispatch=useAppDispatch()
    const [page,setPage]=useState(1)
    const [limit,setLimit]=useState(7)
    const [searchResults,setSearchResults]=useState<ResultUser[]>([])
    const handleChange=async(e:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchQuery(e.target.value)
        if (e.target.value !== '') {
            const data = await dispatch(searchUsers({ searchQuery: e.target.value, page, limit }));
            setSearchResults(data?.payload?.data);
        }
    }       
    const handleSearchResultClick=(username:string)=>{
        navigate(`/${username}`)
        dispatch(toggleSearchModal())
        dispatch(setSidebarActiveTab(""))
    } 
    const handleSearchInputClose=()=>{
        setHideSearch(false)
        setSearchQuery("")
    }
    return (
        <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
            <p className={styles.searchTitle}>Search</p>
            <div className={styles.searchHeader}>
                <div className={styles.searchHeaderInputContainer} onClick={()=>setHideSearch(true)}>
                    {!hideSearchIcon && <CiSearch/>}
                    <input type="text" placeholder="Search" value={searchQuery} className={styles.searchHeaderInput} onChange={handleChange}/>
                </div>
                {hideSearchIcon && <IoCloseCircle onClick={handleSearchInputClose} className={styles.searchCloseIcon}/>}
            </div>
            <div className={styles.searchContent}>
                {!searchQuery  &&<div className={styles.searchContentHeader}>
                    <p>Recent</p>
                    <button className={styles.searchContainerClearAll}>Clear All</button>
                </div>}
                <div className={styles.searchResults}>
                    {searchQuery && searchResults?.map((user,index)=>(
                        <div className={styles.searchResult} key={index} onClick={()=>handleSearchResultClick(user?.username)}>
                        <div className={styles.searchResultPic}>
                        <img src={user?.profilePic} alt="" />
                        </div>
                        <div className={styles.searchResultContent}>
                            <div className={styles.searchResultInfo}>
                                <p className={styles.searchResultInfoUserName}>{user?.username}</p>
                                <div className={styles.searchResultInfoNameAndFollowers}>
                                    <p>{user?.name}</p>
                                    <BsDot/>
                                    <p>
                                        {user?.noOfFollowers.length>1?`${user?.noOfFollowers} followers` :`${user?.noOfFollowers} follower`}
                                    </p>
                                </div>
                            </div>
                            {/* <IoMdClose className={styles.searchResultCloseIcon}/> */}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;
