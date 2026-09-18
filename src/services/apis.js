// AUTH ENDPOINTS
export const authEndpoints = {
  LOGIN_API: "/auth/admin/login",
  LOGOUT_API: "/auth/admin/logout",
};

export const studentEndpoints = {
  GET_STUDENTS_API: "/users",
  CREATE_STUDENT_API: "/users",
  UPDATE_STUDENT_API: "/users",
  UPDATE_STUDENT_STATUS_API: "/users",
  DELETE_STUDENT_API: "/users",
};

export const adminEndpoints = {
  GET_ADMINS_API: "/admins",
  CREATE_ADMIN_API: "/admins",
  UPDATE_ADMIN_API: "/admins",
  UPDATE_ADMIN_STATUS_API: "/admins",
  DELETE_ADMIN_API: "/admins",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: "/auth/me",
};

// DASHBOARD ENDPOINTS
export const dashboardEndpoints = {
  GET_DASHBOARD_DATA_API: "/dashboard",
};

// USER ENDPOINTS
export const userEndpoints = {
  CREATE_USER_API: "/users",
  GET_ALL_USERS_API: "/users",
  UPDATE_USER_API: "/users",
  UPDATE_USER_STATUS_API: "/users",
  RESET_DEVICE_API: "/users",
  DELETE_USER_API: "/users",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  CREATE_COURSE_API: "/courses",
  GET_ALL_COURSES_API: "/courses",
  UPDATE_COURSE_API: "/courses",
  UPDATE_COURSE_STATUS_API: "/courses",
  DELETE_COURSE_API: "/courses",
};

// MEETING ENDPOINTS
export const meetingEndpoints = {
  CREATE_MEETING_API: "/meetings",
  GET_ALL_MEETINGS_API: "/meetings",
  UPDATE_MEETING_API: "/meetings",
  UPDATE_MEETING_STATUS_API: "/meetings",
  DELETE_MEETING_API: "/meetings",
};

// QUIZ ENDPOINTS
export const quizEndpoints = {
  CREATE_QUIZ_API: "/quizzes",
  GET_QUIZ_API: "/quizzes",
  GET_QUIZ_BY_COURSE_ID_API: "/quizzes/course",
  UPDATE_QUIZ_API: "/quizzes",
  UPDATE_QUIZ_STATUS_API: "/quizzes",
  DELETE_QUIZ_API: "/quizzes",

  GET_QUESTIONS_API: "/questions",
  CREATE_QUESTION_API: "/questions",
  UPDATE_QUESTION_API: "/questions",
  DELETE_QUESTION_API: "/questions",
  BULK_DELETE_QUESTION_API: "/questions/bulk-delete",
  UPLOAD_QUESTION_API: "/questions/bulk",
};

// RESULT ENDPOINTS
export const resultEndpoints = {
  CREATE_RESULT_API: "/results",
  GET_RESULT_API: "/results",
  UPDATE_RESULT_API: "/results",
  UPDATE_RESULT_STATUS_API: "/results",
  DELETE_RESULT_API: "/results",
};

// REPORT ENDPOINTS
export const reportEndpoints = {
  CREATE_REPORT_API: "/reports",
  GET_REPORTS_API: "/reports",
  UPDATE_REPORT_API: "/reports",
  UPDATE_REPORT_STATUS_API: "/reports",
  DELETE_REPORT_API: "/reports",
};

// PROGRAM ENDPOINTS
export const programEndpoints = {
  CREATE_PROGRAM_API: "/programs",
  GET_ALL_PROGRAMS_API: "/programs",
  UPDATE_PROGRAM_API: "/programs",
  UPDATE_PROGRAM_STATUS_API: "/programs",
  DELETE_PROGRAM_API: "/programs",
};
