import { apiConnector } from "../apiconnector";
import { dashboardEndpoints } from "../apis";

const { GET_OVERVIEW_API, GET_USER_TRENDS_API, GET_ACTIVE_USERS_API } =
  dashboardEndpoints;

export const getDashboardOverview = async () => {
  const response = await apiConnector({ method: "GET", url: GET_OVERVIEW_API });
  return response.data;
};

// params: { year }
export const getUserTrends = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_USER_TRENDS_API,
    params,
  });
  return response.data;
};

// params: { days, inactiveAfterDays }
export const getActiveUsers = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_ACTIVE_USERS_API,
    params,
  });
  return response.data;
};
