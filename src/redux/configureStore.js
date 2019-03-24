import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers"
import fetchMiddleware from "./middleware/fetchMiddleware"

const composedEnhancers = compose(applyMiddleware(thunk, fetchMiddleware));

export default initialState => {
  return createStore(rootReducer, initialState, composedEnhancers)
}