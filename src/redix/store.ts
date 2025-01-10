import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // 确保你已经创建了根 reducer

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;