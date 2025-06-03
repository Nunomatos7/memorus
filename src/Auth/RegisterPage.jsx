import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import leftBackground from "../assets/images/left-auth.svg";
import rightBackground from "../assets/images/right-auth.svg";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Memor'us | Register`;
  }, []);

  const getTenantFromSubdomain = () => {
    const host = window.location.hostname;

    // In dev: "loba.localhost" → ["loba", "localhost"]
    // In prod: "loba.memor-us.com" → ["loba", "memor-us", "com"]
    const parts = host.split(".");

    if (host.includes("localhost")) {
      return parts.length > 1 ? parts[0] : null;
    }

    // production — assumes subdomain is at the beginning
    if (parts.length >= 3) {
      return parts[0];
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Get tenant from subdomain
    const tenant = getTenantFromSubdomain()?.toLowerCase();

    if (!tenant) {
      setError("Invalid tenant.");
      return;
    }

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Make API call to register endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        }
      );

      // Handle response
      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || "Registration failed");
      }

      // Registration successful
      toast.success("Registration successful! You can now log in.");

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login page
      setTimeout(() => {
        navigate("/app/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='logo-container'>
          <img src={logo} alt="Memor'us Logo" className='logo' />
        </div>
        <Typography variant='h5' className='login-title'>
          Register
        </Typography>
        <Typography variant='body2' className='login-subtitle'>
          Create your account to get started. Enter your details below.
          <span style={{ color: "rgb(146,130,249)" }}> * = required </span>
        </Typography>
        <form onSubmit={handleRegister} className='login-form'>
          {error && <p className='error-message'>{error}</p>}

          {/* Name Fields */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <TextField
              label='First Name'
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              variant='outlined'
              sx={{
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
              label='Last Name'
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              variant='outlined'
              sx={{
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
          </div>

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
          <Typography variant='body2' className='login-subtitle'>
            By creating an account you agree to our
            <a href='/terms' className='consent-link'>
              Terms of Service
            </a>
            and
            <a href='/privacy' className='consent-link'>
              Privacy Policy
            </a>
            .
          </Typography>

          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={isSubmitting}
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
            {isSubmitting ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <a href='/login' className='admin-link'>
          Already have an account? Login here
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

export default RegisterPage;
