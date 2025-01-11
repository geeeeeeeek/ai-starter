

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