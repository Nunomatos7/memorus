import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import logo from "../assets/images/logo.svg";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const LoginPage = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = login(email, password);

      if (user.role === "Admin") {
        navigate("/admin/home");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <div className='login-container'>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <Button
          variant='text'
          startIcon={<ArrowBackIosIcon />}
          href='https://landing.memor-us.com/'
          sx={{
            color: "#ffffff",
            textTransform: "none",
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Back to Landing
        </Button>
      </div>
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
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
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

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginPage;
