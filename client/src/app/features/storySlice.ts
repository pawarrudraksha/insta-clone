import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface StoryObject {
  name: string;
  coverPic: string;
  id: number;
  username: string;
  stories: {
    story: string;
    type: string;
  }[]
}

interface StoryState {
  activeStoriesSet: StoryObject;
  isStoryModalOpen: boolean;
  activeStory:{
    story:string;
    type:string;
  };
  activeStoryNo:number;
  activeIndex:number;
  inactiveStoriesSet:StoryObject[];
}

// Define the initial state using that type
const initialState: StoryState = {
  activeStoriesSet: {
    name: '',
    coverPic: "",
    id: -1,
    username: '',
    stories: [],
  },
  isStoryModalOpen: false,
  activeStory:{
    story:'',
    type:''
  },
  activeStoryNo:0,
  activeIndex:-1,
  inactiveStoriesSet:[]
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setActiveStoriesSet: (state, action) => {
      state.activeStoriesSet = action.payload;
    },
    resetActiveStoriesSet: (state) => {
      state.activeStoriesSet = { // Resetting to an empty object with the same structure
        name: '',
        coverPic: '',
        id: -1,
        username: '',
        stories: [],
      };
    },
    setActiveStory:(state,action)=>{
      state.activeStory=action.payload
    },
    resetActiveStory:(state,action)=>{
      state.activeStory={
        story:'',
        type:''
      }
    },
    setActiveStoryNo:(state,action)=>{
      state.activeStoryNo=action.payload
    },
    setInactiveStoriesSet:(state,action)=>{
      state.inactiveStoriesSet=action.payload;
    },
    setActiveIndex:(state,action)=>{
      state.activeIndex=action.payload
    }
  },
});

export const { setActiveStoriesSet, resetActiveStoriesSet,setActiveStory ,resetActiveStory,setActiveStoryNo,setInactiveStoriesSet,setActiveIndex} = storySlice.actions;

export const selectActiveStoriesSet = (state: RootState): StoryObject => state.story.activeStoriesSet;
export const selectActiveStory = (state: RootState): {story:string,type:string} => state.story.activeStory;
export const selectActiveStoryNo = (state: RootState):number => state.story.activeStoryNo;
export const selectInactiveStoriesSet = (state: RootState):StoryObject[] => state.story.inactiveStoriesSet;
export const selectActiveIndex = (state: RootState):number => state.story.activeIndex;

export default storySlice.reducer;
