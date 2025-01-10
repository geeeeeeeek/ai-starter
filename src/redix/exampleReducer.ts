interface ExampleState {
    value: number;
  }
  
  const initialState: ExampleState = {
    value: 0,
  };
  
  const exampleReducer = (state = initialState, action: { type: string, payload?: number  }) => {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, value: state.value + (action.payload || 0) }; // 使用参数
      case 'DECREMENT':
        return { ...state, value: state.value - 1 };
      default:
        return state;
    }
  };
  
  export default exampleReducer;