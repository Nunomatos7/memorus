import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
import logo from "../../assets/images/logoAdmin.svg";
import profileIcon from "../../assets/images/profileAdmin.svg";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const StyledNavLink = styled(NavLink)(() => ({
  textDecoration: "none",
  color: "#82D5C7",
  borderRadius: "20px",
  fontWeight: 600,
  padding: "6px 12px",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    color: "#82D5C7",
    backgroundColor: "rgba(130, 213, 199, 0.12)",
  },
  "&.active": {
    backgroundColor: "#82d5c7",
    color: "#003731",
  },
}));

const AdminNavbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMemoryBoard = location.pathname
    .toLowerCase()
    .includes("/memoryboard");

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
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

    setAnchorEl(null);

    toast.success("Logged out successfully 👋");
    navigate("/app/admin/login");
  };

  return (
    <AppBar
      position={isMemoryBoard ? "fixed" : "sticky"}
      sx={{
        backgroundColor: isMemoryBoard ? "transparent" : "#111315",
        height: "60px",
        boxShadow: "none",
        borderBottom: isMemoryBoard ? "none" : "1px solid #444444",
        opacity: isMemoryBoard ? 0.3 : 1,
        transition: "all 0.3s ease",
        zIndex: 1100,
        top: 0,
        left: 0,
        right: 0,
        "&:hover": {
          opacity: 1,
          backgroundColor: isMemoryBoard ? "rgba(17, 19, 21, 0.95)" : "#111315",
          backdropFilter: isMemoryBoard ? "blur(10px)" : "none",
        },
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
        <Box>
          <NavLink to='/app/admin/home'>
            <img
              src={logo}
              alt='Admin Dashboard Logo'
              style={{ height: "40px", width: "auto" }}
            />
          </NavLink>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: "24px",
            alignItems: "center",
          }}
        >
          <StyledNavLink to='/app/admin/home' end>
            Home
          </StyledNavLink>
          <StyledNavLink to='/app/admin/leaderboard'>Leaderboard</StyledNavLink>
          <StyledNavLink to='/app/admin/memoryBoard'>
            Memory Board
          </StyledNavLink>
          <StyledNavLink to='/app/admin/adminBoard'>Admin Board</StyledNavLink>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <img
                src={profileIcon}
                alt='User Profile'
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
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant='body2' color='gray'>
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ backgroundColor: "gray" }} />
              <MenuItem
                onClick={() => {
                  navigate("/app/change-password");
                  handleMenuClose();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#181818",
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
                    backgroundColor: "#181818 ",
                  },
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Mobile Drawer */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#82D5C7" }} />
          </IconButton>
          <Drawer
            anchor='right'
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
                alt='User Profile'
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                }}
              />
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant='body2' color='gray'>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "#444" }} />
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <StyledNavLink to='/app/admin/home' onClick={toggleDrawer(false)}>
                Home
              </StyledNavLink>
              <StyledNavLink
                to='/app/admin/leaderboard'
                onClick={toggleDrawer(false)}
              >
                Leaderboard
              </StyledNavLink>
              <StyledNavLink
                to='/app/admin/memoryBoard'
                onClick={toggleDrawer(false)}
              >
                Memory Board
              </StyledNavLink>
              <StyledNavLink
                to='/app/admin/adminBoard'
                onClick={toggleDrawer(false)}
              >
                Admin Board
              </StyledNavLink>
            </List>
            <Divider sx={{ backgroundColor: "#444", marginTop: "20px" }} />
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
                variant='body2'
                sx={{
                  cursor: "pointer",
                  color: "#FFF",
                  "&:hover": { color: "#ccff33" },
                }}
                onClick={() => {
                  navigate("/app/change-password");
                  toggleDrawer(false)();
                }}
              >
                Change Password
              </Typography>
              <Typography
                variant='body2'
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

export default AdminNavbar;
