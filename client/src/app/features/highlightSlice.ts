import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export const getSelfStories = createAsyncThunk(
  "highlight/get-self-stories",
  async ({ page, limit }: { page: number; limit?: number }) => {
    try {
      if (limit) {
        const response = await axios.get(
          `/story/get-self-stories?page=${page}&limit=${limit}`
        );
        return response.data;
      } else {
        const response = await axios.get(
          `/story/get-self-stories?page=${page}`
        );
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const createHighlight = createAsyncThunk(
  "highlight/create-highlight",
  async (data: { stories: string[]; caption: string; coverPic?: string }) => {
    try {
      const response = await axios.post("/highlights/create", data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
// Define a type for the slice state
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
export interface ActiveStoryType {
  coverPic: string;
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

export interface HighlightType {
  _id: string;
  stories: ActiveStoryType[];
  coverPic: string;
  caption: string;
  updatedAt: string;
  user: {
    _id: string;
    username: string;
  };
}

interface SelectedCreateStories {
  _id: string;
  selected: boolean;
}
interface HighlightState {
  activeStoriesSetOfHighlights: HighlightType;
  isStoryModalOpen: boolean;
  activeStoryOfHighlights: ActiveStoryType;
  activeStoryNoOfHighlights: number;
  activeIndex: number;
  inactiveStoriesSetOfHighlights: [];
  isCreateHighlight: boolean;
  isCreateHighlightNameModalOpen: boolean;
  isCreateHighlightSelectStoriesModalOpen: boolean;
  isCreateHighlightCoverPicModalOpen: boolean;
  createHighlightName: string;
  createHighlightStories: SelectedCreateStories[];
}

// Define the initial state using that type
const initialState: HighlightState = {
  activeStoriesSetOfHighlights: {
    _id: "",
    stories: [],
    coverPic: "",
    caption: "",
    updatedAt: "",
    user: {
      _id: "",
      username: "",
    },
  }, // Changed from null to an empty object
  isStoryModalOpen: false,
  activeStoryOfHighlights: {
    coverPic: "",
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
  activeStoryNoOfHighlights: 0,
  activeIndex: -1,
  inactiveStoriesSetOfHighlights: [],
  isCreateHighlight: false,
  isCreateHighlightNameModalOpen: false,
  isCreateHighlightSelectStoriesModalOpen: false,
  isCreateHighlightCoverPicModalOpen: false,
  createHighlightName: "",
  createHighlightStories: [],
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setActiveStoriesSetOfHighlights: (state, action) => {
      state.activeStoriesSetOfHighlights = action.payload;
    },
    resetActiveStoriesSetOfHighlights: (state) => {
      state.activeStoriesSetOfHighlights = {
        _id: "",
        stories: [],
        coverPic: "",
        caption: "",
        updatedAt: "",
        user: {
          _id: "",
          username: "",
        },
      };
    },
    setActiveStoryOfHighlights: (state, action) => {
      state.activeStoryOfHighlights = action.payload;
    },
    resetActiveStoryOfHighlights: (state) => {
      state.activeStoryOfHighlights = {
        coverPic: "",
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
    setActiveStoryNoOfHighlights: (state, action: PayloadAction<number>) => {
      state.activeStoryNoOfHighlights = action.payload;
    },
    setInactiveStoriesSetOfHighlights: (state, action) => {
      state.inactiveStoriesSetOfHighlights = action.payload;
    },
    setActiveIndexOfHighlights: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    toggleCreateHighlightModal: (state) => {
      state.isCreateHighlight = !state.isCreateHighlight;
    },
    toggleCreateHighlightNameModal: (state) => {
      state.isCreateHighlightNameModalOpen =
        !state.isCreateHighlightNameModalOpen;
    },
    toggleCreateHighlightStoriesModal: (state) => {
      state.isCreateHighlightSelectStoriesModalOpen =
        !state.isCreateHighlightSelectStoriesModalOpen;
    },
    toggleCreateHighlightCoverPicModal: (state) => {
      state.isCreateHighlightCoverPicModalOpen =
        !state.isCreateHighlightCoverPicModalOpen;
    },
    setCreateHighlightName: (state, action) => {
      state.createHighlightName = action.payload;
    },
    addToCreateHighlightStories: (state, action) => {
      if (state.createHighlightStories.length === 0) {
        state.createHighlightStories = [];
      }
      if (
        state.createHighlightStories.find(
          (item) => item._id === action.payload?._id
        )
      ) {
        state.createHighlightStories = state.createHighlightStories.map(
          (item) => {
            if (item._id === action.payload?._id) {
              return {
                ...item,
                selected: action.payload?.selected,
              };
            } else {
              return item;
            }
          }
        );
      } else {
        state.createHighlightStories.push(action.payload);
      }
    },
    resetCreateHighlightStories: (state) => {
      state.createHighlightStories = [];
    },
  },
});

export const {
  setActiveStoriesSetOfHighlights,
  resetActiveStoriesSetOfHighlights,
  setActiveStoryOfHighlights,
  resetActiveStoryOfHighlights,
  setActiveStoryNoOfHighlights,
  setInactiveStoriesSetOfHighlights,
  setActiveIndexOfHighlights,
  toggleCreateHighlightModal,
  toggleCreateHighlightNameModal,
  toggleCreateHighlightStoriesModal,
  toggleCreateHighlightCoverPicModal,
  setCreateHighlightName,
  addToCreateHighlightStories,
  resetCreateHighlightStories,
} = storySlice.actions;

export const selectActiveStoriesSetOfHighlights = (
  state: RootState
): HighlightType => state.highlight.activeStoriesSetOfHighlights;
export const selectActiveStoryOfHighlights = (
  state: RootState
): ActiveStoryType => state.highlight.activeStoryOfHighlights;
export const selectActiveStoryNoOfHighlights = (state: RootState): number =>
  state.highlight.activeStoryNoOfHighlights;
export const selectInactiveStoriesSetOfHighlights = (
  state: RootState
): StoryType[] => state.highlight.inactiveStoriesSetOfHighlights;
export const selectActiveIndexOfHighlights = (state: RootState): number =>
  state.highlight.activeIndex;
export const selectIsCreateHighlightOpen = (state: RootState): boolean =>
  state.highlight.isCreateHighlight;
export const selectIsCreateHighlightNameOpen = (state: RootState): boolean =>
  state.highlight.isCreateHighlightNameModalOpen;
export const selectIsCreateHighlightStoriesOpen = (state: RootState): boolean =>
  state.highlight.isCreateHighlightSelectStoriesModalOpen;
export const selectIsCreateHighlightCoverPicOpen = (
  state: RootState
): boolean => state.highlight.isCreateHighlightCoverPicModalOpen;
export const selectCreateHighlightName = (state: RootState): string =>
  state.highlight.createHighlightName;
export const selectCreateHighlightStories = (
  state: RootState
): SelectedCreateStories[] => state.highlight.createHighlightStories;

export default storySlice.reducer;
