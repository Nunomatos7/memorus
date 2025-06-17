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
import LandingPage from "./pages/LandingPage/LandingPage";
import Terms from "./pages/Terms/Terms";
import { useAuth, SessionManager } from "./context/AuthContext";
import Loader from "./Components/Loader/Loader";
import { Toaster, toast } from "react-hot-toast";
import TeamGuard from "./Components/TeamGuard/TeamGuard";
import { Box } from "@mui/material";
import Profile from "./pages/Profile/Profile";
import { useEffect, useRef } from "react";

function App() {
  const { user, setUser, loading, cookiesAccepted } = useAuth();
  const location = useLocation();
  const sessionExpiredRef = useRef(false);
  const logoutInProgressRef = useRef(false);

  const isMainDomain = () => {
    const hostname = window.location.hostname;
    return (
      hostname === "memor-us.com" ||
      hostname === "www.memor-us.com" ||
      hostname === "localhost"
    );
  };

  const isTenantSubdomain = () => {
    const hostname = window.location.hostname;
    return (
      hostname.endsWith(".memor-us.com") &&
      hostname !== "memor-us.com" &&
      hostname !== "www.memor-us.com"
    );
  };

  // Listen for session expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      sessionExpiredRef.current = true;
      console.log("🚨 Session expiration flag set");
    };

    // Listen for normal logout events
    const handleLogout = () => {
      logoutInProgressRef.current = true;
      console.log("🚪 Logout flag set");
    };

    window.addEventListener(
      "sessionExpiredWithNavigation",
      handleSessionExpired
    );
    window.addEventListener("userLogout", handleLogout);

    return () => {
      window.removeEventListener(
        "sessionExpiredWithNavigation",
        handleSessionExpired
      );
      window.removeEventListener("userLogout", handleLogout);
    };
  }, []);

  // Reset flags when user logs in
  useEffect(() => {
    if (user) {
      console.log("✅ User logged in, resetting all flags");
      sessionExpiredRef.current = false;
      logoutInProgressRef.current = false;
    }
  }, [user]);

  const ProtectedRoute = ({ children, role }) => {
    if (loading || !cookiesAccepted) {
      return <Loader />;
    }

    if (!user) {
      // Don't show toast if:
      // 1. Session expiration (SessionManager handles that)
      // 2. Normal logout in progress
      // 3. Already on login page
      const shouldShowToast =
        !sessionExpiredRef.current &&
        !logoutInProgressRef.current &&
        !location.pathname.includes("/app/login");

      if (shouldShowToast) {
        console.log(
          "🍞 Showing 'Please log in' toast - direct access to protected route"
        );
        toast.error("Please log in to access this page.", {
          duration: 4000,
          style: {
            background: "#d32f2f",
            color: "#fff",
          },
        });
      } else {
        console.log("🔇 Skipping toast:", {
          sessionExpired: sessionExpiredRef.current,
          logoutInProgress: logoutInProgressRef.current,
          onLoginPage: location.pathname.includes("/app/login"),
        });
      }

      return <Navigate to='/app/login' state={{ from: location }} replace />;
    }

    if (role && !user.roles?.includes(role.toLowerCase())) {
      toast.error("You don't have permission to access this page.", {
        duration: 4000,
        style: {
          background: "#d32f2f",
          color: "#fff",
        },
      });
      return <Navigate to='/app/login' replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
  };

  const isAuthPage = [
    "/app/login",
    "/app/register",
    "/app/change-password",
  ].includes(location.pathname);

  const isLandingPage = location.pathname === "/landing";

  const hideFooter =
    isAuthPage ||
    isLandingPage ||
    location.pathname.toLowerCase().includes("/app/memoryboard");

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
      <SessionManager />

      <Routes>
        {isMainDomain() && <Route path='/*' element={<LandingPage />} />}

        <Route
          path='/app/login'
          element={
            user ? (
              <Navigate
                to={
                  user.roles?.includes("admin")
                    ? "/app/admin/home"
                    : "/app/home"
                }
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path='/app/register'
          element={
            user ? (
              <Navigate
                to={
                  user.roles?.includes("admin")
                    ? "/app/admin/home"
                    : "/app/home"
                }
                replace
              />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route path='/app/change-password' element={<ChangePassword />} />
        <Route path='/terms' element={<Terms />} />

        <Route
          path='/app/*'
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

        <Route
          path='/app/admin/*'
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

        {/* Landing Page Routes - Only for main domain (memor-us.com, www.memor-us.com, localhost) */}
        {isMainDomain() && (
          <>
            <Route path='/' element={<LandingPage />} />
            <Route path='/landing' element={<LandingPage />} />
          </>
        )}

        {/* Catch-All Routes */}
        <Route path='*' element={<Navigate to='/app/login' replace />} />
        <Route
          path='*'
          element={
            isMainDomain() ? (
              <Navigate to='/landing' replace />
            ) : isTenantSubdomain() ? (
              <Navigate to='/app/login' replace />
            ) : (
              <Navigate to='/app/login' replace />
            )
          }
        />
      </Routes>

      {!hideFooter && (isAdmin ? <AdminFooter /> : <CollaboratorFooter />)}

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
