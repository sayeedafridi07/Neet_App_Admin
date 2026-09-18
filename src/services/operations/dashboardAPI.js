import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { setData } from "../../slices/dashboardSlice";
import { apiConnector } from "../apiconnector";
import { dashboardEndpoints } from "../apis";

const { GET_DASHBOARD_DATA_API } = dashboardEndpoints;

export function getDashboardData(token) {
    return async (dispatch, getState) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GET_DASHBOARD_DATA_API, null, {
                Authorization: `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            dispatch(setData(response?.data?.data));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch dashboard data");
        }
        dispatch(setLoading(false));
    };
}