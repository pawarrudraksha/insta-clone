import React, { useState } from 'react'
import styles from '../../../styles/create/sharePostModal.module.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import Carousel from '../../miscellaneous/Carousel'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectIsShareModalAccessibilitySettingsOpen, selectIsShareModalAdvancedSettingsOpen, selectPosts, toggleIsEditPostsModalOpen, toggleIsShareModalAccessibilitySettingsOpen, toggleIsShareModalAdvancedSettingsOpen, toggleIsSharePostModalOpen, toggleIsSuccessModalOpen } from '../../../app/features/createPostSlice'
import { accountData } from '../../../data/sampleAccount'
import { BsEmojiSmile } from 'react-icons/bs'
import { selectCarouselActiveType } from '../../../app/features/carouselSlice'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { GoLocation } from 'react-icons/go'
import { IoMdClose } from 'react-icons/io'
import CreatePostAdvancedSettings from '../miscellaneous/Share/CreatePostAdvancedSettings'
import CreatePostAcessibility from '../miscellaneous/Share/CreatePostAcessibility'

const SharePostModal:React.FC = () => {
    const dispatch=useAppDispatch()
    const posts=useAppSelector(selectPosts)
    const isAdvancedSettingOpen=useAppSelector(selectIsShareModalAdvancedSettingsOpen)
    const [caption,setCaption]=useState("")
    const isAccessibiltySettingOpen=useAppSelector(selectIsShareModalAccessibilitySettingsOpen)
    const [hideLocationIcon,setHideLocationIcon]=useState<boolean>(false)
    const [location,setLocation]=useState<string>("")
    const handleBack=()=>{
        dispatch(toggleIsSharePostModalOpen())
        dispatch(toggleIsEditPostsModalOpen())
    }
    const type=useAppSelector(selectCarouselActiveType)
    const handleLocation=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setLocation(e.target.value)
    }
    const handleCaption=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setCaption(e.target.value)
    }
    const handleShare=()=>{
        if(isAccessibiltySettingOpen){
            dispatch(toggleIsShareModalAccessibilitySettingsOpen())
        }
        if(isAdvancedSettingOpen){
            dispatch(toggleIsShareModalAdvancedSettingsOpen())
        }
        dispatch(toggleIsSharePostModalOpen())
        dispatch(toggleIsSuccessModalOpen())
    }
    return (
        <div className={styles.sharePostModalContainer}>
            <div className={styles.sharePostModalHeader}>
                <MdOutlineKeyboardBackspace onClick={handleBack}/>
                <p className={styles.shareTitle}>
                    {
                        type==='image'?"Create new post":"New reel"
                    }
                </p>
                <button className={styles.sharePostBtn} onClick={handleShare}>Share</button>
            </div>
            <div className={styles.sharePostContentContainer}>
                <div className={styles.sharePostCarouselContainer}>
                    <Carousel posts={posts} isCreatePost/>
                </div>
                <div className={styles.sharePostContent}>
                    <div className={styles.sharePostProfile}>
                        <img src={accountData.profilePic} alt="" />
                        <p>{accountData.username}</p>
                    </div>
                    <div className={styles.sharePostCaption}>
                        <textarea placeholder='Write a caption' value={caption} onChange={handleCaption} maxLength={2200}/>
                        <div className={styles.sharePostCaptionEmojiAndNo}>
                            <BsEmojiSmile/>
                            <p>{caption.length}/2,200</p>
                        </div>
                    </div>
                    <div className={styles.sharePostSettings}>
                        <div className={styles.sharePostLocation} >
                            <input type="text"  id="" placeholder='Add location' onChange={handleLocation} onClick={()=>setHideLocationIcon(true)}/>
                            { hideLocationIcon && location.length>0 ?<IoMdClose onClick={()=>setHideLocationIcon(false)}/>:<GoLocation/>}
                        </div>
                        <div className={styles.sharePostAccessibility} >
                            <div className={styles.sharePostAccessibilityHeader}  onClick={()=>dispatch(toggleIsShareModalAccessibilitySettingsOpen())}>
                                <p>Accessbility</p>
                                {isAccessibiltySettingOpen ?<FiChevronUp/> :<FiChevronDown/>}
                            </div>
                            {isAccessibiltySettingOpen && <CreatePostAcessibility/>}
                        </div>
                        <div className={styles.sharePostAdvancedSettings} >
                            <div className={styles.sharePostAdvancedSettingsHeader} onClick={()=>dispatch(toggleIsShareModalAdvancedSettingsOpen())}>
                                <p>Advanced Settings</p>
                                {isAdvancedSettingOpen ? <FiChevronUp /> :<FiChevronDown/>}
                            </div>
                            {isAdvancedSettingOpen && <CreatePostAdvancedSettings/>}
                        </div>
                        <p>Your followers can see your reel in their feeds and on your profile.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SharePostModal