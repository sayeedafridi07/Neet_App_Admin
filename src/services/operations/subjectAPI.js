import { apiConnector } from "../apiconnector";
import { subjectEndpoints } from "../apis";

const {
  GET_SUBJECTS_API,
  CREATE_SUBJECT_API,
  UPDATE_SUBJECT_API,
  DELETE_SUBJECT_API,
  UPDATE_SUBJECT_STATUS_API,
} = subjectEndpoints;

export const getSubjects = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_SUBJECTS_API,
    params,
  });

  return response.data;
};

export const createSubject = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_SUBJECT_API,
    bodyData: body,
  });

  return response.data;
};

export const updateSubject = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_SUBJECT_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_SUBJECT_API}/${id}`,
  });

  return response.data;
};

export const toggleSubjectStatus = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_SUBJECT_STATUS_API}/${id}/status`,
    bodyData: body,
  });

  return response.data;
};
