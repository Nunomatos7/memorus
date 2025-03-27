// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (payload?.tenant_subdomain) {
      config.headers["x-tenant"] = payload.tenant_subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
