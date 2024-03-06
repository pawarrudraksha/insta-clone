import React, { useState } from 'react'
import styles from '../../../styles/messages/message.module.css'
import { accountData } from '../../../data/sampleAccount';
import { IoIosMore } from 'react-icons/io';
import { HiReply } from 'react-icons/hi';
import { BsEmojiSmile } from 'react-icons/bs';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectIsReplyMsg, selectReplyMsg, setReplyMsg, toggleIsReplyMsg } from '../../../app/features/messagesSlice';

interface MessagesProps{
    msg:string;
    type:string;
    isSelf?:boolean;
    isReply?:boolean;
    msgWhichIsReplied?:{
        type:string;
        msg:string;
    };
    
}
const Message:React.FC<MessagesProps>= ({msg,type,isSelf,msgWhichIsReplied,isReply}) => {
    const [isHoverOptions,setIsHoverOptions]=useState<boolean>(false)
    const isReplyMsg=useAppSelector(selectIsReplyMsg)
    const dispatch=useAppDispatch()
    const handleReplyMsg=()=>{
        if(isReplyMsg){
            dispatch(toggleIsReplyMsg())
            dispatch(setReplyMsg({
                type:'',
                msg:'',
                user:''
            }))
        }
        dispatch(toggleIsReplyMsg())
        dispatch(setReplyMsg({
            type:type,
            msg:msg,
            user:isSelf?"" :accountData.username
        }))
    }
    const replyMsg=useAppSelector(selectReplyMsg)    
    return (
        <div 
        onMouseEnter={()=>setIsHoverOptions(true)} 
        onMouseLeave={()=>setIsHoverOptions(false)}
        className={`${styles.messageWrapper} ${isSelf && styles.sentMessageWrapper}`}
        >
            <div className={`${styles.messageReceivedContainer} ${isSelf && styles.messageSentContainer}`} >
           {!isSelf && <div className={styles.senderProfilePic}>
                {!isSelf && <img src={accountData.profilePic} alt="" className={styles.senderPic} />}
            </div>}
            <div className={styles.messageContentWrapper}>
            {
                (isReply && msgWhichIsReplied) && 
                <div className={`${styles.repliedMsgContainer} ${isSelf && styles.sentRepliedMsg}`}>
                    {isSelf ?<p>You replied to yourself</p> :<p>{accountData.username} replied to you</p>}
                    <div className={`${styles.replyMsgReceivedContent} ${isSelf && styles.replyMsgSentContent}`}>
                        {
                            msgWhichIsReplied.type==='text' &&
                            <p className={styles.replyMsgContentText}>{msgWhichIsReplied.msg}</p>
                        }
                        {
                            msgWhichIsReplied.type==='post' && 
                            <img src={accountData.profilePic} alt="m" />
                        }{
                            msgWhichIsReplied.type==='reel' && 
                            <div className={styles.repliedMsgIsReel}>
                                <video src={replyMsg.msg}  />
                                <BiSolidMoviePlay/>
                            </div>
                        }
                    </div>
                </div>
            }
            {
                type==='text' &&
                <p className={isSelf ? styles.sentMsg :styles.receivedMsg}>{msg}</p>
            }
            {
                type==='reel' && 
                <div  className={isSelf ? styles.sentMsgReel :styles.receivedMsgReel}>
                     <div className={styles.msgReelHeader}>
                        <img src={accountData.profilePic} alt="" className={styles.msgProfilePic} />
                        <p >{accountData.username}</p>
                    </div>
                    <video src={msg}></video>
                    <BiSolidMoviePlay/>
                </div>
            }
            {
                type==='post' &&
                <div  className={isSelf ? styles.sentMsgPost :styles.receivedMsgPost}>
                    <div className={styles.msgPostHeader}>
                        <img src={accountData.profilePic} alt="" className={styles.msgProfilePic} />
                        <p >{accountData.username}</p>
                    </div>
                    <img src={msg} alt="" />
                    <p className={styles.postCaption}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, temporibus.</p>
                </div>
            }
            </div>
            </div>

            <div className={`${styles.hoverOptions} ${isSelf &&styles.isHoverOptionsSelf} ${isHoverOptions && styles.activeHoverOptions}`}>
                {type!=='reel'&& <IoIosMore/>}
                <HiReply onClick={handleReplyMsg}/>
                <BsEmojiSmile/>
            </div>
        </div>
    )
}

export default Message