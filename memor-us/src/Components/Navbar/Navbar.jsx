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
  Drawer,
  List,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/images/logoText.svg";
import profileIcon from "../../assets/images/profile.svg";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    setAnchorEl(null);
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="sticky"
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
          <NavLink to="/home">
            <img
              src={logo}
              alt="Memorus Logo"
              style={{ height: "40px", width: "auto" }}
            />
          </NavLink>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: "24px", alignItems: "center" }}>
          <StyledNavLink to="/home" end>
            Home
          </StyledNavLink>
          <StyledNavLink to="/memors">Memors</StyledNavLink>
          <StyledNavLink to="/leaderboard">Leaderboard</StyledNavLink>
          <StyledNavLink to="/memoryBoard">Memory Board</StyledNavLink>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <img
                src={profileIcon}
                alt="User Profile"
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
                <Box sx={{ cursor: "default" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Jane Doe
                  </Typography>
                  <Typography variant="body2" color="gray">
                    jane.doe@example.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#00C896" }}>
                    The Debuggers
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
                Change Password
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
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Mobile Burger Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#D0BCFE" }} />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#111315",
                color: "#fff",
                width: "250px",
              },
            }}
          >
            {/* User Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
              }}
            >
              <img
                src={profileIcon}
                alt="User Profile"
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Jane Doe
              </Typography>
              <Typography variant="body2" color="gray">
                jane.doe@example.com
              </Typography>
              <Typography variant="body2" sx={{ color: "#00C896" }}>
                The Debuggers
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "#444" }} />
            {/* Navigation Links */}
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <StyledNavLink to="/home" onClick={toggleDrawer(false)}>
                Home
              </StyledNavLink>
              <StyledNavLink to="/memors" onClick={toggleDrawer(false)}>
                Memors
              </StyledNavLink>
              <StyledNavLink to="/leaderboard" onClick={toggleDrawer(false)}>
                Leaderboard
              </StyledNavLink>
              <StyledNavLink to="/memoryBoard" onClick={toggleDrawer(false)}>
                Memory Board
              </StyledNavLink>
            </List>
            <Divider sx={{ backgroundColor: "#444", marginTop: "20px" }} />
            {/* Change Password and Log Out */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "#FFF",
                  "&:hover": { color: "#ccff33" },
                }}
                onClick={() => {
                  navigate("/change-password");
                  toggleDrawer(false)();
                }}
              >
                Change Password
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "#FF5C5C",
                  "&:hover": { color: "#FF3333" },
                }}
                onClick={handleLogOut}
              >
                Log Out
              </Typography>
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;