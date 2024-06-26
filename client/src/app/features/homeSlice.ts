import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

// Define a type for the slice state
interface HomeState {
  suggestionProfileModal: boolean;
  activeSuggestionProfileModal: number;
}

// Define the initial state using that type
const initialState: HomeState = {
  suggestionProfileModal: false,
  activeSuggestionProfileModal: -1,
};

export const getUserFeed = createAsyncThunk(
  "home/feed",
  async (page: number) => {
    const response = await axios.get(`/posts/get-user-feed?page=${page}`);
    return response.data;
  }
);

export const fetchFollowerDoc = createAsyncThunk(
  "home/followerDoc",
  async (requestedUserId: string) => {
    const response = await axios.get(
      `/follow/check-follower/${requestedUserId}`
    );
    return response.data;
  }
);
export const fetchFollowingDoc = createAsyncThunk(
  "home/followingDoc",
  async (requestedUserId: string) => {
    try {
      const response = await axios.get(
        `/follow/check-following/${requestedUserId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    openSuggestionProfileModal: (state) => {
      state.suggestionProfileModal = true;
    },
    closeSuggestionProfileModal: (state) => {
      state.suggestionProfileModal = false;
    },
    setActiveSuggestionProfileModal: (state, action) => {
      state.activeSuggestionProfileModal = action.payload;
    },
  },
});

export const {
  openSuggestionProfileModal,
  closeSuggestionProfileModal,
  setActiveSuggestionProfileModal,
} = homeSlice.actions;

export const selectSuggestionProfileModal = (state: RootState): boolean =>
  state.home.suggestionProfileModal;
export const selectActiveSuggestionProfileModal = (state: RootState): number =>
  state.home.activeSuggestionProfileModal;

export default homeSlice.reducer;
