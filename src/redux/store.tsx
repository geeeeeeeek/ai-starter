

import { configureStore } from "@reduxjs/toolkit";
import myAppReducer from "./myAppSlice";

// Create the store with the reducer
const store = configureStore({
  reducer: {
    myApp: myAppReducer,
  },
});


// Export the store
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch