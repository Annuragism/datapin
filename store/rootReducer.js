import { combineReducers } from "@reduxjs/toolkit"
import analysisReducer from "../reducers/analysisReducer"

const appReducer = combineReducers({
  analysis:analysisReducer
})
const  rootReducer = (state, action)=>{
if(action.type==='LOG_OUT'){
  //Code here
}
return appReducer(state, action)
}

export default rootReducer