import { toast } from "react-hot-toast";

import { apiConnector } from "../apiconnector";
import { resultEndpoints } from "../apis";

const {
  GET_RESULT_API,
  CREATE_RESULT_API,
  UPDATE_RESULT_API,
  DELETE_RESULT_API,
  UPDATE_RESULT_STATUS_API,
} = resultEndpoints;

export const getResult = async (token, params) => {
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      GET_RESULT_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params,
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    result = response?.data;
  } catch (error) {
    console.error(error?.status, error?.data?.message);
    toast.error(error?.response?.data?.message || "Failed to fetch result");
  }
  return result;
};

export const createResult = async (token, body) => {
  const toastId = toast.loading("Creating result...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_RESULT_API, body, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Result created successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not create result");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const updateResult = async (token, id, body) => {
  const toastId = toast.loading("Updating result...");
  let result = null;
  try {
    const response = await apiConnector(
      "PATCH",
      UPDATE_RESULT_API + "/" + id,
      body,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Result updated successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not update result");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const updateResultStatus = async (token, id, body) => {
  const toastId = toast.loading("Updating result status...");
  let result = null;
  try {
    const response = await apiConnector(
      "PATCH",
      `${UPDATE_RESULT_STATUS_API}/${id}/status`,
      body,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Result status updated successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Could not update result status",
    );
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const deleteResult = async (token, id) => {
  const toastId = toast.loading("Deleting result...");
  let result = null;
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_RESULT_API + "/" + id,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Result deleted successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not delete result");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};
