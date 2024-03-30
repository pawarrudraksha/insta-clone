import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface CarouselState {
  createPostCarouselActiveIndex:number;
  carouselActiveType:string;
  videoFrames:string[]
}

// Define the initial state using that type
const initialState: CarouselState = {
  createPostCarouselActiveIndex:0,// for create post
  carouselActiveType:'',
  videoFrames:[]
};

export const appSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
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

export const {setCreatePostCarouseActiveIndex,setCarouselActiveType,setVideoFrames} = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectCarouselActiveIndex= (state: RootState): number =>state.carousel.createPostCarouselActiveIndex;
export const selectCarouselActiveType= (state: RootState): string =>state.carousel.carouselActiveType;
export const selectVideoFrames= (state: RootState): string[] =>state.carousel.videoFrames;

export default appSlice.reducer;
