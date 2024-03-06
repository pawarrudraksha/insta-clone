import React from 'react'
import MessagesHeader from './MessagesHeader'
import Message from './Message'
import styles from '../../../styles/messages/messages.module.css'
import { reelData } from '../../../data/reelData'
import { postData } from '../../../data/samplePost'

const Messages:React.FC= () => {
  return (
    <div className={styles.messagesContainer}>
        <div className={styles.messagesHeaderWrapper}>
          <MessagesHeader/>
        </div>
        <div className={styles.messages}>
          
          <Message msg="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit expedita repellat perspiciatis eligendi, illo neque atque assumenda cum? Aut qui asperiores et nulla alias molestias quia perspiciatis, quisquam esse itaque ab porro provident velit officiis enim sint a error earum reiciendis non magnam animi, fugiat repellendus odio! Quidem labore in minus doloribus. Cumque, doloremque provident sit consequatur soluta blanditiis commodi aliquid alias repellat rem sunt, doloribus sapiente ipsa iusto aperiam tempore voluptatem excepturi, in ea nihil. Ipsum, assumenda! Reiciendis soluta fugiat, animi totam hic accusamus. Vero, illum laudantium perferendis id distinctio sit porro doloribus aperiam commodi molestias placeat nam assumenda." type="text" isSelf/>
          <Message msg="dmdlfe" type="text" />
          <Message msg="dmdlfe" type="text" isSelf/>
          <Message msg={reelData[0].video} type="reel" />
          <Message msg={postData.posts[0].url} type="post" isSelf />
          <Message msg="dmdlfe" type="text" isSelf/>
          <Message msg="dmdlfe" type="text" isReply msgWhichIsReplied={{
            type:"reel",
            msg:"https://firebasestorage.googleapis.com/v0/b/letschat-mern-6572c.appspot.com/o/145320%20(360p).mp4?alt=media&token=57ef3006-975b-4346-a2c4-0f183b038e17"
          }}/>
          <Message msg="dmdlfe" type="text" isSelf isReply msgWhichIsReplied={{
            type:"reel",
            msg:"https://firebasestorage.googleapis.com/v0/b/letschat-mern-6572c.appspot.com/o/145320%20(360p).mp4?alt=media&token=57ef3006-975b-4346-a2c4-0f183b038e17"
          }}/>
          <Message msg="dmdlfe" type="text" isReply msgWhichIsReplied={{
            type:"text",
            msg:"oifnewr["
          }}/>
        </div>
    </div>
  )
}

export default Messages