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

// Response interceptor for handling expired/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear token and user info
      localStorage.removeItem("token");
      // Dispatch a custom event for global logout and toast
      window.dispatchEvent(
        new CustomEvent("sessionExpired", {
          detail: {
            message: "Your session has ended. Please log in again to continue.",
          },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
