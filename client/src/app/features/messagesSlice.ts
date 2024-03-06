import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface replyMsgState{
    type:string,
    msg:string,
    user?:string
}

interface MessagesState {
    isChatDetailsOpen:boolean;
    isNewMessageModalOpen:boolean;
    isReplyMsg:boolean;
    replyMsg:replyMsgState
}

// Define the initial state using that type
const initialState: MessagesState = {
    isChatDetailsOpen: false,
    isNewMessageModalOpen: false,
    isReplyMsg:false,
    replyMsg:{
      type:'',
      msg:'',
      user:''
    }
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    toggleChatDetails:(state)=>{
      state.isChatDetailsOpen=!state.isChatDetailsOpen
    },
    toggleNewMessageModal:(state)=>{
      state.isNewMessageModalOpen=!state.isNewMessageModalOpen
    },
    toggleIsReplyMsg:(state)=>{
      state.isReplyMsg=!state.isReplyMsg
    },
    setReplyMsg:(state,action)=>{
      state.replyMsg=action.payload
    }
  },
});

export const { toggleChatDetails,toggleNewMessageModal,toggleIsReplyMsg,setReplyMsg} = messagesSlice.actions;

export const selectIsChatDetailsOpen = (state: RootState): boolean => state.messages.isChatDetailsOpen;
export const selectReplyMsg = (state: RootState): replyMsgState => state.messages.replyMsg;
export const selectIsReplyMsg = (state: RootState): boolean => state.messages.isReplyMsg;
export const selectIsNewMessageModalOpen = (state: RootState): boolean => state.messages.isNewMessageModalOpen;

export default messagesSlice.reducer;
