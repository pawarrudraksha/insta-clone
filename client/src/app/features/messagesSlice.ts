import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

interface SendTextType {
  chatId: string;
  toReplyMessage?: string;
  message: {
    type: string;
    content: string;
  };
}
export const createChat = createAsyncThunk(
  "chat/create-chat",
  async (users: string[]) => {
    try {
      if (users?.length > 1) {
        const response = await axios.post("/chat/create", {
          users,
          isGroupChat: true,
          chatName: "",
        });
        return response.data;
      } else {
        const response = await axios.post("/chat/create", { users });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getChatInfo = createAsyncThunk(
  "chat/get-info",
  async (chatId: string) => {
    try {
      const response = await axios.get(`/chat/get-chat-info/${chatId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserChats = createAsyncThunk(
  "chat/get-user-chats",
  async () => {
    try {
      const response = await axios.get(`/chat/get-user-chats`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteChat = createAsyncThunk(
  `chat/delete`,
  async (chatId: string) => {
    try {
      const response = await axios.delete(`/chat/delete-chat/${chatId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const findChat = createAsyncThunk(
  "chat/find",
  async (requestedUser: string) => {
    try {
      const response = await axios.get(`/chat/find-chat/${requestedUser}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/get-messages",
  async ({
    chatId,
    page,
    limit,
  }: {
    chatId: string;
    page: number;
    limit?: number;
  }) => {
    try {
      if (limit) {
        const response = await axios.get(
          `/messages/get-chat-messages/${chatId}?page=${page}&limit=${limit}`
        );
        return response.data;
      } else {
        const response = await axios.get(
          `/messages/get-chat-messages/${chatId}?page=${page}`
        );
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendTextMessage = createAsyncThunk(
  "chat/send-text-message",
  async ({ chatId, toReplyMessage, message }: SendTextType) => {
    try {
      if (toReplyMessage) {
        const response = await axios.post("/messages/send-text", {
          chatId,
          message,
          toReplyMessage,
        });
        return response.data;
      } else {
        const response = await axios.post("/messages/send-text", {
          chatId,
          message,
        });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMessageById = createAsyncThunk(
  "chat/get-message-by-id",
  async ({ chatId, messageId }: { chatId: string; messageId: string }) => {
    try {
      const response = await axios.get(
        `/messages/get-message?chatId=${chatId}&messageId=${messageId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
interface replyMsgState {
  type: string;
  msg: string;
  username?: string;
  _id?: string;
}

interface User {
  _id: string;
  username: string;
}

export interface ChatInfo {
  updatedAt: string;
  _id: string;
  isGroupChat: boolean;
  chatName: string;
  admin: { _id: string; name: string; username: string; profilePic: string }[];
  users: { _id: string; name: string; username: string; profilePic: string }[];
}
interface MessagesState {
  isChatDetailsOpen: boolean;
  isNewMessageModalOpen: boolean;
  isReplyMsg: boolean;
  replyMsg: replyMsgState;
  checkedUsers: User[];
  currentChatInfo: ChatInfo;
}

// Define the initial state using that type
const initialState: MessagesState = {
  isChatDetailsOpen: false,
  isNewMessageModalOpen: false,
  isReplyMsg: false,
  replyMsg: {
    type: "",
    msg: "",
    username: "",
    _id: "",
  },
  checkedUsers: [],
  currentChatInfo: {
    _id: "",
    updatedAt: "",
    users: [],
    admin: [],
    chatName: "",
    isGroupChat: false,
  },
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    toggleChatDetails: (state) => {
      state.isChatDetailsOpen = !state.isChatDetailsOpen;
    },
    toggleNewMessageModal: (state) => {
      state.isNewMessageModalOpen = !state.isNewMessageModalOpen;
    },
    toggleIsReplyMsg: (state) => {
      state.isReplyMsg = !state.isReplyMsg;
    },
    setReplyMsg: (state, action) => {
      state.replyMsg = action.payload;
    },
    addToCheckUsers: (state, action) => {
      if (state.checkedUsers.length === 0) {
        state.checkedUsers = [];
      }
      state.checkedUsers.push(action.payload);
    },
    resetCheckedUsers: (state) => {
      state.checkedUsers = [];
    },
    setCheckedUsers: (state, action) => {
      state.checkedUsers = action.payload;
    },
    setCurrentChatInfo: (state, action) => {
      state.currentChatInfo = action.payload;
    },
  },
});

export const {
  toggleChatDetails,
  toggleNewMessageModal,
  toggleIsReplyMsg,
  setReplyMsg,
  addToCheckUsers,
  resetCheckedUsers,
  setCheckedUsers,
  setCurrentChatInfo,
} = messagesSlice.actions;

export const selectIsChatDetailsOpen = (state: RootState): boolean =>
  state.messages.isChatDetailsOpen;
export const selectReplyMsg = (state: RootState): replyMsgState =>
  state.messages.replyMsg;
export const selectIsReplyMsg = (state: RootState): boolean =>
  state.messages.isReplyMsg;
export const selectIsNewMessageModalOpen = (state: RootState): boolean =>
  state.messages.isNewMessageModalOpen;
export const selectCheckedUsers = (state: RootState): User[] =>
  state.messages.checkedUsers;
export const selectCurrentChatInfo = (state: RootState): ChatInfo =>
  state.messages.currentChatInfo;

export default messagesSlice.reducer;
