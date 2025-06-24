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
import { useEffect, useRef, useState } from "react";

function App() {
  const { user, setUser, setToken, loading, cookiesAccepted } = useAuth();
  const location = useLocation();
  const sessionExpiredRef = useRef(false);
  const logoutInProgressRef = useRef(false);
  const [tempTokenProcessed, setTempTokenProcessed] = useState(false);

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

  // Handle temporary token authentication
  useEffect(() => {
    const handleTemporaryTokenAuth = async () => {
      const urlParams = new URLSearchParams(location.search);
      const tempToken = urlParams.get("token");

      // Only process if we have a temp token, no current user, and haven't processed yet
      if (tempToken && !user && !tempTokenProcessed) {
        console.log("🎯 Processing temporary token authentication...");
        setTempTokenProcessed(true);

        try {
          console.log("📤 Sending temp token verification request...");
          console.log("Temp token:", tempToken);
          console.log(
            "Request URL:",
            `${import.meta.env.VITE_API_URL}/api/users/verify-temp-token`
          );
          console.log("Tenant:", getTenantFromSubdomain());

          // Verify the temporary token with the backend
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/verify-temp-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Tenant": getTenantFromSubdomain(),
              },
              body: JSON.stringify({ tempToken }),
            }
          );

          console.log("📥 Response status:", response.status);
          console.log("📥 Response ok:", response.ok);

          if (response.ok) {
            const data = await response.json();
            console.log("📥 Response data:", data);

            if (data.fullToken && data.user) {
              console.log("✅ Temporary token verified, logging in user");

              // Store the full token and set user
              localStorage.setItem("token", data.fullToken);
              setToken(data.fullToken);
              setUser(data.user);

              // Clean up URL (remove token parameter)
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete("token");
              window.history.replaceState({}, "", newUrl.toString());

              toast.success("Welcome! You've been automatically logged in.", {
                duration: 4000,
                style: {
                  background: "#2e7d32",
                  color: "#fff",
                },
              });
            }
          } else {
            const errorData = await response.text();
            console.error("❌ Failed to verify temporary token");
            console.error("❌ Response body:", errorData);
            toast.error("Invalid or expired access link.", {
              duration: 4000,
              style: {
                background: "#d32f2f",
                color: "#fff",
              },
            });
          }
        } catch (error) {
          console.error("Error processing temporary token:", error);
          toast.error("Failed to process access link.", {
            duration: 4000,
            style: {
              background: "#d32f2f",
              color: "#fff",
            },
          });
        }
      }
    };

    // Get tenant from subdomain helper
    const getTenantFromSubdomain = () => {
      const host = window.location.hostname;
      const parts = host.split(".");

      if (host.includes("localhost")) {
        if (parts.length > 1 && parts[0] !== "localhost") {
          return parts[0];
        }
        return null;
      }

      if (parts.length >= 3) {
        if (parts[0] === "www") {
          return null;
        }
        return parts[0];
      }

      return null;
    };

    handleTemporaryTokenAuth();
  }, [location.search, user, tempTokenProcessed, setUser, setToken]);

  // Reset temp token processing when user changes
  useEffect(() => {
    if (user) {
      setTempTokenProcessed(false);
    }
  }, [user]);

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
      // 4. Currently processing temp token
      const shouldShowToast =
        !sessionExpiredRef.current &&
        !logoutInProgressRef.current &&
        !location.pathname.includes("/app/login") &&
        !tempTokenProcessed;

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
          tempTokenProcessing: tempTokenProcessed,
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

      {!location.pathname.toLowerCase().includes("/memoryboard") &&
        (isAdmin ? <AdminFooter /> : <CollaboratorFooter />)}

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
