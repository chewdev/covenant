import axios from "axios";
import {
  ADD_PROJECT,
  GET_ERRORS,
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_LOADING,
  DELETE_PROJECT,
  CLEAR_ERRORS,
  UPDATE_PROJECTS
} from "./types";

// Add Project
export const addProject = (projectData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/projects", projectData)
    .then(res =>
      dispatch({
        type: ADD_PROJECT,
        payload: res.data
      })
    )
    .then(() => history.push("/projects"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update Project
export const updateProject = (projectData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/projects/${projectData.id}`, projectData)
    .then(res => history.push(`/projects/${projectData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set project currentstatus to 'Completed'
export const setProjectCompleted = id => dispatch => {
  axios
    .put(`/api/projects/${id}/complete`)
    .then(res =>
      dispatch({
        type: UPDATE_PROJECTS,
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
export const getProjects = (getCompleted = "all") => dispatch => {
  dispatch(setProjectLoading(true));
  let queryStr = "";
  if (getCompleted === "complete") {
    queryStr = "/?completed=1";
  } else if (getCompleted === "notcomplete") {
    queryStr = "/?completed=0";
  }
  axios
    .get(`/api/projects${queryStr}`)
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .then(() => dispatch(setProjectLoading(false)))
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Get Project
export const getProject = id => dispatch => {
  dispatch(setProjectLoading(true));
  axios
    .get(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .then(() => dispatch(setProjectLoading(false)))
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};

// Get Customer Projects
export const getCustomerProjects = (id, resolve) => dispatch => {
  dispatch(setProjectLoading(true));
  axios
    .get(`/api/projects/customer/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .then(() => dispatch(setProjectLoading(false)))
    .then(() => resolve())
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Delete Project
export const deleteProject = (id, history) => dispatch => {
  axios
    .delete(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PROJECT,
        payload: id
      })
    )
    .then(() => history.push("/projects"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setProjectLoading = isLoading => {
  return {
    type: PROJECT_LOADING,
    payload: isLoading
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
