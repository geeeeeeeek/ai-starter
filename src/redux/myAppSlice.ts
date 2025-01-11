import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定义状态类型
interface myAppState {
  uri: string;
  isPlaying: boolean;
  index: number;
  coverImage: string;
  title: string;
  artist: string;
  model: string;
}

// 初始状态
const initialState: myAppState = {
  uri: "/audio/chin-tapak-dum-dum.mp3",
  isPlaying: true,
  index: 0,
  coverImage: "",
  title: "",
  artist: "",
  model: "deepseek-chat",
};

// 创建 Slice
const myAppSlice = createSlice({
  name: "myApp",
  initialState,
  reducers: {
    // 设置 URI
    setUri: (state, action: PayloadAction<string>) => {
      state.uri = action.payload;
    },
    // 设置播放状态
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    // 设置当前索引
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    // 设置整个app状态
    setmyApp: (state, action: PayloadAction<Partial<myAppState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// 导出 actions
export const { setUri, setIsPlaying, setIndex, setmyApp } =
  myAppSlice.actions;

// 导出 reducer
export default myAppSlice.reducer;