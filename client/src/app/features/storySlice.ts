import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

// Define a type for the slice state

export interface ActiveStoryType {
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
}

interface StoriesSetType {
  _id: string; //userId,
  username: string;
  firstStory: ActiveStoryType;
  areAllStoriesViewed: boolean;
  profilePic?: string;
}

export interface ActiveStoriesSetType {
  activeStories: ActiveStoryType[];
  userInfo: {
    _id: string;
    isPrivate: boolean;
    username: string;
    profilePic?: string;
  };
}
export interface createStoryRequestType {
  content: {
    type: string;
    url: string;
  };
  caption: {
    text: string;
    color: string;
    position: {
      top: string;
      left: string;
    };
  };
}
export interface createStoryType {
  content: {
    type: string;
    url: string;
  };
  caption: {
    text: string;
    color: string;
  };
}
interface HomeStoryState {
  activeStoriesSetOfHomeStories: ActiveStoriesSetType;
  isStoryModalOpen: boolean;
  activeStoryOfHomeStories: ActiveStoryType;
  activeStoryNoOfHomeStories: number;
  activeIndexOfHomeStories: number;
  inactiveStoriesSetOfHomeStories: StoriesSetType[];
  stories: StoriesSetType[];
  createStory: createStoryType;
  isStoryCaptionModalOpen: boolean;
}

export const getAllActiveStories = createAsyncThunk(
  "story/get-all",
  async (page: number) => {
    try {
      const response = await axios.get(
        `/story/get-all-following-stories?page=${page}&limit=9`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getStoryById = createAsyncThunk(
  "story/get-by-id",
  async (id: string) => {
    try {
      const response = await axios.get(`/story/get-story/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserActiveStories = createAsyncThunk(
  "story/get-user-active-stories",
  async (id: string) => {
    try {
      const response = await axios.get(`/story/get-user-active-stories/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createStory = createAsyncThunk(
  "story/create",
  async (body: createStoryRequestType) => {
    try {
      const response = await axios.post("/story/create", body);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
// Define the initial state using that type
const initialState: HomeStoryState = {
  activeStoriesSetOfHomeStories: {
    userInfo: {
      _id: "",
      isPrivate: true,
      username: "",
    },
    activeStories: [],
  }, // Changed from null to an empty object
  isStoryModalOpen: false,
  activeStoryOfHomeStories: {
    _id: "",
    updatedAt: "",
    content: {
      type: "",
      url: "",
    },
    caption: {
      text: "",
      position: {
        top: "",
        left: "",
      },
      color: "",
    },
  },
  activeStoryNoOfHomeStories: 0,
  activeIndexOfHomeStories: -1,
  inactiveStoriesSetOfHomeStories: [],
  stories: [],
  createStory: {
    content: {
      type: "",
      url: "",
    },
    caption: {
      text: "",
      color: "",
    },
  },
  isStoryCaptionModalOpen: false,
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setActiveStoriesSetOfHomeStories: (state, action) => {
      state.activeStoriesSetOfHomeStories = action.payload;
    },
    resetActiveStoriesSetOfHomeStories: (state) => {
      state.activeStoriesSetOfHomeStories = {
        activeStories: [],
        userInfo: {
          _id: "",
          isPrivate: true,
          username: "",
        },
      };
    },
    setActiveStoryOfHomeStories: (state, action) => {
      state.activeStoryOfHomeStories = action.payload;
    },
    resetActiveStoryOfHomeStories: (state) => {
      state.activeStoryOfHomeStories = {
        _id: "",
        updatedAt: "",
        content: {
          type: "",
          url: "",
        },
        caption: {
          text: "",
          position: {
            top: "",
            left: "",
          },
          color: "",
        },
      };
    },
    setActiveStoryNoOfHomeStories: (state, action: PayloadAction<number>) => {
      state.activeStoryNoOfHomeStories = action.payload;
    },
    setInactiveStoriesSetOfHomeStories: (state, action) => {
      state.inactiveStoriesSetOfHomeStories = action.payload;
    },
    setStoriesOfHomeStories: (state, action) => {
      state.stories = action.payload;
    },
    setActiveIndexOfHomeStories: (state, action: PayloadAction<number>) => {
      state.activeIndexOfHomeStories = action.payload;
    },
    setCreateStory: (state, action) => {
      state.createStory = action.payload;
    },
    toggleIStoryCaptionModalOpen: (state) => {
      state.isStoryCaptionModalOpen = !state.isStoryCaptionModalOpen;
    },
  },
});

export const {
  setActiveStoriesSetOfHomeStories,
  resetActiveStoriesSetOfHomeStories,
  setActiveStoryOfHomeStories,
  resetActiveStoryOfHomeStories,
  setActiveStoryNoOfHomeStories,
  setInactiveStoriesSetOfHomeStories,
  setActiveIndexOfHomeStories,
  setStoriesOfHomeStories,
  setCreateStory,
  toggleIStoryCaptionModalOpen,
} = storySlice.actions;

export const selectActiveStoriesSetOfHomeStories = (
  state: RootState
): ActiveStoriesSetType => state.story.activeStoriesSetOfHomeStories;
export const selectActiveStoryOfHomeStories = (
  state: RootState
): ActiveStoryType => state.story.activeStoryOfHomeStories;
export const selectActiveStoryNoOfHomeStories = (state: RootState): number =>
  state.story.activeStoryNoOfHomeStories;
export const selectInactiveStoriesSetOfHomeStories = (
  state: RootState
): StoriesSetType[] => state.story.inactiveStoriesSetOfHomeStories;
export const selectActiveIndexOfHomeStories = (state: RootState): number =>
  state.story.activeIndexOfHomeStories;
export const selectStories = (state: RootState): StoriesSetType[] =>
  state.story.stories;
export const selectCreateStory = (state: RootState): createStoryType =>
  state.story.createStory;
export const selectIsStoryCaptionModalOpen = (state: RootState): boolean =>
  state.story.isStoryCaptionModalOpen;

export default storySlice.reducer;
