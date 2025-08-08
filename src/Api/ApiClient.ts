import toast from "react-hot-toast";
import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const ApiClient = axios.create({
  baseURL: "https://localhost:7079/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
  //   // Handle self-signed or invalid certificates in development
  //   httpsAgent: process.env.NODE_ENV === 'development' ? {
  //     rejectUnauthorized: false
  //   } : undefined
});

ApiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    const token = cookies.get("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    toast.error(error.response?.data?.message || "Request failed");
    return Promise.reject(error);
  }
);

ApiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      // Handle unauthorized access

      toast.error("Your session has expired. Please login again.");

      cookies.remove("token");
      cookies.remove("user");
    }
    return Promise.reject(error);
  }
);
