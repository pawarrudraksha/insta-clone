import React from 'react'
import Checkbox from '../../../miscellaneous/Checkbox'
import styles from '../../../../styles/create/createPostAdvancedSettings.module.css'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { selectIsCommentsOff, selectIsHideLikesAndViews, setIsCommentsOff, setIsHideLikesAndViews } from '../../../../app/features/createPostSlice'

const AdvancedSettingsModal:React.FC= () => {
    const dispatch=useAppDispatch()
    const isCommentsOff=useAppSelector(selectIsCommentsOff)
    const isHideLikesAndViews=useAppSelector(selectIsHideLikesAndViews)
    console.log("isHideLikesAndViews",isHideLikesAndViews);
    console.log("isComments",isCommentsOff);
    
    const handleCommentsOff=()=>{
        dispatch(setIsCommentsOff(!isCommentsOff))
    }
    const handleHideLikesAndViews=()=>{
        dispatch(setIsHideLikesAndViews(!isHideLikesAndViews))
    }
    return (
        <div className={styles.advancedSettingsContainer}>
            <div className={styles.advancedSettingsHideLikesContainer}>
                <div className={styles.advancedSettingHeader}>
                    <p>Hide likes and view counts on this post</p>
                    <Checkbox value={isHideLikesAndViews} setValue={handleHideLikesAndViews} name="likesAndViews"/>
                </div>
                <p>Only you will see the total number of likes and views on this post. You can change this later by going to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your account settings.</p>
            </div>
            <div className={styles.advancedSettingsHideCommentsContainer}>
                <div className={styles.advancedSettingHeader}>
                    <p>Turn off commenting</p>
                    <Checkbox value={isCommentsOff} setValue={handleCommentsOff} name="comments"/>
                </div>
                <p>You can change this later by going to the ··· menu at the top of your post.</p>
            </div>
        </div>
    )
}

export default AdvancedSettingsModal