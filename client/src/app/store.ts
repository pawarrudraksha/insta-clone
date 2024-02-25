import { configureStore } from '@reduxjs/toolkit'
import appReducer from './features/appSlice'; // Adjust the import path accordingly
import homeReducer from './features/homeSlice';
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    home:homeReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch