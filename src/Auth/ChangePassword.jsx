import { useState, useEffect } from "react";
import "./LoginPage.css";
import logo from "../assets/images/logo.svg";
import { TextField, Button, Typography, Alert } from "@mui/material";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Memor'us | Change password`;

    // If user is logged in, pre-fill the email field
    if (user && user.email) {
      setUsername(user.email);
    }
  }, [user]);

  const validateForm = () => {
    // Reset error
    setError("");

    // Check if username is provided when not logged in
    if (!user && !username.trim()) {
      setError("Email is required.");
      return false;
    }

    // Check if current password is provided when user is logged in
    if (user && !currentPassword.trim()) {
      setError("Current password is required.");
      return false;
    }

    // Check if new password is provided
    if (!newPassword.trim()) {
      setError("New password is required.");
      return false;
    }

    // Basic password length check
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return false;
    }

    // Check if new password is same as current (basic client-side check)
    if (user && currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Create request payload
    const payload = {
      email: user ? user.email : username,
      newPassword: newPassword,
    };

    // Include current password if user is logged in
    if (user) {
      payload.currentPassword = currentPassword;
    }

    try {
      // Determine tenant from subdomain or header
      const getTenantFromSubdomain = () => {
        const host = window.location.hostname;
        const parts = host.split(".");

        if (host.includes("localhost")) {
          return parts.length > 1 ? parts[0] : null;
        }

        if (parts.length >= 3) {
          return parts[0];
        }

        return null;
      };

      const tenant = getTenantFromSubdomain();

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add tenant header if available
      if (tenant) {
        headers["x-tenant"] = tenant;
      }

      // Add token to headers if available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("Making password change request with payload:", {
        ...payload,
        currentPassword: payload.currentPassword ? "[PROVIDED]" : "[NOT PROVIDED]",
        newPassword: "[REDACTED]"
      });

      // Make the API request
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error changing password");
      }

      // Show success message
      setSuccess("Password changed successfully! Redirecting to home...");

      // Clear form
      setUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{
            color: "#ffffff",
            position: "absolute",
            top: 16,
            left: 16,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Back
        </Button>

        <div className='logo-container'>
          <img src={logo} alt='Logo' className='logo' />
        </div>
        <Typography variant='h5' className='login-title'>
          Change Password
        </Typography>
        <Typography variant='body2' className='login-subtitle' sx={{ mb: 2 }}>
          {user
            ? "Enter your current password and a new password to update your credentials."
            : "Enter your username (email) and a new password to update your credentials."}
        </Typography>
        
        <form onSubmit={handleChangePassword} className='login-form'>
          {error && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: "#d32f2f", color: "#fff" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: "#2e7d32", color: "#fff" }}>
              {success}
            </Alert>
          )}

          {/* Username Field - Only show if not logged in */}
          {!user && (
            <TextField
              label='Username (Email)'
              type='email'
              variant='outlined'
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  backgroundColor: "#2c2c2c",
                  borderRadius: "8px",
                  color: "#ffffff",
                },
                "& .MuiInputLabel-root": {
                  color: "#ffffff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#6200ea",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4e00d1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6200ea",
                  },
                },
              }}
            />
          )}

          {/* Current Password Field - Only show if logged in */}
          {user && (
            <TextField
              label='Current Password'
              type='password'
              variant='outlined'
              fullWidth
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  backgroundColor: "#2c2c2c",
                  borderRadius: "8px",
                  color: "#ffffff",
                },
                "& .MuiInputLabel-root": {
                  color: "#ffffff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#6200ea",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4e00d1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6200ea",
                  },
                },
              }}
            />
          )}

          {/* New Password Field */}
          <TextField
            label='New Password'
            type='password'
            variant='outlined'
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Password must be at least 8 characters long"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#2c2c2c",
                borderRadius: "8px",
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiFormHelperText-root": {
                color: "#ffffff",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#6200ea",
                },
                "&:hover fieldset": {
                  borderColor: "#4e00d1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6200ea",
                },
              },
            }}
          />

          {/* Confirm New Password Field */}
          <TextField
            label='Confirm New Password'
            type='password'
            variant='outlined'
            fullWidth
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                backgroundColor: "#2c2c2c",
                borderRadius: "8px",
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#6200ea",
                },
                "&:hover fieldset": {
                  borderColor: "#4e00d1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6200ea",
                },
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            className='login-button'
            disabled={loading}
            sx={{
              backgroundColor: "#6200ea",
              "&:hover": { backgroundColor: "#4e00d1" },
              "&:disabled": { 
                backgroundColor: "#555",
                color: "#999"
              },
            }}
          >
            {loading ? "Processing..." : "Change Password"}
          </Button>
        </form>
      </div>
      <img className='left-background' src={leftBackground} alt='' />
      <img className='right-background' src={rightBackground} alt='' />
    </div>
  );
};

export default ChangePasswordPage;