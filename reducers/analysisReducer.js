import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
    allAnalysis:[],
    selectedAnalysis:''
  
};
const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {

    addAnalysis: (state, action) => {
      state.allAnalysis = action.payload;
    },
    addSelectedAnalysis: (state, action) => {
      console.log(action)
      state.selectedAnalysis = action.payload;
    },
    removeSelectedAnalysis: (state, action) => {
      state.selectedAnalysis = '';
    },
    removeAnalysis: (state, payload) => {
      const filterAnalysis = state.allAnalysis?.filter((val) => val.id !== payload.id);
      state.allAnalysis = filterAnalysis;
    },
    removeAllAnalysis: (state,action) => {
      state.allAnalysis = {...state.analysis,allAnlaysis: []};
    },
  },
});

const { actions, reducer } = analysisSlice;

export const {
  addAnalysis,
  removeAnalysis,
  removeAllAnalysis,
  addSelectedAnalysis,
  removeSelectedAnalysis,
} = actions;
export default reducer;
