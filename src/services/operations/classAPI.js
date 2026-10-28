import { apiConnector } from "../apiconnector";
import { classEndpoints } from "../apis";

const {
  GET_CLASSES_API,
  CREATE_CLASS_API,
  UPDATE_CLASS_API,
  DELETE_CLASS_API,
} = classEndpoints;

export const getClasses = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_CLASSES_API,
    params,
  });

  return response.data;
};

export const createClass = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_CLASS_API,
    bodyData: body,
  });

  return response.data;
};

export const updateClass = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_CLASS_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteClass = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_CLASS_API}/${id}`,
  });

  return response.data;
};
