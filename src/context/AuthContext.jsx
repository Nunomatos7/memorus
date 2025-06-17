import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const clearSession = () => {
    window.dispatchEvent(new CustomEvent("userLogout"));

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const validateAndSetToken = (storedToken) => {
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem("token");
        return false;
      }

      payload.role = payload.roles?.[0]?.toLowerCase() || "regular";
      setUser(payload);
      setToken(storedToken);
      console.log("Token validated and set:", payload);
      return true;
    } catch (err) {
      console.error("Error validating token:", err);
      localStorage.removeItem("token");
      return false;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      validateAndSetToken(storedToken);
    }

    const consent = document.cookie.includes("cookiesAccepted=true");
    setCookiesAccepted(consent);
    setLoading(false);

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          clearSession();
        } else if (e.newValue !== token) {
          validateAndSetToken(e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const setTokenWithValidation = (newToken) => {
    if (newToken) {
      if (validateAndSetToken(newToken)) {
        localStorage.setItem("token", newToken);
      }
    } else {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken: setTokenWithValidation,
        loading,
        cookiesAccepted,
        setCookiesAccepted,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SessionManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSession } = useAuth();

  useEffect(() => {
    const handleSessionExpiredWithNavigation = (e) => {
      console.log(
        "Session expired event received, clearing session and navigating..."
      );

      clearSession();

      const message =
        (e && e.detail && e.detail.message) ||
        "Your session has expired. Please log in again.";

      toast.error(message, {
        duration: 5000,
        style: {
          background: "#d32f2f",
          color: "#fff",
        },
      });

      setTimeout(() => {
        if (!location.pathname.includes("/app/login")) {
          console.log("Redirecting to login page via React Router...");
          navigate("/app/login", { replace: true });
        }
      }, 100);
    };

    window.addEventListener(
      "sessionExpiredWithNavigation",
      handleSessionExpiredWithNavigation
    );

    return () => {
      window.removeEventListener(
        "sessionExpiredWithNavigation",
        handleSessionExpiredWithNavigation
      );
    };
  }, [navigate, location, clearSession]);

  return null;
}
