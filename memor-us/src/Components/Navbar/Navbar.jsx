import { useState } from "react";
import { NavLink } from "react-router-dom";
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
import logo from "../../assets/images/logoText.svg";
import profileIcon from "../../assets/images/profile.svg";

// Custom styled NavLink for active and hover states
const StyledNavLink = styled(NavLink)(() => ({
  textDecoration: "none",
  color: "#D0BCFE",
  borderRadius: "20px",
  fontWeight: 600,
  padding: "6px 12px",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(40, 40, 49, 1)",
    color: "#D0BCFE",
  },
  "&.active": {
    backgroundColor: "#D0BCFE",
    color: "#381E72",
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <NavLink to='/'>
            <img
              src={logo}
              alt='logo'
              style={{ height: "40px", width: "auto" }}
            />
          </NavLink>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <StyledNavLink to='/' end>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Home
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/memors'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Memors
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/leaderboard'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Leaderboard
            </Typography>
          </StyledNavLink>
          <StyledNavLink to='/memoryBoard'>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Memory Board
            </Typography>
          </StyledNavLink>
          {/* Profile Icon and Dropdown Menu */}
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
                  <Typography variant='body2' sx={{ color: "#00C896" }}>
                    The Debuggers
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ backgroundColor: "gray" }} />
              <MenuItem
                onClick={handleMenuClose}
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
                onClick={handleMenuClose}
                sx={{
                  color: "#FF5C5C",
                  "&:hover": {
                    backgroundColor: "#ff0000 ",
                  },
                }}
              >
                <Typography variant='body1' sx={{}}>
                  Log Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
