import React from 'react'
import styles from '../../../../styles/create/editVideo.module.css'
import { useAppSelector } from '../../../../app/hooks'
import { selectVideoFrames } from '../../../../app/features/carouselSlice'

const EditVideo:React.FC = () => {
    const videoFrames=useAppSelector(selectVideoFrames)
    console.log("videoFrames",videoFrames);
    
  return (
    <div className={styles.editVideoContainer}>
        <div className={styles.coverPhotoContainer}>
            <div className={styles.coverPhotoHeader}>
                <p>Cover photo</p>
                {
                    videoFrames.slice(0,6).map((item,index)=>(
                        <div>
                            Hello
                        </div>
                    ))
                }
                <button className={styles.coverPhotoHeaderBtn}>Select from computer</button>
            </div>
            <div className={styles.coverPhotos}>

            </div>
        </div>
        <div className={styles.trimVideoContainer}>
            <div className={styles.trimVideoHeader}>
                <p>Trim</p>
            </div>
        </div>
        <div className={styles.adjustAudioContainer}>
            <p>Video has no audio</p>
            <input type="checkbox"  id="audio-radio-btn" />
        </div>
    </div>
  )
}

export default EditVideo