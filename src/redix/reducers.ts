import { combineReducers } from 'redux';
import exampleReducer from './exampleReducer'; // 引入你的具体 reducer

const rootReducer = combineReducers({
  example: exampleReducer,
});

export default rootReducer;