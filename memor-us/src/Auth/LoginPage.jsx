import { useState, useEffect } from "react";
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
  useEffect(() => {
    document.title = `Memor'us | Login`;
  }, []);

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
    <div className='login-container' role='main'>
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
          aria-label='Back to Landing Page'
        >
          Back to Landing
        </Button>
      </div>
      <div className='login-card'>
        <div className='logo-container'>
          <img src={logo} alt='Memor-us Logo' className='logo' />
        </div>
        <Typography variant='h5' className='login-title' id='login-title'>
          Login
        </Typography>
        <Typography variant='body2' className='login-subtitle' sx={{ mb: 2 }}>
          This device is currently not logged in. Please enter the credentials
          to access your account.{" "}
          <span style={{ color: "rgb(146,130,249)" }}>* = required </span>
        </Typography>
        <form
          onSubmit={handleLogin}
          className='login-form'
          aria-labelledby='login-title'
        >
          {error && (
            <Typography
              className='error-message'
              role='alert'
              aria-live='assertive'
            >
              {error}
            </Typography>
          )}
          <TextField
            id='email-input'
            label='Email'
            variant='outlined'
            fullWidth
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            aria-required='true'
            aria-invalid={email === "" && error ? "true" : "false"}
            inputProps={{
              "aria-label": "Email address",
            }}
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

          <TextField
            id='password-input'
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required='true'
            aria-invalid={password === "" && error ? "true" : "false"}
            inputProps={{
              "aria-label": "Password",
            }}
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

          <div className='remember-container'>
            <FormControlLabel
              control={
                <Checkbox
                  id='remember-me-checkbox'
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  inputProps={{
                    "aria-label": "Remember me checkbox",
                  }}
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
            <a
              href='/forgot-password'
              className='forgot-password'
              aria-label='Forgot Password'
            >
              Forgot Password?
            </a>
          </div>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            className='login-button'
            aria-label='Login to your account'
            sx={{
              backgroundColor: "#6200ea",
              "&:hover": { backgroundColor: "#4e00d1" },
            }}
          >
            Login
          </Button>
        </form>
        <a
          href='/register'
          className='admin-link'
          aria-label='Register for a new account'
        >
          Don&apos;t have an account? Register here
        </a>
      </div>
      <img
        className='left-background'
        src={leftBackground}
        alt=''
        aria-hidden='true'
      />
      <img
        className='right-background'
        src={rightBackground}
        alt=''
        aria-hidden='true'
      />
    </div>
  );
};

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginPage;
