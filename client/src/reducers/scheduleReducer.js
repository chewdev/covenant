import {
  ADD_SCHEDULE,
  GET_SCHEDULES,
  GET_SCHEDULE,
  SCHEDULE_LOADING,
  SCHEDULES_LOADING,
  DELETE_SCHEDULE
} from "../actions/types";

const initialState = {
  schedules: [],
  schedule: {},
  scheduleloading: true,
  schedulesloading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SCHEDULE_LOADING:
      return {
        ...state,
        scheduleloading: action.payload
      };
    case SCHEDULES_LOADING:
      return {
        ...state,
        schedulesloading: action.payload
      };
    case GET_SCHEDULES:
      return {
        ...state,
        schedules: action.payload,
        schedulesloading: false
      };
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        scheduleloading: false
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
