// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <- Adiciona isto

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser(payload);
        setToken(storedToken);
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }

    setLoading(false); // <- Indica que acabou de carregar
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading }}>
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
