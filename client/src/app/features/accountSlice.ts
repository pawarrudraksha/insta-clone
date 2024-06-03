import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface StoryType {
  coverPic: string;
  _id: string;
  caption: string;
  firstStory: {
    _id: string;
    content: {
      type: string;
      url: string;
    };
    updatedAt: string;
    caption: {
      text: string;
      color: string;
      position: {
        top: string;
        left: string;
      };
    };
  };
  username: string;
}

interface AccountState {
  highlights: StoryType[];
  accountUnfollowModal: boolean;
  isFollowersModalOpen: boolean;
  isFollowingModalOpen: boolean;
  followAnalyticsTargetUser: string;
}

interface AccountArgs {
  username: string;
  page: number;
  limit?: number;
  filterPost?: string;
}
// Define the initial state using that type
const initialState: AccountState = {
  highlights: [],
  accountUnfollowModal: false,
  isFollowersModalOpen: false,
  isFollowingModalOpen: false,
  followAnalyticsTargetUser: "",
};
export const getUserInfo = createAsyncThunk(
  "account/getUserInfo",
  async (username: string) => {
    try {
      const response = await axios.get(`/users/get-user-info/${username}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserPostsWhenLoggedIn = createAsyncThunk(
  "account/getUserPostsLoggedIn",
  async ({ username, page, limit, filterPost }: AccountArgs) => {
    try {
      const rlimit = limit || 6;
      let response;
      if (filterPost) {
        response = await axios.get(
          `/posts/get-posts-private-user/${username}?limit=${rlimit}&page=${page}&filterPost=${filterPost}`
        );
      } else {
        response = await axios.get(
          `/posts/get-posts-private-user/${username}?limit=${rlimit}&page=${page}`
        );
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserPostsWhenNotLoggedIn = createAsyncThunk(
  "account/getUserPosts",
  async ({ username, page, filterPost, limit }: AccountArgs) => {
    try {
      const rlimit = limit || 6;
      let response;
      if (filterPost) {
        response = await axios.get(
          `/posts/get-posts/${username}?limit=${rlimit}&page=${page}&filterPost=${filterPost}`
        );
      } else {
        response = await axios.get(
          `/posts/get-posts/${username}?limit=${rlimit}&page=${page}`
        );
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getUserReelsWhenLoggedIn = createAsyncThunk(
  "account/getUserReelsLoggedIn",
  async ({ username, page }: AccountArgs) => {
    try {
      const response = await axios.get(
        `/posts//get-private-user-reels/${username}?limit=6&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserReelsWhenNotLoggedIn = createAsyncThunk(
  "account/getUserReelsLoggedIn",
  async ({ username, page }: AccountArgs) => {
    try {
      const response = await axios.get(
        `/posts/get-public-user-reels/${username}?limit=6&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserTaggedPosts = createAsyncThunk(
  "account/tagged",
  async ({ username, page }: AccountArgs) => {
    try {
      const response = await axios.get(
        `/posts/get-tagged-posts/${username}?limit=6&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getUserSavedPosts = createAsyncThunk(
  "account/saved",
  async (page?: number) => {
    console.log("dew");

    try {
      const response = await axios.get(
        `/save-post/get-saved?limit=6&page=${page}`
      );
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserHighlightsWhenNotLoggedIn = createAsyncThunk(
  "account/highlights",
  async ({ username, page }: AccountArgs) => {
    try {
      const response = await axios.get(
        `/highlights/public/get-highlights/${username}?page=${page}&limit=9`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getUserHighlightsWhenLoggedIn = createAsyncThunk(
  "account/highlights",
  async ({ username, page }: AccountArgs) => {
    try {
      const response = await axios.get(
        `/highlights/private/get-highlights/${username}?page=${page}&limit=9`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getHighlightById = createAsyncThunk(
  "account/highlight-by-id",
  async (highlightId: string) => {
    try {
      const response = await axios.get(`/highlights/get/${highlightId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const fetchFollowers = createAsyncThunk(
  "account/fetch-all-followers",
  async ({ userId, page }: { userId: string; page: number }) => {
    try {
      const updatedPage = page || 1;
      const response = await axios.get(
        `/follow/get-followers/${userId}?page=${updatedPage}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const fetchFollowing = createAsyncThunk(
  "account/fetch-all-following",
  async ({ userId, page }: { userId: string; page: number }) => {
    try {
      const updatedPage = page || 1;
      const response = await axios.get(
        `/follow/get-following/${userId}?page=${updatedPage}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setHighlights: (state, action) => {
      state.highlights = action.payload;
    },
    setFollowAnalyticsTargetUser: (state, action) => {
      state.followAnalyticsTargetUser = action.payload;
    },
    toggleAccountUnfollowModal: (state) => {
      state.accountUnfollowModal = !state.accountUnfollowModal;
    },
    toggleIsFollowersModalOpen: (state) => {
      state.isFollowersModalOpen = !state.isFollowersModalOpen;
    },
    toggleIsFollowingModalOpen: (state) => {
      state.isFollowingModalOpen = !state.isFollowingModalOpen;
    },
  },
});

export const {
  setHighlights,
  toggleAccountUnfollowModal,
  toggleIsFollowersModalOpen,
  toggleIsFollowingModalOpen,
  setFollowAnalyticsTargetUser,
} = accountSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectHighlights = (state: RootState): StoryType[] =>
  state.account.highlights;
export const selectIsAccountUnfollowModal = (state: RootState): boolean =>
  state.account.accountUnfollowModal;
export const selectIsFollowersModalOpen = (state: RootState): boolean =>
  state.account.isFollowersModalOpen;
export const selectIsFollowingModalOpen = (state: RootState): boolean =>
  state.account.isFollowingModalOpen;
export const selectFollowAnalyticsTargetUser = (state: RootState): string =>
  state.account.followAnalyticsTargetUser;

export default accountSlice.reducer;
