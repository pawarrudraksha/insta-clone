import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface UserType {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  isPrivate: boolean;
  bio?: string;
  website?: string;
  noOfPosts?: number;
  noOfFollowers?: number;
  noOfFollowing?: number;
}
// Define a type for the slice state
interface AppState {
  displayMode: string;
  isSearchModalOpen: boolean;
  isProfileModalOpen: boolean;
  isLikesModalOpen: boolean;
  isMoreModalOpen: boolean;
  profileModalData: UserType;
  sidebarActiveTab: string;
  getAllLikesTargetInfo: {
    type: "post" | "comment";
    _id: string;
  };
}

interface SearchUsersArgs {
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Define the initial state using that type
const initialState: AppState = {
  isSearchModalOpen: false,
  isProfileModalOpen: false,
  isMoreModalOpen: false,
  profileModalData: {
    _id: "",
    name: "",
    username: "",
    profilePic: "",
    isPrivate: true,
  },
  sidebarActiveTab: "",
  isLikesModalOpen: false,
  getAllLikesTargetInfo: {
    type: "post",
    _id: "",
  },
  displayMode: "dark",
};
export const searchUsers = createAsyncThunk(
  "app/searchUsers",
  async ({ searchQuery, page, limit }: SearchUsersArgs) => {
    const response = await axios.get(
      `/users/search?searchTerm=${searchQuery}&page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

export const getFollowRequests = createAsyncThunk(
  "app/get-follow-requests",
  async ({ page, limit }: { page: number; limit?: number }) => {
    try {
      if (limit) {
        const response = await axios.get(
          `/follow/get-follow-requests?page=${page}&limit=${limit}`
        );
        return response.data;
      } else {
        const response = await axios.get(
          `/follow/get-follow-requests?page=${page}`
        );
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const acceptFollowRequest = createAsyncThunk(
  "app/accept-follow-request",
  async (followDocId: string) => {
    try {
      const response = await axios.post(
        `/follow/accept-follow-request/${followDocId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteFollowRequest = createAsyncThunk(
  "app/delete-follow-request",
  async (followDocId: string) => {
    try {
      const response = await axios.delete(
        `/follow/delete-follow-request/${followDocId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const followUser = createAsyncThunk(
  "app/follow-user",
  async (userId: string) => {
    try {
      const response = await axios.post(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const unfollowUser = createAsyncThunk(
  "app/unfollow-user",
  async (userId: string) => {
    try {
      const response = await axios.delete(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    toggleMoreModal: (state) => {
      state.isMoreModalOpen = !state.isMoreModalOpen;
    },

    openProfileModal: (state) => {
      state.isProfileModalOpen = true;
    },
    closeProfileModal: (state) => {
      state.isProfileModalOpen = false;
    },
    setProfileModalData: (state, action) => {
      state.profileModalData = action.payload;
    },
    setSidebarActiveTab: (state, action) => {
      state.sidebarActiveTab = action.payload;
    },
    toggleLikesModal: (state) => {
      state.isLikesModalOpen = !state.isLikesModalOpen;
    },
    setGetAllLikesTargetInfo: (state, action) => {
      state.getAllLikesTargetInfo = action.payload;
    },
    setDisplayMode: (state, action) => {
      state.displayMode = action.payload;
    },
  },
});

export const {
  toggleSearchModal,
  openProfileModal,
  closeProfileModal,
  toggleMoreModal,
  setProfileModalData,
  setSidebarActiveTab,
  setGetAllLikesTargetInfo,
  toggleLikesModal,
  setDisplayMode,
} = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsSearchModalOpen = (state: RootState): boolean =>
  state.app.isSearchModalOpen;
export const selectDisplayMode = (state: RootState): string =>
  state.app.displayMode;
export const selectIsProfileModalOpen = (state: RootState): boolean =>
  state.app.isProfileModalOpen;
export const selectIsMoreModalOpen = (state: RootState): boolean =>
  state.app.isMoreModalOpen;
export const selectProfileModalData = (state: RootState): UserType =>
  state.app.profileModalData;
export const selectSidebarActiveTab = (state: RootState): string =>
  state.app.sidebarActiveTab;
export const selectIsLikesModalOpen = (state: RootState): boolean =>
  state.app.isLikesModalOpen;
export const selectGetAllLikesTarget = (
  state: RootState
): { _id: string; type: "post" | "comment" } => state.app.getAllLikesTargetInfo;

export default appSlice.reducer;
