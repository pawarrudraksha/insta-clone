import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface AppState {
  isSearchModalOpen: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isSearchModalOpen: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSearchModal:(state)=>{
        state.isSearchModalOpen= !state.isSearchModalOpen
    }
  },
});

export const { toggleSearchModal } = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectIsSearchModalOpen = (state: RootState): boolean =>state.app.isSearchModalOpen;

export default appSlice.reducer;
