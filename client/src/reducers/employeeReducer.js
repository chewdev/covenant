import {
  ADD_EMPLOYEE,
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  EMPLOYEE_LOADING,
  DELETE_EMPLOYEE
} from "../actions/types";

const initialState = {
  employees: [],
  employee: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EMPLOYEE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case GET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
        loading: false
      };
    case GET_EMPLOYEE:
      return {
        ...state,
        employee: action.payload,
        loading: false
      };
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [action.payload, ...state.employees]
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(
          employee => employee._id !== action.payload
        )
      };
    default:
      return state;
  }
}
