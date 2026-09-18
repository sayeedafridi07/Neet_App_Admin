import { apiConnector } from "../apiconnector";
import { adminEndpoints } from "../apis";

const {
  GET_ADMINS_API,
  CREATE_ADMIN_API,
  UPDATE_ADMIN_API,
  DELETE_ADMIN_API,
  UPDATE_ADMIN_STATUS_API,
} = adminEndpoints;

export const getAdmins = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_ADMINS_API,
    params,
  });

  return response.data;
};

export const createAdmin = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_ADMIN_API,
    bodyData: body,
  });

  return response.data;
};

export const updateAdmin = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_ADMIN_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_ADMIN_API}/${id}`,
  });

  return response.data;
};

export const toggleAdminStatus = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_ADMIN_STATUS_API}/${id}/status`,
    bodyData: body,
  });

  return response.data;
};
