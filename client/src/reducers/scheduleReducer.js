import {
  ADD_SCHEDULE,
  GET_SCHEDULES,
  GET_SCHEDULE,
  SCHEDULE_LOADING,
  DELETE_SCHEDULE
} from "../actions/types";

const initialState = {
  schedules: [],
  schedule: {},
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SCHEDULE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case GET_SCHEDULES:
      return {
        ...state,
        schedules: action.payload,
        loading: false
      };
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        loading: false
      };
    case ADD_SCHEDULE:
      return {
        ...state,
        schedules: [action.payload, ...state.schedules]
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(
          schedule => schedule._id !== action.payload
        )
      };
    default:
      return state;
  }
}
