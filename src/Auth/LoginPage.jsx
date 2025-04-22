import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState("");

  const getTenantFromSubdomain = () => {
    const host = window.location.hostname;
    console.log("Current hostname:", host);

    // Em dev: "loba.localhost" → ["loba", "localhost"]
    // Em prod: "loba.memor-us.com" → ["loba", "memor-us", "com"]
    const parts = host.split(".");

    if (host.includes("localhost")) {
      return parts.length > 1 ? parts[0] : null;
    }

    // produção — assume que subdomínio está no início
    if (parts.length >= 3) {
      return parts[0];
    }

    return null;
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Memor'us | Login`;

    // Set tenant on component mount
    const detectedTenant = getTenantFromSubdomain();
    console.log("Detected tenant:", detectedTenant);
    if (detectedTenant) {
      setTenant(detectedTenant.toLowerCase());
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const tenant = getTenantFromSubdomain()?.toLowerCase();

      if (!tenant) {
        setError("Invalid tenant.");
        return;
      }

      console.log(`Attempting login for ${email} on tenant ${tenant}`);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
          },
          credentials: "include",
          body: JSON.stringify({ email, password, tenant }),
        }
      );

      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error("Invalid response from server - no token");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);

      // Parse the token
      const parts = data.token.split(".");
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      const payload = JSON.parse(atob(padded));
      payload.role = payload.roles?.[0]?.toLowerCase();

      setUser(payload);
      setToken(data.token);

      // Navigate to appropriate page
      navigate(payload.role === "admin" ? "/admin/home" : "/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message || "Error logging in. Please check your credentials."
      );
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
          Login {tenant && `(${tenant})`}
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
              href='/change-password'
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

export default LoginPage;
