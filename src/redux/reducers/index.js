import { combineReducers } from "redux";
// import { routerReducer } from "react-router-redux/src";
import professionalReducer from "./professional";
import accountReducer from "./account";



export default combineReducers({
  // router: routerReducer,
  professionals: professionalReducer,
  account: accountReducer
})