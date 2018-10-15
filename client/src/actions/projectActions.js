import axios from "axios";
import {
  ADD_PROJECT,
  GET_ERRORS,
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_LOADING,
  DELETE_PROJECT,
  CLEAR_ERRORS
} from "./types";

// Add Project
export const addProject = projectData => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/projects", projectData)
    .then(res =>
      dispatch({
        type: ADD_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Projects
export const getProjects = () => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get("/api/projects")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Get Project
export const getProject = id => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};

// Delete Project
export const deleteProject = id => dispatch => {
  axios
    .delete(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PROJECT,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
