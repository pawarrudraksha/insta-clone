import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

// Define a type for the slice state
export interface StoryType {
  coverPic: string;
  _id: string;
  caption: string;
  firstStory: {
    _id: string;
    content: {
      type: string,
      url: string,
    };
    updatedAt: string;
    caption: {
      text: string;
      color: string;
      position: {
        top: string,
        left: string
      };
    };
  };
  username: string;
}
export interface ActiveStoryType {
  coverPic: string;
  _id: string;
  content: {
    type: string,
    url: string
  };
  updatedAt: string;
  caption: {
    text: string,
    color: string,
    position: {
      top: string,
      left: string
    };
  };
};


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

interface HighlightState {
  activeStoriesSetOfHighlights:HighlightType,
  isStoryModalOpen: boolean;
  activeStoryOfHighlights: ActiveStoryType;
  activeStoryNoOfHighlights: number;
  activeIndex: number;
  inactiveStoriesSetOfHighlights: [];
}



// Define the initial state using that type
const initialState: HighlightState = {
  activeStoriesSetOfHighlights: {
    _id: '',
    stories: [],
    coverPic: '',
    caption: '',
    updatedAt: '',
    user: {
      _id: '',
      username: ''
    }
  } , // Changed from null to an empty object
  isStoryModalOpen: false,
  activeStoryOfHighlights: {
    coverPic:'',
    _id:'',
    updatedAt:'',
    content:{
      type:'',
      url:''
    },
    caption:{
      text:'',
      position:{
        top:'',
        left:''
      },
      color:'',
    }
  },
  activeStoryNoOfHighlights: 0,
  activeIndex: -1,
  inactiveStoriesSetOfHighlights: [],
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setActiveStoriesSetOfHighlights: (state, action) => {
      state.activeStoriesSetOfHighlights = action.payload;
    },
    resetActiveStoriesSetOfHighlights: (state) => {
      state.activeStoriesSetOfHighlights = {
        _id: '',
        stories: [],
        coverPic: '',
        caption: '',
        updatedAt: '',
        user: {
          _id: '',
          username: ''
        }
      };
    },
    setActiveStoryOfHighlights: (state, action) => {
      state.activeStoryOfHighlights = action.payload;
    },
    resetActiveStoryOfHighlights: (state) => {
      state.activeStoryOfHighlights = {
        coverPic:'',
        _id:'',
        updatedAt:'',
        content:{
          type:'',
          url:''
        },
        caption:{
          text:'',
          position:{
            top:'',
            left:''
          },
          color:'',
        }
      }
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
} = storySlice.actions;

export const selectActiveStoriesSetOfHighlights = (state: RootState): HighlightType => state.highlight.activeStoriesSetOfHighlights;
export const selectActiveStoryOfHighlights = (state: RootState): ActiveStoryType => state.highlight.activeStoryOfHighlights;
export const selectActiveStoryNoOfHighlights = (state: RootState): number => state.highlight.activeStoryNoOfHighlights;
export const selectInactiveStoriesSetOfHighlights = (state: RootState): StoryType[] => state.highlight.inactiveStoriesSetOfHighlights;
export const selectActiveIndexOfHighlights = (state: RootState): number => state.highlight.activeIndex;


export default storySlice.reducer;
