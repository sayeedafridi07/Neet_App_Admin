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

export const subjectEndpoints = {
  GET_SUBJECTS_API: "/subjects",
  CREATE_SUBJECT_API: "/subjects",
  UPDATE_SUBJECT_API: "/subjects",
  UPDATE_SUBJECT_STATUS_API: "/subjects",
  DELETE_SUBJECT_API: "/subjects",
};

// Classes are listed under a subject: /subjects/:subjectId/classes
export const classEndpoints = {
  GET_CLASSES_API: "/classes",
  CREATE_CLASS_API: "/classes",
  UPDATE_CLASS_API: "/classes",
  DELETE_CLASS_API: "/classes",
};

// Chapters are listed/created under a class: /classes/:classId/chapters
export const chapterEndpoints = {
  GET_CHAPTERS_API: "/chapters",
  GET_CHAPTER_BY_SLUG_API: "/chapters/slug",
  CREATE_CHAPTER_API: "/chapters",
  UPDATE_CHAPTER_API: "/chapters",
  DELETE_CHAPTER_API: "/chapters",
};

// Audio lectures are listed under a chapter: /audio-lectures?chapterId=
export const audioLectureEndpoints = {
  GET_AUDIO_LECTURES_API: "/audio-lectures",
  CREATE_AUDIO_LECTURE_API: "/audio-lectures",
  UPDATE_AUDIO_LECTURE_API: "/audio-lectures",
  UPDATE_AUDIO_LECTURE_STATUS_API: "/audio-lectures",
  DELETE_AUDIO_LECTURE_API: "/audio-lectures",
};

// Keyword revisions are listed under a chapter: /keyword-revisions?chapterId=
export const keywordRevisionEndpoints = {
  GET_KEYWORD_REVISIONS_API: "/keyword-revisions",
  CREATE_KEYWORD_REVISION_API: "/keyword-revisions",
  UPDATE_KEYWORD_REVISION_API: "/keyword-revisions",
  UPDATE_KEYWORD_REVISION_STATUS_API: "/keyword-revisions",
  DELETE_KEYWORD_REVISION_API: "/keyword-revisions",
};

// Chapter quizzes are listed under a chapter: /quizzes?chapterId=&type=CHAPTER
export const chapterQuizEndpoints = {
  GET_CHAPTER_QUIZZES_API: "/quizzes",
  CREATE_CHAPTER_QUIZ_API: "/quizzes",
  UPDATE_CHAPTER_QUIZ_API: "/quizzes",
  DELETE_CHAPTER_QUIZ_API: "/quizzes",
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

export const subscriptionEndpoints = {
  GET_SUBSCRIPTIONS_API: "/subscriptions",
  CREATE_SUBSCRIPTION_API: "/subscriptions",
  UPDATE_SUBSCRIPTION_API: "/subscriptions",
  UPDATE_SUBSCRIPTION_STATUS_API: "/subscriptions",
  DELETE_SUBSCRIPTION_API: "/subscriptions",
};
