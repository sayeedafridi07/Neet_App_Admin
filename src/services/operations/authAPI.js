import { apiConnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const { LOGIN_API, LOGOUT_API } = authEndpoints;

export const login = async (bodyData) => {
  const response = await apiConnector({
    method: "POST",
    url: LOGIN_API,
    bodyData,
  });

  return response.data;
};

export const logout = async () => {
  const response = await apiConnector({
    method: "POST",
    url: LOGOUT_API,
  });

  return response.data;
};
