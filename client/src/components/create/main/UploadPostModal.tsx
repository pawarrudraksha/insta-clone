import React, { useRef } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import {toggleCropPostModalOpen, toggleUploadPostModal, uploadFiles } from '../../../app/features/createPostSlice';
import styles from '../../../styles/create/uploadPostModal.module.css';;

const UploadPostModal: React.FC = () => {
  const dispatch=useAppDispatch()
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
        dispatch(uploadFiles(e.target.files))
        dispatch(toggleUploadPostModal())
        dispatch(toggleCropPostModalOpen())
      }
  }

  return (
    <div className={styles.uploadPostContainer}>
      <div className={styles.uploadPostHeader}>
        <p>Create new post</p>
      </div>
      <div className={styles.uploadPostContent}>
        <img src='assets/s1.png' alt="file icon" />
        <p>Drag photos and videos here</p>
        <label htmlFor="upload-post-input">
          <button className={styles.selectPostBtn} onClick={handleBtnClick}>Select from computer</button>
        </label>
        <input type="file" id='upload-post-input' ref={fileRef} onChange={handleInputChange} multiple/>
      </div>
    </div>
  );
};

export default UploadPostModal;
