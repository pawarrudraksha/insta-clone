import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface HomeState {
  suggestionProfileModal:boolean,
  activeSuggestionProfileModal:number;
}

// Define the initial state using that type
const initialState: HomeState = {
  suggestionProfileModal:false,
  activeSuggestionProfileModal:-1,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    openSuggestionProfileModal:(state)=>{
      state.suggestionProfileModal=true
    },
    closeSuggestionProfileModal:(state)=>{
      state.suggestionProfileModal=false
    },
    setActiveSuggestionProfileModal:(state,action)=>{
      state.activeSuggestionProfileModal=action.payload
    }
  },
});

export const {openSuggestionProfileModal,closeSuggestionProfileModal,setActiveSuggestionProfileModal} = homeSlice.actions; 

export const selectSuggestionProfileModal= (state: RootState): boolean =>state.home.suggestionProfileModal;
export const selectActiveSuggestionProfileModal= (state: RootState): number =>state.home.activeSuggestionProfileModal;

export default homeSlice.reducer;
