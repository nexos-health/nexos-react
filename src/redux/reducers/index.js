import { combineReducers } from "redux";
// import { routerReducer } from "react-router-redux/src";
import professionalReducer from "./professional";



export default combineReducers({
  // router: routerReducer,
  professionals: professionalReducer
})