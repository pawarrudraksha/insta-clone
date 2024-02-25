import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface AppState {
  isSearchModalOpen: boolean;
  isProfileModalOpen: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isSearchModalOpen: false,
  isProfileModalOpen:true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSearchModal:(state)=>{
      state.isSearchModalOpen= !state.isSearchModalOpen
    },
    openProfileModal:(state)=>{
      state.isProfileModalOpen= true
    },
    closeProfileModal:(state)=>{
      state.isProfileModalOpen= false
    }
  },
});

export const { toggleSearchModal ,openProfileModal,closeProfileModal} = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectIsSearchModalOpen = (state: RootState): boolean =>state.app.isSearchModalOpen;
export const selectIsProfileModalOpen = (state: RootState): boolean =>state.app.isProfileModalOpen;

export default appSlice.reducer;
