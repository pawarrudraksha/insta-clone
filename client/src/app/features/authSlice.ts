import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface CreateUser{
  name:string,
  username:string,
  email:string,
  password:string,
  dob:string
}
interface SignupUser{
  name:string,
  username:string,
  password:string,
  dob:string
}



export const signup = createAsyncThunk(
  'auth/signup',
  async ({user,_id}:{user:SignupUser,_id:string}) => {
    try {
      const updatedUser={...user,_id}
      const response=await axios.post('/auth/register',updatedUser)
      return response.data
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendOtp=createAsyncThunk('auth/send-otp',
  async (email:string)=>{
    console.log(email)
    try {
      const response=await axios.post('/auth/send-otp',{email})
      return response.data
    } catch (error) {
      console.log(error);
    }
  }
)

export const verifyOtp=createAsyncThunk('auth/verify-otp',
  async ({email,receivedOtp}:{email:string;receivedOtp:string})=>{
    try {
      const response=await axios.post('/auth/verify-otp',{email,receivedOtp})
      return response.data
    } catch (error) {
      console.log(error);
    }
  }
)

export const login = createAsyncThunk<User, { usernameOrEmail: string; password: string }>(
  'auth/login',
  async ({ usernameOrEmail, password }, thunkAPI) => {
    try {
      const requestData = usernameOrEmail.includes('@')
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };
      const response = await axios.post<User>('/auth/login', requestData);
      return response.data;
    } catch (error) {
      console.error('Error logging in', error);
      throw error;
    }
  }
);
interface User {
  profilePic: string;
  username: string;
  name: string;
  _id: string;
  bio?: string;
  dob?: string;
  email?: string;
  isPrivate?: boolean;
  website?: string;
}


interface AuthState {
  isOtpFormOpen:boolean,
  isSignupFormOpen:boolean,
  isBirthdayFormOpen:boolean,
  createUser:CreateUser,
  currentUser: User,
  createUserOtp:string
}

const initialState: AuthState = {
  isOtpFormOpen:false,
  isSignupFormOpen:true,
  isBirthdayFormOpen:false,
  currentUser: {
    profilePic: '',
    username: '',
    name: '',
    _id: '',
  },
  createUser:{
    name:'',
    username:'',
    email:'',
    password:'',
    dob:''
  },
  createUserOtp:''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    resetCurrentUser: (state) => {
      state.currentUser = {
        profilePic: '',
        username: '',
        name: '',
        _id: '',
        bio: '',
        dob: '',
        email: '',
        isPrivate: true,
        website: '',
      };
    },
    setCreateUser:(state,action)=>{
      state.createUser=action.payload
    },
    setCreateUserOtp:(state,action)=>{
      state.createUserOtp=action.payload
    },
    toggleSignupForm:(state)=>{
      state.isSignupFormOpen=!state.isSignupFormOpen
    },
    toggleBirthdayForm:(state)=>{
      state.isBirthdayFormOpen=!state.isBirthdayFormOpen
    },
    toggleOtpForm:(state)=>{
      state.isOtpFormOpen=!state.isOtpFormOpen
    },

  },
});
export const selectCurrentUser = (state: RootState): User => state.auth.currentUser;
export const selectCreateUser = (state: RootState):CreateUser => state.auth.createUser;
export const selectCreateUserOtp = (state: RootState):string => state.auth.createUserOtp;
export const selectIsSignupFormOpen = (state: RootState): boolean => state.auth.isSignupFormOpen;
export const selectIsBirthdayFormOpen = (state: RootState): boolean => state.auth.isBirthdayFormOpen;
export const selectIsOtpFormOpen = (state: RootState): boolean => state.auth.isOtpFormOpen;
export const { setCurrentUser,resetCurrentUser ,setCreateUser,setCreateUserOtp,toggleSignupForm,toggleBirthdayForm,toggleOtpForm} = authSlice.actions;

export default authSlice.reducer;
