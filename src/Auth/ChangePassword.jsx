import { useState } from "react";
import "./LoginPage.css"; // Reuse the same CSS for consistent styling
import logo from "../assets/images/logo.svg";
import { TextField, Button, Typography } from "@mui/material";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";

const ChangePasswordPage = () => {
  const [username, setUsername] = useState(""); // Username (email)
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Simulate password change logic
    const demoUsers = [
      { username: "test@example.com", password: "oldpassword" },
    ];

    const userExists = demoUsers.find((user) => user.username === username);

    if (!userExists) {
      setError("User not found. Please check your username.");
      return;
    }

    // Simulate password update
    userExists.password = newPassword;
    setSuccess("Password changed successfully!");
    setUsername("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='logo-container'>
          <img src={logo} alt='Logo' className='logo' />
        </div>
        <Typography variant='h5' className='login-title'>
          Change Password
        </Typography>
        <Typography variant='body2' className='login-subtitle' sx={{ mb: 2 }}>
          Enter your username (email) and a new password to update your
          credentials.
        </Typography>
        <form onSubmit={handleChangePassword} className='login-form'>
          {error && <Typography className='error-message'>{error}</Typography>}
          {success && (
            <Typography className='success-message'>{success}</Typography>
          )}

          {/* Username Field */}
          <TextField
            label='Username (Email)'
            type='email'
            variant='outlined'
            fullWidth
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
            sx={{
              backgroundColor: "#6200ea",
              "&:hover": { backgroundColor: "#4e00d1" },
            }}
          >
            Change Password
          </Button>
        </form>
      </div>
      <img className='left-background' src={leftBackground} alt='' />
      <img className='right-background' src={rightBackground} alt='' />
    </div>
  );
};

export default ChangePasswordPage;
