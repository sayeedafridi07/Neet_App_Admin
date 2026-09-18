import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import userReducer from "../slices/userSlice";
import courseReducer from "../slices/courseSlice";
import meetingReducer from "../slices/meetingSlice";
import programReducer from "../slices/ProgramSlice";
import dashboardReducer from "../slices/dashboardSlice";
import quizReducer from "../slices/quizSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  user: userReducer,
  course: courseReducer,
  meeting: meetingReducer,
  program: programReducer,
  dashboard: dashboardReducer,
  quiz: quizReducer,
});

export default rootReducer;
