import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const ProtectedRoute = ({ children, role }) => {
    if (!user) {
      return <Navigate to='/login' replace />;
    }
    if (role && user.role !== role) {
      return <Navigate to='/login' replace />;
    }
    return children;
  };

  // PropTypes for ProtectedRoute
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
  };

  return (
    <Routes>
      <Route
        path='/login'
        element={
          user ? (
            <Navigate
              to={`/${user.role === "Admin" ? "admin/home" : "home"}`}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />
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
      <Route path='/change-password' element={<ChangePassword />} />

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

      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
}

export default App;
