import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ConsentModal from "./Components/ConsentModal/ConsentModal";
import CollaboratorFooter from "./Components/CollaboratorFooter/CollaboratorFooter";
import AdminFooter from "./Components/AdminFooter/AdminFooter";
import { useAuth } from "./context/AuthContext";
import Loader from "./Components/Loader/Loader";
import { Toaster } from "react-hot-toast";
import TeamGuard from "./Components/TeamGuard/TeamGuard";
import { Box } from "@mui/material";
import Profile from "./pages/Profile/Profile";

function App() {
  const { user, setUser, loading, cookiesAccepted } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className='p-4 text-center'>A carregar dados...</div>;
  }

  const ProtectedRoute = ({ children, role }) => {
    if (loading || !cookiesAccepted) {
      return <Loader />;
    }

    if (!user) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (role && !user.roles?.includes(role.toLowerCase())) {
      return <Navigate to='/login' replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
  };

  // Determine if we're on an auth page to not show footer
  const isAuthPage = ["/login", "/register", "/change-password"].includes(
    location.pathname
  );
  const hideFooter =
    isAuthPage || location.pathname.toLowerCase().includes("/memoryboard");

  const isAdmin = user?.roles?.some((role) => role.toLowerCase() === "admin");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <ConsentModal setUser={setUser} />

      <Routes>
        {/* Auth Routes */}
        <Route
          path='/login'
          element={
            user ? (
              <Navigate
                to={user.roles?.includes("admin") ? "/admin/home" : "/home"}
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
                to={user.roles?.includes("admin") ? "/admin/home" : "/home"}
                replace
              />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route path='/change-password' element={<ChangePassword />} />

        {/* Collaborator Routes */}
        <Route
          path='/*'
          element={
            <ProtectedRoute role='member'>
              <TeamGuard>
                <CollaboratorLayout />
              </TeamGuard>
            </ProtectedRoute>
          }
        >
          <Route path='' element={<Navigate to='home' replace />} />
          <Route path='home' index element={<Home />} />
          <Route path='memors' element={<Memors />} />
          <Route path='memors/:memorId' element={<Memors />} />
          <Route path='leaderboard' element={<Leaderboard />} />
          <Route path='memoryboard' element={<MemoryBoard />} />
          <Route path='profile' element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute role='admin'>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='home' element={<AdminHome />} />
          <Route path='leaderboard' element={<AdminLeaderboard />} />
          <Route path='memoryboard' element={<MemoryBoard />} />
          <Route path='adminboard' element={<AdminBoard />} />
        </Route>

        {/* Catch-All */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>

      {/* Footer (conditional) */}
      {!hideFooter && (isAdmin ? <AdminFooter /> : <CollaboratorFooter />)}

      {/* Toast Notifications */}
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            background: "#1E1F20",
            color: "#fff",
            border: "1px solid #d0bcfe",
          },
        }}
      />
    </Box>
  );
}

export default App;
