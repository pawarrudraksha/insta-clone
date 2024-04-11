import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

// Define a type for the slice state
interface NotificationState {
    isNotificationRequestsModalOpen:boolean;
    isNotificationModalOpen:boolean
}

const initialState: NotificationState = {
    isNotificationRequestsModalOpen:false,
    isNotificationModalOpen:false
};


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    toggleNotificationModal:(state)=>{
        state.isNotificationModalOpen= !state.isNotificationModalOpen
      },
      toggleNotificationRequestsModal:(state)=>{
        state.isNotificationRequestsModalOpen= !state.isNotificationRequestsModalOpen
      },
  },
});
export const selectIsNotificationModalOpen = (state: RootState): boolean =>state.notification.isNotificationModalOpen;
export const selectIsNotificationRequestsModalOpen = (state: RootState): boolean =>state.notification.isNotificationRequestsModalOpen;
export const {toggleNotificationModal,toggleNotificationRequestsModal} = notificationSlice.actions; 

export default notificationSlice.reducer;
