import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers"
import fetchMiddleware from "./middleware/fetchMiddleware"

const composedEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default initialState => {
  return createStore(rootReducer, initialState, composedEnhancers(applyMiddleware(thunk, fetchMiddleware)))
}