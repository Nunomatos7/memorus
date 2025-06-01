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
  const [tenantInput, setTenantInput] = useState("");
  const [showTenantInput, setShowTenantInput] = useState(false);

  const getTenantFromSubdomain = () => {
    const host = window.location.hostname;
    console.log("Current hostname:", host);

    const parts = host.split(".");

    if (host.includes("localhost")) {
      // For localhost, check if there's actually a subdomain
      if (parts.length > 1 && parts[0] !== "localhost") {
        return parts[0];
      }
      return null;
    }

    // For production
    if (parts.length >= 3) {
      // Check if it's www or if it's the main domain
      if (parts[0] === "www") {
        return null;
      }
      return parts[0];
    }

    // If it's just memor-us.com (2 parts), no subdomain
    if (parts.length === 2) {
      return null;
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
      // Tenant detected in URL - proceed with normal login
      setTenant(detectedTenant.toLowerCase());
      setShowTenantInput(false);
    } else {
      // No tenant in URL - show tenant input for redirection
      setShowTenantInput(true);
    }
  }, []);

  const handleTenantConfirm = () => {
    if (!tenantInput.trim()) {
      setError("Please enter a tenant subdomain.");
      return;
    }

    const cleanTenant = tenantInput.trim().toLowerCase();

    // Redirect to the tenant's subdomain URL
    const currentHost = window.location.hostname;
    let newUrl;

    if (currentHost.includes("localhost")) {
      const port = window.location.port;
      newUrl = `http://${cleanTenant}.localhost${port ? ":" + port : ""}`;
    } else {
      newUrl = `https://${cleanTenant}.memor-us.com`;
    }

    console.log("Redirecting to:", newUrl);

    // Redirect to the tenant subdomain
    window.location.href = newUrl;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // CRITICAL: Only use tenant from URL, never from input
      const urlTenant = getTenantFromSubdomain()?.toLowerCase();

      if (!urlTenant) {
        setError(
          "No tenant specified in URL. Please use the correct tenant subdomain."
        );
        return;
      }

      console.log(`Attempting login for ${email} on tenant ${urlTenant}`);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": urlTenant, // Always use URL tenant
          },
          credentials: "include",
          body: JSON.stringify({ email, password, tenant: urlTenant }),
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

  // If we need to show tenant input, show that form instead
  if (showTenantInput) {
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
          <Typography variant='h5' className='login-title'>
            Welcome to Memor'us
          </Typography>
          <Typography variant='body2' className='login-subtitle' sx={{ mb: 3 }}>
            Please type out the subdomain of your tenant
          </Typography>

          {error && (
            <Typography
              className='error-message'
              role='alert'
              aria-live='assertive'
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <TextField
            label='Tenant Subdomain'
            variant='outlined'
            fullWidth
            value={tenantInput}
            onChange={(e) => setTenantInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleTenantConfirm();
              }
            }}
            placeholder='e.g., bosch'
            helperText='Enter your organization subdomain (without .memor-us.com)'
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
              "& .MuiFormHelperText-root": {
                color: "#a9a9a9",
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
            onClick={handleTenantConfirm}
            fullWidth
            variant='contained'
            sx={{
              backgroundColor: "#6200ea",
              "&:hover": { backgroundColor: "#4e00d1" },
              mb: 2,
            }}
          >
            Confirm
          </Button>
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
  }

  // Normal login form (only when tenant is detected in URL)
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
