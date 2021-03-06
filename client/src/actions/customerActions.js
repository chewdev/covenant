import axios from "axios";
import {
  ADD_CUSTOMER,
  GET_ERRORS,
  GET_CUSTOMERS,
  GET_CUSTOMER,
  CUSTOMER_LOADING,
  CUSTOMERS_LOADING,
  DELETE_CUSTOMER,
  CLEAR_ERRORS
} from "./types";

// Add Customer
export const addCustomer = (customerData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/customers", customerData)
    .then(res =>
      dispatch({
        type: ADD_CUSTOMER,
        payload: res.data
      })
    )
    .then(() => history.push("/customers"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update Customer
export const updateCustomer = (customerData, history) => dispatch => {
  dispatch(clearErrors());

  axios
    .put(`/api/customers/${customerData.id}`, customerData)
    .then(res => history.push(`/customers/${customerData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Customers
export const getCustomers = () => dispatch => {
  dispatch(setCustomersLoading(true));
  axios
    .get("/api/customers")
    .then(res =>
      dispatch({
        type: GET_CUSTOMERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CUSTOMERS,
        payload: null
      })
    );
};

// Get Customer
export const getCustomer = id => dispatch => {
  dispatch(setCustomerLoading(true));
  axios
    .get(`/api/customers/${id}`)
    .then(res =>
      dispatch({
        type: GET_CUSTOMER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CUSTOMER,
        payload: null
      })
    );
};

// Delete Customer
export const deleteCustomer = (id, history) => dispatch => {
  axios
    .delete(`/api/customers/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_CUSTOMER,
        payload: id
      })
    )
    .then(() => history.push("/customers"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setCustomerLoading = isLoading => {
  return {
    type: CUSTOMER_LOADING,
    payload: isLoading
  };
};

export const setCustomersLoading = isLoading => {
  return {
    type: CUSTOMERS_LOADING,
    payload: isLoading
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
