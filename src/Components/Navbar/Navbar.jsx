// Changes for src/Components/Navbar/Navbar.jsx

import { useState, useEffect } from "react";
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
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logoText.svg";
import profileIcon from "../../assets/images/profile.svg";
import notifDelete from "../../assets/images/notifDelete.svg";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { Badge } from "@mui/material";
import { makeStyles } from "@mui/styles";
import toast from "react-hot-toast";
import notifPurple from "../../assets/images/notifPurple.svg";
import notifGreen from "../../assets/images/notifGreen.svg";

import {
  getLeaderboardVisibility,
  setLeaderboardVisibility,
} from "../../assets/utils/leaderboardUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";

const useStyles = makeStyles({
  customBadge: {
    backgroundColor: "#42102B",
    color: "#fff",
  },
});

const NotificationItem = ({ notification, onDelete, onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#272A2C",
        padding: "10px",
        marginBottom: "8px",
        "&:hover": {
          backgroundColor: "#323537",
          cursor: "pointer",
        },
      }}
      onClick={notification.memorId ? () => onClick(notification) : null}
    >
      
      <IconButton
        src={notification.read ? notifPurple : notifGreen}
        alt='Notification Icon'
        style={{ width: 28, height: 28 }}
      />
      <Box sx={{ flexGrow: 1, paddingLeft: 2 }}>
        <Typography
          variant='subtitle1'
          sx={{ color: "#fff", lineHeight: 1.2, marginBottom: 1 }}
        >
          {notification.title}
        </Typography>
        <Typography variant='body2' sx={{ color: "#aaa" }}>
          {notification.description}
        </Typography>
      </Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        sx={{ color: "#ff1744" }}
      >
        <img
          src={notifDelete}
          alt='Delete Icon'
          style={{ width: 24, height: 24 }}
        />
      </IconButton>
    </Box>
  );
};

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
  const { user, setToken, setUser, token } = useAuth();
  const navigate = useNavigate();

  const [showLeaderboard, setShowLeaderboard] = useState(
    getLeaderboardVisibility()
  );

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const toggleLeaderboard = () => {
    const newValue = !showLeaderboard;
    setShowLeaderboard(newValue);
    setLeaderboardVisibility(newValue);

    if (!newValue) {
      navigate("/home");
    }
    window.dispatchEvent(new Event("storage"));
  };

  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token || !user) return;
      
      setLoadingNotifications(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || user.tenant,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    
    // Set up a polling interval to check for new notifications
    const intervalId = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [token, user]);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowLeaderboard(getLeaderboardVisibility());
    };

    // Set initial value
    setShowLeaderboard(getLeaderboardVisibility());

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

    setUser(null);
    setToken(null);

    setAnchorEl(null);

    toast.success("You've been logged out successfully 👋");
    navigate("/login");
  };

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
    
    // Mark all notifications as read when opening the menu
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };
  
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  
  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": user.tenant_subdomain || user.tenant,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      toast.success("Notification removed");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": user.tenant_subdomain || user.tenant,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update the local state to mark as read
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/notifications`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": user.tenant_subdomain || user.tenant,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear notifications');
      }

      setNotifications([]);
      toast.success("All notifications removed");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };
  
  const handleNotificationClick = (notification) => {
    // Navigate to the memor details page if it's a memor-related notification
    if (notification.memorId) {
      navigate(`/memors/${notification.memorId}`);
      handleNotifClose();
    }
  };

  // Get unread notification count
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const classes = useStyles();

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: "#111315",
        height: "60px",
        boxShadow: "none",
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
          <NavLink to='/home'>
            <img
              src={logo}
              alt='Memorus Logo'
              style={{ height: "40px", width: "auto" }}
            />
          </NavLink>
        </Box>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: "24px",
            alignItems: "center",
          }}
        >
          <StyledNavLink to='/home' end>
            Home
          </StyledNavLink>
          <StyledNavLink to='/memors'>Memors</StyledNavLink>
          {showLeaderboard && (
            <StyledNavLink to='/leaderboard'>Leaderboard</StyledNavLink>
          )}
          <StyledNavLink to='/memoryBoard'>Memory Board</StyledNavLink>
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
                  <Typography variant='body2' color="gray">
                    {user?.email}
                  </Typography>
                  <Typography variant='body2' sx={{ color: "#00C896" }}>
                    {user?.team}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ backgroundColor: "gray" }} />
              <MenuItem
                onClick={() => {
                  toggleLeaderboard();
                  handleMenuClose();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#181818",
                    color: "#FFFFFF",
                  },
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  {showLeaderboard ? "Hide" : "Show"} Leaderboard
                </Typography>
                <IconButton sx={{ color: "white" }}>
                  {showLeaderboard ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/change-password");
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
          <Box>
            <IconButton onClick={handleNotifClick}>
              <Badge
                badgeContent={unreadCount}
                classes={{ badge: classes.customBadge }}
              >
                <NotificationsNoneRoundedIcon
                  sx={{ color: "#D0BCFE", fontSize: "30px" }}
                />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              PaperProps={{
                style: {
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  width: "400px",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Typography variant='body1' sx={{ color: "#fff" }}>
                  Notifications ({notifications.length})
                </Typography>
                <Button
                  variant='text'
                  sx={{ color: "#fff" }}
                  onClick={handleMarkAllRead}
                  disabled={notifications.length === 0}
                >
                  Remove All
                </Button>
              </Box>
              <Box sx={{ maxHeight: "300px", overflowY: "auto", padding: "0 10px" }}>
                {loadingNotifications ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} sx={{ color: '#d0bcfe' }} />
                  </Box>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDeleteNotification}
                      onClick={handleNotificationClick}
                    />
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center', color: '#888' }}>
                    No notifications
                  </Box>
                )}
              </Box>
            </Menu>
          </Box>
        </Box>

        {/* Mobile Burger Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#D0BCFE" }} />
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
              <Typography variant='body2' color="gray">
                {user?.email}
              </Typography>
              <Typography variant='body2' sx={{ color: "#00C896" }}>
                {user?.team}
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
              <StyledNavLink to='/home' onClick={toggleDrawer(false)}>
                Home
              </StyledNavLink>
              <StyledNavLink to='/memors' onClick={toggleDrawer(false)}>
                Memors
              </StyledNavLink>
              {showLeaderboard && (
                <StyledNavLink to='/leaderboard' onClick={toggleDrawer(false)}>
                  Leaderboard
                </StyledNavLink>
              )}
              <StyledNavLink to='/memoryBoard' onClick={toggleDrawer(false)}>
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
                variant='body2'
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

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    memorId: PropTypes.number,
    read: PropTypes.bool
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Navbar;