import {
  ADD_CUSTOMER,
  GET_CUSTOMERS,
  GET_CUSTOMER,
  CUSTOMER_LOADING,
  CUSTOMERS_LOADING,
  DELETE_CUSTOMER
} from "../actions/types";

const initialState = {
  customers: [],
  customer: {},
  customerloading: true,
  customersloading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CUSTOMER_LOADING:
      return {
        ...state,
        customerloading: action.payload
      };
    case CUSTOMERS_LOADING:
      return {
        ...state,
        customersloading: action.payload
      };
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
        customersloading: false
      };
    case GET_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
        customerloading: false
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [action.payload, ...state.customers]
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          customer => customer._id !== action.payload
        )
      };
    default:
      return state;
  }
}
