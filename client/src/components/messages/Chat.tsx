import React, { useState } from 'react'
import styles from '../../styles/messages/chat.module.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectIsChatDetailsOpen, selectIsReplyMsg, selectReplyMsg, toggleChatDetails, toggleIsReplyMsg } from '../../app/features/messagesSlice'
import ChatDetails from './ChatDetails'
import { accountData } from '../../data/sampleAccount'
import { IoCallOutline, IoInformationCircleOutline, IoInformationCircleSharp } from 'react-icons/io5'
import { CiImageOn, CiVideoOn } from 'react-icons/ci'
import { BsEmojiSmile } from 'react-icons/bs'
import { FaRegHeart } from 'react-icons/fa'
import { AiTwotoneAudio } from 'react-icons/ai'
import Messages from './chat/Messages'
import { IoMdClose } from 'react-icons/io'

const Chat:React.FC = () => {
  const dispatch=useAppDispatch()
  const isChatDetailsOpen=useAppSelector(selectIsChatDetailsOpen)
  const [message,setMessage]=useState<string>("")
  const handleMessage=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setMessage(e.target.value)
  }
  const isReplyMsg=useAppSelector(selectIsReplyMsg)
  const replyMsg=useAppSelector(selectReplyMsg)
  console.log(replyMsg);
  
  return (
    <div className={styles.chatWrapper}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <img src={accountData.profilePic} alt="" />
            <div className={styles.chatHeaderInfo}>
              <p>{accountData.name}</p>
              <div className={styles.chatHeaderInfoBtns}>
              <IoCallOutline/>
              <CiVideoOn/>
              {isChatDetailsOpen ?<IoInformationCircleSharp  onClick={()=>dispatch(toggleChatDetails())} /> 
              :<IoInformationCircleOutline onClick={()=>dispatch(toggleChatDetails())}/>}
              </div>
            </div>
          </div>
          <div className={styles.chatMessagesWrapper}>
            <Messages/>
          </div>
          <div className={styles.inputChatWrapper}>
            {
            isReplyMsg && <div className={styles.replyMsgContainer}>
              <div className={styles.replyMsgUserInfo}>
                <p>Replying to {replyMsg.user ? replyMsg.user : "yourself"} </p>
                <IoMdClose onClick={()=>dispatch(toggleIsReplyMsg())} className={styles.replyMsgClose}/>
              </div>
               <p className={styles.replyMsg}>{replyMsg.type==='text'?replyMsg.msg:"Attachment"}</p>
            </div>
            }
          <div className={styles.chatInputContainer}>
            <BsEmojiSmile/>
            <input type="text" placeholder='Message...' onChange={handleMessage} value={message} />
            <AiTwotoneAudio />
            <CiImageOn/>
            <FaRegHeart/>
          </div>
        </div>
          </div>
        {isChatDetailsOpen && <div className={styles.chatDetailsContainer}>
        <ChatDetails/>
        </div>}
    </div>
  )
}

export default Chat