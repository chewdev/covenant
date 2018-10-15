import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

const initialState = {};

const middleware = [thunk];

const store =
  process.env.NODE_ENV !== "production"
    ? createStore(
        rootReducer,
        initialState,
        compose(
          applyMiddleware(...middleware),
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )
      )
    : createStore(rootReducer, initialState, applyMiddleware(...middleware));

export default store;
