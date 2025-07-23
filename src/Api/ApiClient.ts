import toast from "react-hot-toast";
import axios from "axios";

export const ApiClient = axios.create({
  baseURL: "https://localhost:7079/api",
  headers: {},
  // Handle self-signed or invalid certificates in development
  httpsAgent: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false
  } : undefined
});

ApiClient.interceptors.request.use(
    (config)=>{
        console.log("API Request:", { 
            url: config.url, 
            method: config.method, 
            data: config.data 
        });
        const token = localStorage.getItem("token");
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        console.error("API Request Error:", error);
        toast.error(error.response?.data?.message || "Request failed");
        return Promise.reject(error);
    }
);

ApiClient.interceptors.response.use(
    (response) => {
        console.log("API Response:", { 
            status: response.status, 
            data: response.data 
        });
        return response;
    },
    (error) => {
        console.error("API Response Error:", { 
            status: error.response?.status,
            message: error.message,
            data: error.response?.data 
        });
        if (error.response?.status === 401) {
            // Handle unauthorized access
            toast.error("Your session has expired. Please login again.");
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);