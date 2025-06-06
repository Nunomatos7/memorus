import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    let storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        payload.role = payload.roles?.[0]?.toLowerCase() || "regular";
        setUser(payload);
        setToken(storedToken);
        console.log("Token decodificado:", payload);
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
    const consent = document.cookie.includes("cookiesAccepted=true");
    setCookiesAccepted(consent);
    setLoading(false);

    // Listen for sessionExpired event
    const handleSessionExpired = (e) => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      toast.error(
        (e && e.detail && e.detail.message) ||
          "Your session has ended. Please log in again to continue."
      );
      setTimeout(() => {
        window.location.href = "/app/login";
      }, 100);
    };
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        cookiesAccepted,
        setCookiesAccepted,
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
