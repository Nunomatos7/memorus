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
import { useAuth } from "./context/AuthContext";
import Loader from "./Components/Loader/Loader";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, setUser, loading, cookiesAccepted } = useAuth();

  if (loading) {
    return <div className='p-4 text-center'>A carregar dados...</div>;
  }

  const ProtectedRoute = ({ children, role }) => {
    const location = useLocation();
    console.log("ProtectedRoute | user:", user);

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
                to={user.roles?.includes("admin") ? "/admin/home" : "/home"}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        {/* Register Route */}
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
        {/* Change Password Route */}
        <Route path='/change-password' element={<ChangePassword />} />

        {/* Regular User Routes */}
        <Route
          path='/*'
          element={
            <ProtectedRoute role='member'>
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

        {/* Catch-All Redirect */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
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
    </>
  );
}

export default App;
