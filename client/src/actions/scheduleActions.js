import axios from "axios";
import {
  ADD_SCHEDULE,
  GET_ERRORS,
  GET_SCHEDULES,
  GET_SCHEDULE,
  SCHEDULE_LOADING,
  SCHEDULES_LOADING,
  DELETE_SCHEDULE,
  CLEAR_ERRORS
} from "./types";

// Add Schedule
export const addSchedule = (scheduleData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/schedule", scheduleData)
    .then(res =>
      dispatch({
        type: ADD_SCHEDULE,
        payload: res.data
      })
    )
    .then(() => history.push("/schedule"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update Schedule
export const updateSchedule = (scheduleData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/schedule/${scheduleData.id}`, scheduleData)
    .then(res => history.push(`/schedule/${scheduleData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set Schedule Status to Complete
export const setScheduleComplete = id => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/schedule/${id}/complete`)
    .then(res =>
      dispatch({
        type: GET_SCHEDULE,
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

// Check in for Schedule
export const checkInSchedule = (
  id,
  currentlocation,
  resolve,
  reject
) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/schedule/${id}/checkin`, { currentlocation })
    .then(res =>
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data
      })
    )
    .then(() => {
      resolve();
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      reject();
    });
};

// Check out of Schedule
export const checkOutSchedule = (
  id,
  currentlocation,
  resolve,
  reject
) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/schedule/${id}/checkout`, { currentlocation })
    .then(res =>
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data
      })
    )
    .then(() => resolve())
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      return reject();
    });
};

// Get Schedule
export const getSchedules = () => dispatch => {
  dispatch(setSchedulesLoading(true));
  axios
    .get("/api/schedule")
    .then(res =>
      dispatch({
        type: GET_SCHEDULES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SCHEDULES,
        payload: null
      })
    );
};

// Get Schedule Item
export const getSchedule = id => dispatch => {
  dispatch(setScheduleLoading(true));
  axios
    .get(`/api/schedule/${id}`)
    .then(res =>
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SCHEDULE,
        payload: null
      })
    );
};

// Delete Schedule Item
export const deleteSchedule = (id, history) => dispatch => {
  axios
    .delete(`/api/schedule/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_SCHEDULE,
        payload: id
      })
    )
    .then(() => history.push("/schedule"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set schedule loading state
export const setScheduleLoading = isLoading => {
  return {
    type: SCHEDULE_LOADING,
    payload: isLoading
  };
};

// Set schedules loading state
export const setSchedulesLoading = isLoading => {
  return {
    type: SCHEDULES_LOADING,
    payload: isLoading
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
