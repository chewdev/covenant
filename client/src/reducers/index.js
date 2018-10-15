import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import customerReducer from "./customerReducer";
import projectReducer from "./projectReducer";
import projectlocationReducer from "./projectlocationReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  customer: customerReducer,
  project: projectReducer,
  projectlocation: projectlocationReducer
});
