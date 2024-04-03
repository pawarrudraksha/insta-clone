import React, { useEffect, useState } from 'react'
import styles from '../../../styles/messages/message.module.css'
import { IoIosMore } from 'react-icons/io';
import { HiReply } from 'react-icons/hi';
import { BsEmojiSmile } from 'react-icons/bs';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getMessageById, selectIsReplyMsg, setReplyMsg, toggleIsReplyMsg } from '../../../app/features/messagesSlice';
import { MessageType } from './Messages';
import { selectCurrentUser } from '../../../app/features/authSlice';
import { defaultProfilePic } from '../../../data/common';
import { useParams } from 'react-router-dom';

interface Props{
    message:MessageType
}
const Message:React.FC<Props>= ({message}) => {
    const {chatId}=useParams()    
    const dispatch=useAppDispatch()
    const [toReplyOwner,setToReplyOwner]=useState<{_id:string,username:string}>({_id:'',username:''})
    
    useEffect(()=>{
        if(chatId && message?.toReplyMessage?._id){
            const fetchToReplyOwner=async()=>{    
                if(message?.toReplyMessage?._id){
                    const msg=await dispatch(getMessageById({chatId:chatId,messageId:message?.toReplyMessage?._id}))                    
                    setToReplyOwner(msg?.payload?.data?.senderInfo)
                }
            }
            fetchToReplyOwner()
        }
    },[])
    const currentUser=useAppSelector(selectCurrentUser)
    const [isHoverOptions,setIsHoverOptions]=useState<boolean>(false)
    const isReplyMsg=useAppSelector(selectIsReplyMsg)
    const isSelf=Boolean(message?.senderInfo?._id===currentUser?._id)
    const isReply=Boolean(message?.toReplyMessage?._id)
    const handleReplyMsg=()=>{
        if(isReplyMsg){
            dispatch(toggleIsReplyMsg())
            dispatch(setReplyMsg({
                type:'',
                msg:'',
                username:''
            }))
        }
        dispatch(toggleIsReplyMsg())
        if(message?.message?.type==='text'){
            if(isSelf){
                dispatch(setReplyMsg({
                    type:message?.message?.type,
                    msg:message?.message?.content,
                    _id:message?._id
                }))
            }else{
                dispatch(setReplyMsg({
                    type:message?.message?.type,
                    msg:message?.message?.content,
                    username:message?.senderInfo?.username,
                    _id:message?._id
                }))
            }
        }else{
            if(isSelf){
                dispatch(setReplyMsg({
                    type:message?.message?.type,
                    msg:message?.message?.content,
                    _id:message?._id,
                }))
            }else{
                dispatch(setReplyMsg({
                    type:message?.message?.type,
                    msg:message?.message?.content,
                    _id:message?._id,
                    username:message?.senderInfo?.username
                }))
            }
        }
    }
    return (
        <div 
        onMouseEnter={()=>setIsHoverOptions(true)} 
        onMouseLeave={()=>setIsHoverOptions(false)}
        className={`${styles.messageWrapper} ${isSelf && styles.sentMessageWrapper}`}
        >
            <div className={`${styles.messageReceivedContainer} ${isSelf && styles.messageSentContainer}`} >
           {!isSelf && <div className={styles.senderProfilePic}>
                {!isSelf && <img src={message?.senderInfo?.profilePic ? message?.senderInfo?.profilePic:defaultProfilePic} alt="" className={styles.senderPic} />}
            </div>}
            <div className={styles.messageContentWrapper}>
            {
                isReply  && 
                <div className={`${styles.repliedMsgContainer} ${isSelf && styles.sentRepliedMsg}`}>
                    {
                    toReplyOwner?._id===currentUser?._id 
                    ?(message?.senderInfo?._id===currentUser?._id ? <p>You replied to yourself</p>: <p>{message?.senderInfo?.username}  replied to you </p>)
                    :(message?.senderInfo?._id===currentUser?._id ? <p>You replied to {toReplyOwner?.username}</p> :<p>{toReplyOwner?.username} replied to himself</p>)
                    }
                    <div className={`${styles.replyMsgReceivedContent} ${isSelf && styles.replyMsgSentContent}`}>
                        {
                            message?.toReplyMessage?.message?.type==='text' &&
                            <p className={styles.replyMsgContentText}>{message?.toReplyMessage?.message?.content}</p>
                        }
                        {
                            message?.toReplyMessage?.message?.type==='post' && 
                            <img src={message?.toReplyMessage?.message?.content} alt="m" />
                        }{
                            message?.toReplyMessage?.message?.type==='reel' && 
                            <div className={styles.repliedMsgIsReel}>
                                <video src={message?.toReplyMessage?.message?.content}  />
                                <BiSolidMoviePlay/>
                            </div>
                        }
                    </div>
                </div>
            }
            {
                message?.message?.type==='text' &&
                <p className={isSelf ? styles.sentMsg :styles.receivedMsg}>{message?.message?.content}</p>
            }
            {
                message?.message?.type==='reel' && (message?.hasAccess ?
                <div  className={isSelf ? styles.sentMsgReel :styles.receivedMsgReel}>
                     <div className={styles.msgReelHeader}>
                        <img src={message?.postUserInfo?.profilePic || defaultProfilePic} alt="" className={styles.msg || defaultProfilePic} />
                        <p >{message?.postUserInfo?.username}</p>
                    </div>
                    <video src={message?.message?.content}></video>
                    <BiSolidMoviePlay/>
                </div>
                :
                <div  className={isSelf ? styles.sentMsgReel :styles.receivedMsgReel}>
                <div className={styles.msgReelHeader}>
                   <img src={message?.postUserInfo?.profilePic || defaultProfilePic} alt="" className={styles.msgProfilePic} />
                   <p >{message?.postUserInfo?.username}</p>
               </div>
               <p className={styles.noAccessMessage}>Follow {message?.postUserInfo?.username} to view the reel</p>
               <BiSolidMoviePlay/>
                </div>
                )
            }
            {
                message?.message?.type==='post' &&( message?.hasAccess ?
                <div  className={isSelf ? styles.sentMsgPost :styles.receivedMsgPost}>
                    <div className={styles.msgPostHeader}>
                        <img src={message?.postUserInfo?.profilePic || defaultProfilePic} alt="" className={styles.msgProfilePic} />
                        <p >{message?.postUserInfo?.username}</p>
                    </div>
                    <img src={message?.message?.content} alt="" />
                    <p className={styles.postCaption}>{message?.caption}</p>
                </div>
                :
                <div  className={isSelf ? styles.sentMsgPost :styles.receivedMsgPost}>
                    <div className={styles.msgPostHeader}>
                        <img src={message?.postUserInfo?.profilePic || defaultProfilePic} alt="" className={styles.msgProfilePic} />
                        <p >{message?.postUserInfo?.username}</p>
                    </div>
                    <p className={styles.noAccessMessage}>Follow {message?.postUserInfo?.username} to view the post</p>
                </div>
                )
            }
            </div>
            </div>

            <div className={`${styles.hoverOptions} ${isSelf &&styles.isHoverOptionsSelf} ${isHoverOptions && styles.activeHoverOptions}`}>
                {message?.message?.type!=='reel'&& <IoIosMore/>}
                <HiReply onClick={handleReplyMsg}/>
                <BsEmojiSmile/>
            </div>
        </div>
    )
}

export default Message