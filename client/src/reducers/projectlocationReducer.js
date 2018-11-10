import {
  ADD_PROJECTLOCATION,
  GET_PROJECTLOCATIONS,
  GET_PROJECTLOCATION,
  GET_PROJECTLOCATION_PROJECTS,
  PROJECTLOCATION_LOADING,
  PROJECTLOCATIONPROJECTS_LOADING,
  DELETE_PROJECTLOCATION
} from "../actions/types";

const initialState = {
  projectlocations: [],
  projectlocation: {},
  projectlocationprojects: [],
  loading: false,
  projectsloading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROJECTLOCATION_LOADING:
      return {
        ...state,
        loading: true
      };
    case PROJECTLOCATIONPROJECTS_LOADING:
      return {
        ...state,
        projectsloading: true
      };
    case GET_PROJECTLOCATIONS:
      return {
        ...state,
        projectlocations: action.payload,
        loading: false
      };
    case GET_PROJECTLOCATION:
      return {
        ...state,
        projectlocation: action.payload,
        loading: false
      };
    case GET_PROJECTLOCATION_PROJECTS:
      return {
        ...state,
        projectlocationprojects: action.payload,
        projectsloading: false
      };
    case ADD_PROJECTLOCATION:
      return {
        ...state,
        projectlocations: [action.payload, ...state.projectlocations]
      };
    case DELETE_PROJECTLOCATION:
      return {
        ...state,
        projectlocations: state.projectlocations.filter(
          projectlocation => projectlocation._id !== action.payload
        )
      };
    default:
      return state;
  }
}
