import { apiConnector } from "../apiconnector";
import { chapterEndpoints } from "../apis";

const {
  GET_CHAPTERS_API,
  GET_CHAPTER_BY_SLUG_API,
  CREATE_CHAPTER_API,
  UPDATE_CHAPTER_API,
  DELETE_CHAPTER_API,
} = chapterEndpoints;

export const getChapters = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_CHAPTERS_API,
    params,
  });

  return response.data;
};

export const getChapterBySlug = async (slug) => {
  const response = await apiConnector({
    method: "GET",
    url: `${GET_CHAPTER_BY_SLUG_API}/${slug}`,
  });

  return response.data;
};

export const createChapter = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_CHAPTER_API,
    bodyData: body,
  });

  return response.data;
};

export const updateChapter = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_CHAPTER_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteChapter = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_CHAPTER_API}/${id}`,
  });

  return response.data;
};
