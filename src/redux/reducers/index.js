import { combineReducers } from "redux";
// import { routerReducer } from "react-router-redux/src";
import professionalReducer from "./professional";
import paymentReducer from "./payment";



export default combineReducers({
  // router: routerReducer,
  professionals: professionalReducer,
  payment: paymentReducer
})