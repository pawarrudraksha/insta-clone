import React, { useEffect, useState } from "react";
import styles from "../../styles/messages/chat.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getChatInfo,
  selectCurrentChatInfo,
  selectIsChatDetailsOpen,
  selectIsReplyMsg,
  selectReplyMsg,
  sendTextMessage,
  setCurrentChatInfo,
  setReplyMsg,
  toggleChatDetails,
  toggleIsReplyMsg,
} from "../../app/features/messagesSlice";
import ChatDetails from "./ChatDetails";
import {
  IoCallOutline,
  IoInformationCircleOutline,
  IoInformationCircleSharp,
} from "react-icons/io5";
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { AiTwotoneAudio } from "react-icons/ai";
import Messages from "./chat/Messages";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../../app/features/authSlice";
import { defaultProfilePic } from "../../data/common";
import { io } from "socket.io-client";

const Chat: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { chatId } = useParams();
  const chatInfo = useAppSelector(selectCurrentChatInfo);
  const dispatch = useAppDispatch();
  const isChatDetailsOpen = useAppSelector(selectIsChatDetailsOpen);
  const [message, setMessage] = useState<string>("");
  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const isReplyMsg = useAppSelector(selectIsReplyMsg);
  const replyMsg = useAppSelector(selectReplyMsg);
  useEffect(() => {
    if (chatId) {
      const fetchChatInfo = async () => {
        const results = await dispatch(getChatInfo(chatId));
        dispatch(setCurrentChatInfo(results?.payload?.data));
      };
      fetchChatInfo();
    }
  }, [chatId]);
  const handleCloseReply = () => {
    dispatch(toggleIsReplyMsg());
    dispatch(
      setReplyMsg({
        type: "",
        msg: "",
        username: "",
        _id: "",
      })
    );
  };
  const ENDPOINT = "http://localhost:8080";
  const socket = io(ENDPOINT);

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && message.trim() && chatId) {
      const values = {
        toReplyMessage: replyMsg?._id,
        message: {
          type: "text",
          content: message,
        },
        chatId,
      };
      const result = await dispatch(sendTextMessage(values));
      if (result?.payload?.statusCode === 201) {
        const updatedUsers = chatInfo?.users?.map((item) => {
          return item?._id;
        });
        const socketValues = {
          message: { _id: result?.payload?.data?._id, ...values?.message },
          users: updatedUsers,
          senderId: currentUser?._id,
          chatId: chatId,
          toReplyMsg: {
            _id: replyMsg?._id,
            message: {
              type: replyMsg?.type,
              content: replyMsg?.msg,
            },
          },
        };
        socket.emit("new message", socketValues);
        if (isReplyMsg) {
          dispatch(toggleIsReplyMsg());
          dispatch(
            setReplyMsg({
              type: "",
              msg: "",
              username: "",
              _id: "",
            })
          );
        }
        setMessage("");
      }
    }
  };
  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          {chatInfo?.users?.length > 2 ? (
            "To do"
          ) : (
            <img
              src={
                chatInfo?.users.find((item) => item._id !== currentUser?._id)
                  ?.profilePic || defaultProfilePic
              }
              alt=""
            />
          )}
          <div className={styles.chatHeaderInfo}>
            {chatInfo?.users?.length > 2 ? (
              "To do"
            ) : (
              <p>
                {
                  chatInfo?.users.find((item) => item._id !== currentUser?._id)
                    ?.name
                }
              </p>
            )}
            <div className={styles.chatHeaderInfoBtns}>
              <IoCallOutline />
              <CiVideoOn />
              {isChatDetailsOpen ? (
                <IoInformationCircleSharp
                  onClick={() => dispatch(toggleChatDetails())}
                />
              ) : (
                <IoInformationCircleOutline
                  onClick={() => dispatch(toggleChatDetails())}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.chatMessagesWrapper}>
          <Messages />
        </div>
        <div className={styles.inputChatWrapper}>
          {isReplyMsg && (
            <div className={styles.replyMsgContainer}>
              <div className={styles.replyMsgUserInfo}>
                <p>
                  Replying to{" "}
                  {replyMsg?.username ? replyMsg?.username : "yourself"}{" "}
                </p>
                <IoMdClose
                  onClick={handleCloseReply}
                  className={styles.replyMsgClose}
                />
              </div>
              <p className={styles.replyMsg}>
                {replyMsg.type === "text" ? replyMsg.msg : "Attachment"}
              </p>
            </div>
          )}
          <div className={styles.chatInputContainer}>
            <BsEmojiSmile />
            <input
              type="text"
              placeholder="Message..."
              onChange={handleMessage}
              value={message}
              onKeyDown={handleSendMessage}
            />
            <AiTwotoneAudio />
            <CiImageOn />
            <FaRegHeart />
          </div>
        </div>
      </div>
      {isChatDetailsOpen && (
        <div className={styles.chatDetailsContainer}>
          <ChatDetails />
        </div>
      )}
    </div>
  );
};

export default Chat;
