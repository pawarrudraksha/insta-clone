import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

export interface StoryType{
    coverPic: string;
    _id: string;
    caption: string;
    firstStory: {
      _id: string;
      content:{
        type:string,
        url:string
      };
      updatedAt: string;
      caption:{
        text:string;
        color:string;
        position:{
          top:string,
          left:string
        }
      }
    };
    username: string;
  }
  
interface AccountState {
    highlights:StoryType[]
}

interface AccountArgs{
    username:string;
    page:number;
    limit?:number;
    filterPost?:string;
}
// Define the initial state using that type
const initialState: AccountState = {
  highlights:[]
};
export const getUserInfo=createAsyncThunk('account/getUserInfo',async(username:string)=>{
  try {
    const response=await axios.get(`/users/get-user-info/${username}`)
    return response.data
  } catch (error) {
    console.log(error);
  }
})

export const getUserPostsWhenLoggedIn=createAsyncThunk('account/getUserPostsLoggedIn',
    async({username,page,limit,filterPost}:AccountArgs)=>{
    try {
        const rlimit=limit || 6
        let response;
        if(filterPost){
            response=await axios.get(`/posts/get-posts-private-user/${username}?limit=${rlimit}&page=${page}&filterPost=${filterPost}`)
        }else{
            response=await axios.get(`/posts/get-posts-private-user/${username}?limit=${rlimit}&page=${page}`)
        }
        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const getUserPostsWhenNotLoggedIn=createAsyncThunk('account/getUserPosts',
    async({username,page,filterPost,limit}:AccountArgs)=>{
    try {
        const rlimit=limit || 6
        let response;
        if(filterPost){
            response=await axios.get(`/posts/get-posts/${username}?limit=${rlimit}&page=${page}&filterPost=${filterPost}`)
        }else{
            response=await axios.get(`/posts/get-posts/${username}?limit=${rlimit}&page=${page}`)
        }
        return response.data
    } catch (error) {
        console.log(error);
    }
})
export const getUserReelsWhenLoggedIn=createAsyncThunk('account/getUserReelsLoggedIn',
    async({username,page}:AccountArgs)=>{
    try {
        const response=await axios.get(`/posts//get-private-user-reels/${username}?limit=6&page=${page}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const getUserReelsWhenNotLoggedIn=createAsyncThunk('account/getUserReelsLoggedIn',
    async({username,page}:AccountArgs)=>{
    try {
        const response=await axios.get(`/posts/get-public-user-reels/${username}?limit=6&page=${page}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const getUserTaggedPosts=createAsyncThunk('account/tagged',
    async({username,page}:AccountArgs)=>{
    try {
        const response=await axios.get(`/posts/get-tagged-posts/${username}?limit=6&page=${page}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const getUserHighlightsWhenNotLoggedIn=createAsyncThunk('account/highlights',
    async({username,page}:AccountArgs)=>{
        try {
            const response=await axios.get(`/highlights/public/get-highlights/${username}?page=${page}&limit=9`)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
)
export const getUserHighlightsWhenLoggedIn=createAsyncThunk('account/highlights',
    async({username,page}:AccountArgs)=>{
        try {
            const response=await axios.get(`/highlights/private/get-highlights/${username}?page=${page}&limit=9`)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
)

export const getHighlightById=createAsyncThunk('account/highlight-by-id',
    async(highlightId:string)=>{
        try {
            const response=await axios.get(`/highlights/get/${highlightId}`)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setHighlights:(state,action)=>{
      state.highlights= action.payload
    },
}});

export const { setHighlights} = accountSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectHighlights = (state: RootState): StoryType[] =>state.account.highlights;

export default accountSlice.reducer;
