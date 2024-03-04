import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface PostState {
  isPostModalOpen:boolean,
  post:any
}

// Define the initial state using that type
const initialState: PostState = {
    isPostModalOpen:false,
    post:{}
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    openPostModal:(state)=>{
      state.isPostModalOpen=true
    },
    closePostModal:(state)=>{
      state.isPostModalOpen=false
    },
    setPost:(state,action)=>{
        state.post=action.payload
    }
  },
});

export const {openPostModal,closePostModal,setPost} = postSlice.actions; 

export const selectIsPostModalOpen= (state: RootState): boolean =>state.post.isPostModalOpen;
export const selectPost=(state: RootState): any =>state.post.post;

export default postSlice.reducer;
