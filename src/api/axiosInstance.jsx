import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          window.dispatchEvent(
            new CustomEvent("sessionExpiredWithNavigation", {
              detail: {
                message: "Your session has expired. Please log in again.",
              },
            })
          );
          return Promise.reject(new Error("Token expired"));
        }

        config.headers["Authorization"] = `Bearer ${token}`;

        if (payload?.tenant_subdomain) {
          config.headers["x-tenant"] = payload.tenant_subdomain;
        }
      } catch (error) {
        localStorage.removeItem("token");
        window.dispatchEvent(
          new CustomEvent("sessionExpiredWithNavigation", {
            detail: {
              message:
                "Invalid session. Please log in again. Error: " + error.message,
            },
          })
        );
        return Promise.reject(new Error("Invalid token"));
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");

      window.dispatchEvent(
        new CustomEvent("sessionExpiredWithNavigation", {
          detail: {
            message: "Your session has expired. Please log in again.",
          },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
