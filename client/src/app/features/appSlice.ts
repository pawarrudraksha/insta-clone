import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

export interface UserType{
  _id:string;
  name:string;
  username:string;
  profilePic:string;
  isPrivate:boolean;
  bio?:string;
  website?:string;
  noOfPosts?:number;
  noOfFollowers?:number;
  noOfFollowing?:number;
}
// Define a type for the slice state
interface AppState {
  isSearchModalOpen: boolean;
  isProfileModalOpen: boolean
  isMoreModalOpen:boolean;
  isNotificationModalOpen:boolean;
  isNotificationRequestsModalOpen:boolean;
  profileModalData:UserType;
  sidebarActiveTab:string
}

interface SearchUsersArgs {
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Define the initial state using that type
const initialState: AppState = {
  isSearchModalOpen: false,
  isProfileModalOpen:false,
  isMoreModalOpen:false,
  isNotificationModalOpen:false,
  isNotificationRequestsModalOpen:false,
  profileModalData:{
    _id:'',
    name:'',
    username:'',
    profilePic:'',
    isPrivate:true
  },
  sidebarActiveTab:""
};
export const searchUsers=createAsyncThunk('app/searchUsers',
  async({searchQuery,page,limit}:SearchUsersArgs)=>{
    const response = await axios.get(`/users/search?searchTerm=${searchQuery}&page=${page}&limit=${limit}`);
    return response.data
})


export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSearchModal:(state)=>{
      state.isSearchModalOpen= !state.isSearchModalOpen
    },
    toggleMoreModal:(state)=>{
      state.isMoreModalOpen= !state.isMoreModalOpen
    },
    toggleNotificationModal:(state)=>{
      state.isNotificationModalOpen= !state.isNotificationModalOpen
    },
    toggleNotificationRequestsModal:(state)=>{
      state.isNotificationRequestsModalOpen= !state.isNotificationRequestsModalOpen
    },
    openProfileModal:(state)=>{
      state.isProfileModalOpen= true
    },
    closeProfileModal:(state)=>{
      state.isProfileModalOpen= false
    },
    setProfileModalData:(state,action)=>{
      state.profileModalData=action.payload
    },
    setSidebarActiveTab:(state,action)=>{
      state.sidebarActiveTab=action.payload
    }
}});

export const { toggleSearchModal ,openProfileModal,closeProfileModal,toggleMoreModal,toggleNotificationModal,toggleNotificationRequestsModal,setProfileModalData,setSidebarActiveTab} = appSlice.actions; 

// Other code such as selectors can use the imported `RootState` type
export const selectIsSearchModalOpen = (state: RootState): boolean =>state.app.isSearchModalOpen;
export const selectIsProfileModalOpen = (state: RootState): boolean =>state.app.isProfileModalOpen;
export const selectIsMoreModalOpen = (state: RootState): boolean =>state.app.isMoreModalOpen;
export const selectIsNotificationModalOpen = (state: RootState): boolean =>state.app.isNotificationModalOpen;
export const selectIsNotificationRequestsModalOpen = (state: RootState): boolean =>state.app.isNotificationRequestsModalOpen;
export const selectProfileModalData = (state: RootState): UserType =>state.app.profileModalData;
export const selectSidebarActiveTab = (state: RootState): string =>state.app.sidebarActiveTab;

export default appSlice.reducer;
