import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer from './features/appSlice'; // Adjust the import path accordingly
import homeReducer from './features/homeSlice';
import postReducer from './features/viewPostSlice';
import createPostReducer from './features/createPostSlice';
import carouselReducer from './features/carouselSlice';
import storyReducer from './features/storySlice';
import messagesReducer from './features/messagesSlice';
import authReducer from './features/authSlice';
import accountReducer from './features/accountSlice';
import {persistReducer,persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import highlightReducer from './features/highlightSlice';
import notificationReducer from './features/notificationSlice';
// ...

const rootReducer=combineReducers({
  app: appReducer,
  home:homeReducer,
  post:postReducer,
  createPost:createPostReducer,
  story:storyReducer,
  carousel:carouselReducer,
  messages:messagesReducer,
  auth:authReducer,
  account:accountReducer,
  highlight:highlightReducer,
  notification:notificationReducer,
},)
const persistConfig={
  key:'root',
  storage,
  version:1
}
const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export const persistor=persistStore(store)
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch