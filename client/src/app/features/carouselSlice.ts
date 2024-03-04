import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface CarouselData{
  post:string;
  type:string;
}
interface CarouselState {
  carouselData:CarouselData[];
  createPostCarouselActiveIndex:number;
  carouselActiveType:string;
  videoFrames:string[]
}

// Define the initial state using that type
const initialState: CarouselState = {
  carouselData:[{
    type:"image",
    post:"https://firebasestorage.googleapis.com/v0/b/letschat-mern-6572c.appspot.com/o/john%20doe?alt=media&token=21d2dfa2-ef05-4438-8341-153840520aa5"
  },
  {
      type:"image",
      post:"https://firebasestorage.googleapis.com/v0/b/letschat-mern-6572c.appspot.com/o/jane%20dow?alt=media&token=d7ad4d99-3a4e-40ba-84c4-00c92086eb43"
  },
  {
      type:"video",
      post: "https://firebasestorage.googleapis.com/v0/b/letschat-mern-6572c.appspot.com/o/React%20Stepper%20component%20-%20Material%20UI%20-%20Google%20Chrome%202023-11-01%2009-29-29.mp4?alt=media&token=80066298-a4d7-4b52-aaad-d27a8780073c"
  }
],
  createPostCarouselActiveIndex:0,// for create post
  carouselActiveType:'',
  videoFrames:[]
};

export const appSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    setCarouselData:(state,action)=>{
      state.carouselData=[...state.carouselData,action.payload]
    },
    resetCarouselData:(state)=>{
      state.carouselData=[]
    },
    setCreatePostCarouseActiveIndex:(state,action)=>{
      state.createPostCarouselActiveIndex=action.payload
    },
    setCarouselActiveType:(state,action)=>{
      state.carouselActiveType=action.payload
    },
    setVideoFrames:(state,action)=>{
      state.videoFrames=[state.videoFrames,...action.payload]
    },
  },
});

export const {setCarouselData,resetCarouselData,setCreatePostCarouseActiveIndex,setCarouselActiveType,setVideoFrames} = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectCarouselData = (state: RootState): CarouselData[] =>state.carousel.carouselData;
export const selectCarouselActiveIndex= (state: RootState): number =>state.carousel.createPostCarouselActiveIndex;
export const selectCarouselActiveType= (state: RootState): string =>state.carousel.carouselActiveType;
export const selectVideoFrames= (state: RootState): string[] =>state.carousel.videoFrames;

export default appSlice.reducer;
