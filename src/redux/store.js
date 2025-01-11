import { configureStore } from "@reduxjs/toolkit";
import myAppReducer from "./myAppSlice";

const store = configureStore({
  reducer: {
    myApp: myAppReducer,
  },
});

export default store;
