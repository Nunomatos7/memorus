import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Home from "./pages/Home/Home";
import Memors from "./pages/Memors/Memors";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import MemoryBoard from "./pages/MemoryBoard/MemoryBoard";
import AdminHome from "./pages/Admin/Home/Home";
import AdminLeaderboard from "./pages/Admin/Leaderboard/Leaderboard";
import AdminBoard from "./pages/Admin/AdminBoard/AdminBoard";
import AdminLayout from "./Components/AdminLayout/AdminLayout";
import CollaboratorLayout from "./Components/CollaboratorLayout/CollaboratorLayout";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import ChangePassword from "./Auth/ChangePassword";
import Loader from "./Components/Loader/Loader";
import ConsentModal from "./Components/ConsentModal/ConsentModal";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const demoUsers = [
    { email: "admin@blip.com", password: "admin123", role: "Admin" },
    { email: "user@blip.com", password: "user123", role: "Regular" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (email, password) => {
    const authenticatedUser = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!authenticatedUser) {
      throw new Error("Invalid email or password");
    }

    setUser(authenticatedUser);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const ProtectedRoute = ({ children, role }) => {
    const location = useLocation();

    if (loading) {
      return <Loader />;
    }

    if (!user) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to='/login' replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
  };

  return (
    <>
      <ConsentModal setUser={setUser} />
      <Routes>
        {/* Login Route */}
        <Route
          path='/login'
          element={
            user ? (
              <Navigate
                to={`/${user.role === "Admin" ? "admin/home" : "home"}`}
                replace
              />
            ) : (
              <LoginPage login={login} />
            )
          }
        />
        {/* Register Route */}
        <Route
          path='/register'
          element={
            user ? (
              <Navigate
                to={`/${user.role === "Admin" ? "admin/home" : "home"}`}
                replace
              />
            ) : (
              <RegisterPage />
            )
          }
        />
        {/* Change Password Route */}
        <Route path='/change-password' element={<ChangePassword />} />

        {/* Regular User Routes */}
        <Route
          path='/*'
          element={
            <ProtectedRoute role='Regular'>
              <CollaboratorLayout />
            </ProtectedRoute>
          }
        >
          <Route path='' element={<Navigate to='home' replace />} />
          <Route path='home' index element={<Home />} />
          <Route path='memors' element={<Memors />} />
          <Route path='memors/:memorId' element={<Memors />} />
          <Route path='leaderboard' element={<Leaderboard />} />
          <Route path='memoryboard' element={<MemoryBoard />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute role='Admin'>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='home' element={<AdminHome />} />
          <Route path='leaderboard' element={<AdminLeaderboard />} />
          <Route path='memoryboard' element={<MemoryBoard />} />
          <Route path='adminboard' element={<AdminBoard />} />
        </Route>

        {/* Catch-All Redirect */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </>
  );
}

export default App;
