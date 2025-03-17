import { useState, useEffect } from "react";
import logo from "../assets/images/logo.svg";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";
import { TextField, Button } from "@mui/material";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = `Memor'us | Register`;
  }, []);

  const demoUsers = [];

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Check if the email already exists in demoUsers
    const userExists = demoUsers.some((user) => user.email === email);
    if (userExists) {
      setError("User with this email already exists!");
      return;
    }

    // Simulate user registration
    demoUsers.push({
      email,
      password,
      role: "Regular", // Default role for demo
    });

    setSuccess("Registration successful! You can now log in.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='logo-container'>
          <img src={logo} alt='Logo' className='logo' />
        </div>
        <h2 className='login-title'>Register</h2>
        <p className='login-subtitle'>
          Create your account to get started. Enter your details below.
        </p>
        <form onSubmit={handleRegister} className='login-form'>
          {error && <p className='error-message'>{error}</p>}
          {success && <p className='success-message'>{success}</p>}

          <TextField
            label='Email'
            type='email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#2c2c2c",
                color: "#ffffff",
                borderRadius: "8px",
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

          <TextField
            label='Password'
            type='password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#2c2c2c",
                color: "#ffffff",
                borderRadius: "8px",
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

          <TextField
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#2c2c2c",
                color: "#ffffff",
                borderRadius: "8px",
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

          <Button
            type='submit'
            variant='contained'
            fullWidth
            sx={{
              backgroundColor: "#6200ea",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "10px 0",
              "&:hover": {
                backgroundColor: "#4e00d1",
              },
            }}
          >
            Register
          </Button>
        </form>
        <a href='/login' className='admin-link'>
          Already have an account? Login here
        </a>
      </div>
      <img className='left-background' src={leftBackground} alt='' />
      <img className='right-background' src={rightBackground} alt='' />
    </div>
  );
};

export default RegisterPage;
