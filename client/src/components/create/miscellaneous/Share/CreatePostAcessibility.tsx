import React from 'react';
import styles from '../../../../styles/create/createPostAccessibility.module.css'
import { useAppSelector } from '../../../../app/hooks';
import { selectPosts } from '../../../../app/features/createPostSlice';

const CreatePostAcessibility:React.FC = () => {
    const posts=useAppSelector(selectPosts)  
    return (
        <div className={styles.accessibilityContainer}>
            <p>Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.</p>
            <div className={styles.accessibilityContent}>
                {
                    posts.map((post,index)=>(
                        <div className={styles.accessibiltyCard} key={index}>
                            {
                                post.type==='video' && <video src={post.post}></video>
                            }
                            {
                                post.type==='image' &&  <img src={post.post} alt="post" />
                            }
                            <input type="text" id="" placeholder='Write alt text' />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CreatePostAcessibility