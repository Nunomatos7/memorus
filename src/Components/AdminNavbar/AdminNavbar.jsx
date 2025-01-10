import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../assets/images/logoAdmin.svg";
import profileIcon from "../../assets/images/profileAdmin.svg";

// Custom styled NavLink for active and hover states
const StyledNavLink = styled(NavLink)(() => ({
  textDecoration: "none",
  color: "#82D5C7",
  borderRadius: "20px",
  fontWeight: 600,
  padding: "6px 12px",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    color: "#82D5C7",
    backgroundColor:
      "var(--State-Layers-Primary-Opacity-12, rgba(130, 213, 199, 0.12));",
  },
  "&.active": {
    backgroundColor: "#82d5c7",
    color: "#003731",
  },
}));

const AdminNavbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Close the dropdown menu
    setAnchorEl(null);

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: "#111315",
        height: "60px",
        boxShadow: "none",
        zIndex: 10,
        marginBottom: "10px",
        borderBottom: "1px solid #444444",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "95%",
          margin: "auto",
        }}
      >
        {/* Logo */}
        <Box>
          <NavLink to='/admin'>
            <img
              src={logo}
              alt='logo'
              style={{ height: "40px", width: "auto" }}
            />
          </NavLink>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <StyledNavLink to='/admin' end>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Home
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/admin/leaderboard'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Leaderboard
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/admin/memoryBoard'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Memory Board
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/admin/adminBoard'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Admin Board
            </Typography>
          </StyledNavLink>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <img
                src={profileIcon}
                alt='profile'
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                "& .MuiMenu-paper": {
                  backgroundColor: "#1e1e1e",
                  color: "#fff",
                },
              }}
            >
              <MenuItem>
                <Box
                  sx={{
                    cursor: "default",
                    "&:hover": {
                      backgroundColor: "#39ff14 ",
                    },
                  }}
                >
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    User
                  </Typography>
                  <Typography variant='body2' color='gray'>
                    memorus.user@ua.blip.pt
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ backgroundColor: "gray" }} />
              <MenuItem
                onClick={() => {
                  navigate("/change-password");
                  handleMenuClose();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#ccff33",
                    color: "#FFFFFF",
                  },
                }}
              >
                <Typography variant='body1'>Change Password</Typography>
              </MenuItem>

              <MenuItem
                onClick={handleLogOut}
                sx={{
                  color: "#FF5C5C",
                  "&:hover": {
                    backgroundColor: "#ff0000 ",
                  },
                }}
              >
                <Typography variant='body1'>Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
