import {
  ADD_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_LOADING,
  DELETE_PROJECT,
  UPDATE_PROJECTS
} from "../actions/types";

const initialState = {
  projects: [],
  project: {},
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROJECT_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      };
    case UPDATE_PROJECTS:
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload._id) {
            return action.payload;
          } else {
            return project;
          }
        })
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payload
        )
      };
    default:
      return state;
  }
}
