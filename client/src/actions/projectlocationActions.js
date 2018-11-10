import axios from "axios";
import {
  ADD_PROJECTLOCATION,
  GET_ERRORS,
  GET_PROJECTLOCATIONS,
  GET_PROJECTLOCATION,
  GET_PROJECTLOCATION_PROJECTS,
  PROJECTLOCATION_LOADING,
  PROJECTLOCATIONPROJECTS_LOADING,
  DELETE_PROJECTLOCATION,
  CLEAR_ERRORS
} from "./types";

// Add Project Location
export const addProjectLocation = (
  projectLocationData,
  history
) => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/projectlocations", projectLocationData)
    .then(res =>
      dispatch({
        type: ADD_PROJECTLOCATION,
        payload: res.data
      })
    )
    .then(() => history.push("/projectlocations"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Project Locations
export const getProjectLocations = () => dispatch => {
  dispatch(setProjectLocationLoading());
  axios
    .get("/api/projectlocations")
    .then(res =>
      dispatch({
        type: GET_PROJECTLOCATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTLOCATIONS,
        payload: null
      })
    );
};

// Get Project Location
export const getProjectLocation = id => dispatch => {
  dispatch(setProjectLocationLoading());
  axios
    .get(`/api/projectlocations/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECTLOCATION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTLOCATION,
        payload: null
      })
    );
};

// Update Project Location
export const updateProjectLocation = (
  projectLocationData,
  history
) => dispatch => {
  dispatch(clearErrors());
  axios
    .put(`/api/projectlocations/${projectLocationData.id}`, projectLocationData)
    .then(res => history.push(`/projectlocations/${projectLocationData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Project Location Projects
export const getProjectLocationProjects = (id, resolve) => dispatch => {
  dispatch(setProjectLocationProjectsLoading());
  axios
    .get(`/api/projectlocations/${id}/projects`)
    .then(res =>
      dispatch({
        type: GET_PROJECTLOCATION_PROJECTS,
        payload: res.data
      })
    )
    .then(() => resolve())
    .catch(err =>
      dispatch({
        type: GET_PROJECTLOCATION_PROJECTS,
        payload: null
      })
    );
};

// Delete Project Location
export const deleteProjectLocation = id => dispatch => {
  axios
    .delete(`/api/projectlocations/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PROJECTLOCATION,
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
export const setProjectLocationLoading = () => {
  return {
    type: PROJECTLOCATION_LOADING
  };
};

export const setProjectLocationProjectsLoading = () => {
  return {
    type: PROJECTLOCATIONPROJECTS_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
