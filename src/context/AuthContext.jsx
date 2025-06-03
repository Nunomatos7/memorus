import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    let storedToken = localStorage.getItem("token");

    // if (!storedToken && import.meta.env.DEV) {
    //   storedToken =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiUm9kcmlnbyIsImxhc3ROYW1lIjoiU2lsdmEiLCJlbWFpbCI6InJvZHJpZ29zaWx2YUBsb2JhLmNvbSIsInRlYW1zSWQiOm51bGwsInRlbmFudF9zdWJkb21haW4iOiJsb2JhIiwicm9sZXMiOlsibWVtYmVyIl0sImlzU3VwZXJBZG1pbiI6ZmFsc2UsImlhdCI6MTc0MzAyMzUwMSwiZXhwIjoxNzQzMTA5OTAxfQ.uEONeIu9zh3kusjK2rytJORT8ZkKDgR4y0rwU81H5nU";
    //   localStorage.setItem("token", storedToken);
    // }

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
