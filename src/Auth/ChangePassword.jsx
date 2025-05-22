import { useState, useEffect } from "react";
import "./LoginPage.css";
import logo from "../assets/images/logo.svg";
import { TextField, Button, Typography } from "@mui/material";
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    // Create request payload
    const payload = {
      email: username,
      newPassword: newPassword,
    };

    // Only include current password if user is logged in
    if (user && user.email) {
      if (!currentPassword) {
        setError("Current password is required.");
        setLoading(false);
        return;
      }
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
        "x-tenant": tenant,
      };

      // Add token to headers if available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

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
      setSuccess("Password changed successfully! Redirecting to login...");

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
          {error && <Typography className='error-message'>{error}</Typography>}
          {success && (
            <Typography className='success-message'>{success}</Typography>
          )}

          {/* Username Field - Only show if not logged in */}
          {!user && (
            <TextField
              label='Username (Email)'
              type='email'
              variant='outlined'
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!!user}
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
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Confirm New Password Field */}
          <TextField
            label='Confirm New Password'
            type='password'
            variant='outlined'
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
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
