import axios from "axios";
import toast from "react-hot-toast";

const ENABLE_API_LOGS = true;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================================
// REQUEST INTERCEPTOR
// ====================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (ENABLE_API_LOGS) {
      console.log("====================================");
      console.log("API REQUEST:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
      console.log("====================================");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ====================================
// RESPONSE INTERCEPTOR
// ====================================

axiosInstance.interceptors.response.use(
  (response) => {
    if (ENABLE_API_LOGS) {
      console.log("====================================");
      console.log("API RESPONSE:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      console.log("====================================");
    }

    return response;
  },

  (error) => {
    if (ENABLE_API_LOGS) {
      console.log("====================================");
      console.log("API ERROR:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
      console.log("====================================");
    }

    const isLoginRequest = error?.config?.url?.includes("/admin/login");

    if (error?.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("accessToken");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

      toast.error("Session expired. Please login again.", {
        duration: 4000,
      });
    }

    return Promise.reject(error);
  },
);

// ====================================
// API CONNECTOR
// ====================================

export const apiConnector = async ({
  method,
  url,
  bodyData,
  headers = {},
  params = {},
  timeout,
}) => {
  const response = await axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
    ...(timeout !== undefined && { timeout }),
  });

  return response;
};
