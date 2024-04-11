import React, { useEffect, useRef, useState } from "react";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import styles from "../../../styles/messages/messages.module.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authSlice";
import { getMessages } from "../../../app/features/messagesSlice";
import { useParams } from "react-router-dom";
import { getPostByIdWhenLoggedIn } from "../../../app/features/viewPostSlice";
import { getUserInfo } from "../../../app/features/accountSlice";
import { fetchFollowingDoc } from "../../../app/features/homeSlice";
import { io, Socket } from "socket.io-client";

interface SocketMsgType {
  message: {
    _id: string;
    type: string;
    content: string;
  };
  chatId: string;
  toReplyMessage?: {
    _id: string;
    message: {
      type: string;
      content: string;
    };
  };
}
export interface MessageType {
  _id: string;
  message?: {
    type: string;
    content: string;
    _id?: string;
  };
  updatedAt: string;
  caption?: string;
  hasAccess?: boolean;
  postUserInfo?: {
    _id: string;
    username: string;
    profilePic: string;
  };
  senderInfo: {
    _id: string;
    username: string;
    profilePic: string;
  };
  toReplyMessage?: {
    _id: string;
    message: {
      type: string;
      content: string;
    };
  };
}

const ENDPOINT = "http://localhost:8080";
var socket: Socket, selectedChatCompare: string;
const Messages: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [page, setPage] = useState<number>(1);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { chatId } = useParams();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser);
    socket.on("connection", () => setSocketConnected(true));
  }, []);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (currentUser?._id && chatId) {
          const messagesResult = await dispatch(
            getMessages({ chatId, page, limit: 100 })
          );
          if (messagesResult?.payload?.data?.length > 0) {
            const updatedResult = await Promise.all(
              messagesResult?.payload?.data?.map(async (msg: MessageType) => {
                if (msg?.message?._id && msg?.message?.type !== "text") {
                  const post = await dispatch(
                    getPostByIdWhenLoggedIn(msg?.message?._id)
                  );

                  const postOwner = await (
                    await dispatch(
                      getUserInfo(post?.payload?.data?.userInfo?.username)
                    )
                  )?.payload?.data;
                  const isFollow = await (
                    await dispatch(fetchFollowingDoc(postOwner?._id))
                  )?.payload?.data;

                  if (!isFollow?._id && postOwner?.isPrivate) {
                    return {
                      hasAccess: false,
                      _id: msg?.message?._id,
                      senderInfo: msg?.senderInfo,
                      postUserInfo: post?.payload?.data?.userInfo,
                      message: {
                        type: msg?.message?.type,
                      },
                    };
                  } else {
                    return {
                      hasAccess: true,
                      ...msg,
                      postUserInfo: post?.payload?.data?.userInfo,
                      caption: post?.payload?.data?.caption,
                    };
                  }
                }
                return msg;
              })
            );
            setMessages(updatedResult);
            socket.emit("join chat", chatId);
          } else {
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
    if (chatId) {
      selectedChatCompare = chatId;
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      socket.on("message received", (newMessageReceived: SocketMsgType) => {
        console.log("doepwpoeded");
        if (
          !selectedChatCompare ||
          selectedChatCompare !== newMessageReceived?.chatId
        ) {
        } else {
          const updatedAt = new Date().toISOString();
          const updatedValues: MessageType = {
            _id: chatId,
            updatedAt: updatedAt,
            message: newMessageReceived?.message,
            senderInfo: {
              _id: currentUser?._id,
              username: currentUser?.username,
              profilePic: currentUser?.profilePic,
            },
            toReplyMessage: newMessageReceived?.toReplyMessage || undefined,
          };
          setMessages([...messages, updatedValues]);
        }
      });
    }
  });
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages, chatId]);
  return (
    <div className={styles.messagesContainer} ref={messageRef}>
      <div className={styles.messagesHeaderWrapper}>
        <MessagesHeader />
      </div>
      <div className={styles.messages}>
        {messages &&
          messages?.length > 0 &&
          messages.map((msg, index) => <Message message={msg} key={index} />)}
      </div>
    </div>
  );
};

export default Messages;
