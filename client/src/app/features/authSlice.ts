import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

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
  currentUser: User;
}

const initialState: AuthState = {
  currentUser: {
    profilePic: '',
    username: '',
    name: '',
    _id: '',
  },
};

export const signup = createAsyncThunk<void, any>(
  'auth/signup',
  async (user, thunkAPI) => {
    console.log(user);
  }
);

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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
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
  },
});

export const selectCurrentUser = (state: RootState): User => state.auth.currentUser;
export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
