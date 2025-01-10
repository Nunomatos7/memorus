import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Home from "./pages/Home/Home";
import Memors from "./pages/Memors/Memors";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import MemoryBoard from "./pages/MemoryBoard/MemoryBoard";
import AdminHome from "./pages/Admin/Home/Home";
import AdminLeaderboard from "./pages/Admin/Leaderboard/Leaderboard";
import AdminMemoryBoard from "./pages/Admin/MemoryBoard/MemoryBoard";
import AdminBoard from "./pages/Admin/AdminBoard/AdminBoard";
import AdminLayout from "./Components/AdminLayout/AdminLayout";
import CollaboratorLayout from "./Components/CollaboratorLayout/CollaboratorLayout";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ChangePassword from "./auth/ChangePassword";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  const [user, setUser] = useState(null);

  const demoUsers = [
    { email: "admin@example.com", password: "admin123", role: "Admin" },
    { email: "user@example.com", password: "user123", role: "Regular" },
    { email: "nengue@nengue.com", password: "nengue", role: "Regular" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

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

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);

    window.location.href = "/login";
  };

  const ProtectedRoute = ({ children, role }) => {
    if (!user) {
      return <Navigate to='/login' replace />;
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
      {/* Render Navbar only if user is logged in */}
      {user == "Regular" && <Navbar logout={logout} />}
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
          path='/home/*'
          element={
            <ProtectedRoute role='Regular'>
              <CollaboratorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path='memors' element={<Memors />} />
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
          <Route path='memoryboard' element={<AdminMemoryBoard />} />
          <Route path='adminboard' element={<AdminBoard />} />
        </Route>

        {/* Catch-All Redirect */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </>
  );
}

export default App;
