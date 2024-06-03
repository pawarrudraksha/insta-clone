import React from "react";
import Chat from "../components/messages/Chat";
import ChatsSidebar from "../components/messages/ChatsSidebar";
import InitialChat from "../components/messages/miscellaneous/InitialChat";
import styles from "../styles/messages/messagesPage.module.css";

const MessagesPage: React.FC = () => {
  const url = window.location.pathname;
  const isMobile = window.innerWidth < 768;
  return (
    <div className={styles.messagesPageWrapper}>
      {(!isMobile || url.includes("/direct/inbox")) && <ChatsSidebar />}
      {url.includes("/direct/t") && <Chat />}
      {url.includes("/direct/inbox") && !isMobile && <InitialChat />}
    </div>
  );
};

export default MessagesPage;
