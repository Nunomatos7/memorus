import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress
} from "@mui/material";
import background1 from "../../assets/images/background1.svg";
import background2 from "../../assets/images/background2.svg";
import background3 from "../../assets/images/background3.svg";
import PropTypes from "prop-types";

/**
 * TeamGuard - A component that restricts access to the application for users not assigned to a team
 * Displays a message explaining that team assignment is required to use the platform
 */
const TeamGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const [adminEmail, setAdminEmail] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Attempt to fetch admin contact information
  useEffect(() => {
    const fetchAdminContact = async () => {
      if (!user?.tenant_subdomain) return;
      
      try {
        setLoadingAdmin(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "X-Tenant": user.tenant_subdomain
          }
        });
        
        if (response.ok) {
          const users = await response.json();
          // Find the first user with admin role
          for (const potentialAdmin of users) {
            try {
              const rolesResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users/${potentialAdmin.id}/roles`, 
                {
                  headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "X-Tenant": user.tenant_subdomain
                  }
                }
              );
              
              if (rolesResponse.ok) {
                const roles = await rolesResponse.json();
                if (roles.some(role => role.title === "admin")) {
                  setAdminEmail(potentialAdmin.email);
                  break;
                }
              }
            } catch (error) {
              console.error("Error fetching user roles:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };
    
    fetchAdminContact();
  }, [user?.tenant_subdomain]);

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#111315"
        }}
      >
        <CircularProgress sx={{ color: "#d0bcfe" }} />
      </Box>
    );
  }

  // If user has a team, render the children (normal app content)
  if (user?.teamsId) {
    return children;
  }

  // If no team, display the restricted message
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#111315",
        padding: "20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background elements */}
      <img
        src={background1}
        alt=""
        style={{
          position: "absolute",
          top: "2",
          right: "0",
          width: "15%",
          zIndex: "0",
        }}
        aria-hidden="true"
      />
      <img
        src={background2}
        alt=""
        style={{
          position: "absolute",
          top: "25%",
          left: "5%",
          width: "5%",
          zIndex: "0",
        }}
        aria-hidden="true"
      />
      <img
        src={background3}
        alt=""
        style={{
          position: "absolute",
          top: "35%",
          right: "6%",
          width: "5%",
          zIndex: "0",
        }}
        aria-hidden="true"
      />

      {/* Message card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          textAlign: "center",
          backgroundColor: "#1e1f20",
          borderRadius: "16px",
          border: "1px solid #333738",
          position: "relative",
          zIndex: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#d0bcfe", fontWeight: "bold" }}>
          Team Assignment Required
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: "white", my: 3 }}>
          Welcome to Memor&apos;us! To participate in competitions and submit memors, you need to be assigned to a team. 
          Please contact your administrator to request team assignment.
        </Typography>
        
        {loadingAdmin ? (
          <CircularProgress size={20} sx={{ color: "#d0bcfe", my: 2 }} />
        ) : adminEmail ? (
          <Box sx={{ my: 3 }}>
            <Typography variant="body1" sx={{ color: "#aaa" }}>
              You can contact your administrator at:
            </Typography>
            <Typography variant="body1" sx={{ color: "#d0bcfe", fontWeight: "bold", my: 1 }}>
              {adminEmail}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#aaa", my: 2 }}>
            Please check with your organization for your administrator&apos;s contact information.
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#d0bcfe",
            color: "#381e72",
            "&:hover": {
              bgcolor: "#b39ddb"
            }
          }}
          onClick={() => {
            if (user) {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }
          }}
        >
          Return to Login
        </Button>
      </Paper>
    </Box>
  );
};

TeamGuard.propTypes = {
  children: PropTypes.node.isRequired
};

export default TeamGuard;