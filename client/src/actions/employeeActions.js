import axios from "axios";
import {
  ADD_EMPLOYEE,
  GET_ERRORS,
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  EMPLOYEE_LOADING,
  EMPLOYEES_LOADING,
  DELETE_EMPLOYEE,
  CLEAR_ERRORS
} from "./types";

// Add Employee
export const addEmployee = (employeeData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/employees", employeeData)
    .then(res =>
      dispatch({
        type: ADD_EMPLOYEE,
        payload: res.data
      })
    )
    .then(() => history.push("/employees"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update Employee
export const updateEmployee = (employeeData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/employees/${employeeData.id}`, employeeData)
    .then(res => history.push(`/employees/${employeeData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Employees
export const getEmployees = () => dispatch => {
  dispatch(setEmployeesLoading(true));
  axios
    .get("/api/employees")
    .then(res =>
      dispatch({
        type: GET_EMPLOYEES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EMPLOYEES,
        payload: null
      })
    );
};

// Get Employee
export const getEmployee = id => dispatch => {
  dispatch(setEmployeeLoading(true));
  axios
    .get(`/api/employees/${id}`)
    .then(res =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: null
      })
    );
};

// Delete Employee
export const deleteEmployee = (id, history) => dispatch => {
  axios
    .delete(`/api/employees/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_EMPLOYEE,
        payload: id
      })
    )
    .then(() => history.push("/employees"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setEmployeeLoading = isLoading => {
  return {
    type: EMPLOYEE_LOADING,
    payload: isLoading
  };
};

export const setEmployeesLoading = isLoading => {
  return {
    type: EMPLOYEES_LOADING,
    payload: isLoading
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
