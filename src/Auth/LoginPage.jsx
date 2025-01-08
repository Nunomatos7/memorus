import { useState } from "react";
import "./LoginPage.css"; // Reuse the same CSS for consistent styling
import logo from "../assets/images/logo.svg";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
  const [error, setError] = useState("");

  // Demo user database
  const demoUsers = [
    { email: "admin@example.com", password: "admin123", role: "Admin" },
    { email: "user@example.com", password: "user123", role: "Regular" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Simulate user authentication
    const user = demoUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    alert(`Login successful! Welcome, ${user.role}!`);
    if (rememberMe) {
      console.log("Remember Me is enabled");
    }

    // Clear inputs
    setEmail("");
    setPassword("");
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='logo-container'>
          <img src={logo} alt='Logo' className='logo' />
        </div>
        <Typography variant='h5' className='login-title'>
          Login
        </Typography>
        <Typography variant='body2' className='login-subtitle' sx={{ mb: 2 }}>
          This device is currently not logged in. Please enter the credentials
          to access your account.
        </Typography>
        <form onSubmit={handleLogin} className='login-form'>
          {error && <Typography className='error-message'>{error}</Typography>}

          {/* Material-UI Username Field */}
          <TextField
            label='Email'
            variant='outlined'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          {/* Material-UI Password Field */}
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember Me + Forgot Password */}
          <div className='remember-container'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  color='primary'
                />
              }
              label={
                <Typography style={{ color: "#ffffff" }}>
                  Remember me
                </Typography>
              }
            />
            <a href='/forgot-password' className='forgot-password'>
              Forgot Password?
            </a>
          </div>
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
            Login
          </Button>
        </form>
        <a href='/register' className='admin-link'>
          Don&apos;t have an account? Register here
        </a>
      </div>
      <img className='left-background' src={leftBackground} alt='' />
      <img className='right-background' src={rightBackground} alt='' />
    </div>
  );
};

export default LoginPage;
