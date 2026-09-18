import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";

const { GET_STUDENTS_API, CREATE_STUDENT_API, UPDATE_STUDENT_API } =
  studentEndpoints;

export const getStudents = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_STUDENTS_API,
    params,
  });

  return response.data;
};

export const createStudent = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_STUDENT_API,
    bodyData: body,
  });

  return response.data;
};

export const updateStudent = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_STUDENT_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${UPDATE_STUDENT_API}/${id}`,
  });

  return response.data;
};

export const resetStudentDevice = async (id) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_STUDENT_API}/${id}/reset-device`,
  });

  return response.data;
};

export const toggleStudentStatus = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_STUDENT_API}/${id}/status`,
    bodyData: body,
  });

  return response.data;
};
