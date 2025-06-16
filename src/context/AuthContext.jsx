// Enhanced AuthContext.jsx with proper React Router navigation
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

  // Function to clear user session
  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Function to validate and set token
  const validateAndSetToken = (storedToken) => {
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem("token");
        toast.error("Your session has expired. Please log in again.", {
          duration: 5000,
          style: {
            background: "#d32f2f",
            color: "#fff",
          },
        });
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
      toast.error("Invalid session. Please log in again.", {
        duration: 5000,
        style: {
          background: "#d32f2f",
          color: "#fff",
        },
      });
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

    // Listen for sessionExpired event
    const handleSessionExpired = (e) => {
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

      // Dispatch a custom event that App.jsx can listen to for navigation
      // We can't use useNavigate here because this might be called outside React Router context
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/app/login")) {
          // Force a page reload to the login route
          window.location.href = "/app/login";
        }
      }, 100);
    };

    // Listen for token validation from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token was removed in another tab
          clearSession();
        } else if (e.newValue !== token) {
          // Token was updated in another tab
          validateAndSetToken(e.newValue);
        }
      }
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  // Enhanced setToken function with validation
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

// Alternative approach: Create a separate component that handles navigation
export function SessionManager() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSessionExpiredWithNavigation = (e) => {
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

      // Use React Router navigation instead of window.location
      setTimeout(() => {
        if (!location.pathname.includes("/app/login")) {
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
  }, [navigate, location]);

  return null; // This component doesn't render anything
}
