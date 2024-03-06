import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface AppState {
  isSearchModalOpen: boolean;
  isProfileModalOpen: boolean
  isMoreModalOpen:boolean;
  isNotificationModalOpen:boolean;
  isNotificationRequestsModalOpen:boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isSearchModalOpen: false,
  isProfileModalOpen:false,
  isMoreModalOpen:false,
  isNotificationModalOpen:false,
  isNotificationRequestsModalOpen:false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSearchModal:(state)=>{
      state.isSearchModalOpen= !state.isSearchModalOpen
    },
    toggleMoreModal:(state)=>{
      state.isMoreModalOpen= !state.isMoreModalOpen
    },
    toggleNotificationModal:(state)=>{
      state.isNotificationModalOpen= !state.isNotificationModalOpen
    },
    toggleNotificationRequestsModal:(state)=>{
      state.isNotificationRequestsModalOpen= !state.isNotificationRequestsModalOpen
    },
    openProfileModal:(state)=>{
      state.isProfileModalOpen= true
    },
    closeProfileModal:(state)=>{
      state.isProfileModalOpen= false
    },
}});

export const { toggleSearchModal ,openProfileModal,closeProfileModal,toggleMoreModal,toggleNotificationModal,toggleNotificationRequestsModal} = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectIsSearchModalOpen = (state: RootState): boolean =>state.app.isSearchModalOpen;
export const selectIsProfileModalOpen = (state: RootState): boolean =>state.app.isProfileModalOpen;
export const selectIsMoreModalOpen = (state: RootState): boolean =>state.app.isMoreModalOpen;
export const selectIsNotificationModalOpen = (state: RootState): boolean =>state.app.isNotificationModalOpen;
export const selectIsNotificationRequestsModalOpen = (state: RootState): boolean =>state.app.isNotificationRequestsModalOpen;

export default appSlice.reducer;
