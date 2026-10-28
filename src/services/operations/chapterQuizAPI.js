import { apiConnector } from "../apiconnector";
import { chapterQuizEndpoints } from "../apis";

const {
  GET_CHAPTER_QUIZZES_API,
  CREATE_CHAPTER_QUIZ_API,
  UPDATE_CHAPTER_QUIZ_API,
  DELETE_CHAPTER_QUIZ_API,
} = chapterQuizEndpoints;

export const getChapterQuizzes = async (chapterId, params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_CHAPTER_QUIZZES_API,
    params: { ...params, chapterId, type: "CHAPTER" },
  });

  return response.data;
};

export const createChapterQuiz = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_CHAPTER_QUIZ_API,
    bodyData: { ...body, type: "CHAPTER" },
  });

  return response.data;
};

export const updateChapterQuiz = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_CHAPTER_QUIZ_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteChapterQuiz = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_CHAPTER_QUIZ_API}/${id}`,
  });

  return response.data;
};

// ─── Questions: nested under a quiz, /quizzes/:quizId/questions ─────────────
const questionsUrl = (quizId) => `${GET_CHAPTER_QUIZZES_API}/${quizId}/questions`;

export const getQuizQuestions = async (quizId, params) => {
  const response = await apiConnector({
    method: "GET",
    url: questionsUrl(quizId),
    params,
  });

  return response.data;
};

// Plain JSON unless an image is attached; then multipart with the image under
// "image" and nested fields (options) JSON-encoded, since FormData is flat
const toQuestionRequest = (body, imageFile) => {
  if (!imageFile) return { bodyData: body };

  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : value,
    );
  });
  formData.append("image", imageFile);

  return {
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  };
};

export const createQuizQuestion = async (quizId, body, imageFile) => {
  const response = await apiConnector({
    method: "POST",
    url: questionsUrl(quizId),
    ...toQuestionRequest(body, imageFile),
  });

  return response.data;
};

export const updateQuizQuestion = async (quizId, id, body, imageFile) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${questionsUrl(quizId)}/${id}`,
    ...toQuestionRequest(body, imageFile),
  });

  return response.data;
};

export const deleteQuizQuestion = async (quizId, id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${questionsUrl(quizId)}/${id}`,
  });

  return response.data;
};

// Multipart upload: the .docx goes under "file"
export const importQuizQuestions = async (quizId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiConnector({
    method: "POST",
    url: `${questionsUrl(quizId)}/import`,
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  });

  return response.data;
};
