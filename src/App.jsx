import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import "./index.css";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ChangePassword from "./auth/ChangePassword";

function App() {
  const [user, setUser] = useState(null); // User object (e.g., { email, role })
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Stop loading
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading screen while checking localStorage
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path='/login'
        element={
          user ? (
            <Navigate
              to={user.role === "Admin" ? "/admin/home" : "/home"}
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
              to={user.role === "Admin" ? "/admin/home" : "/home"}
              replace
            />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path='/change-password' element={<ChangePassword />} />

      {/* Collaborator (Regular User) Routes */}
      <Route
        path='/home/*'
        element={
          user && user.role === "Regular" ? (
            <CollaboratorLayout />
          ) : (
            <Navigate to='/login' replace />
          )
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
          user && user.role === "Admin" ? (
            <AdminLayout />
          ) : (
            <Navigate to='/login' replace />
          )
        }
      >
        <Route path='home' element={<AdminHome />} />
        <Route path='leaderboard' element={<AdminLeaderboard />} />
        <Route path='memoryboard' element={<AdminMemoryBoard />} />
        <Route path='adminboard' element={<AdminBoard />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
}

export default App;
