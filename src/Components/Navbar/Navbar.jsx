import { useState, useEffect } from "react";
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

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import {
  getLeaderboardVisibility,
  setLeaderboardVisibility,
  LEADERBOARD_VISIBILITY_CHANGE,
} from "../../assets/utils/leaderboardUtils";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const useStyles = makeStyles({
  customBadge: {
    backgroundColor: "#42102B",
    color: "#fff",
  },
});

const NotificationItem = ({ notification, onDelete, onClick }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "due_soon":
        return notifPurple;
      case "new_memor":
        return notifGreen;
      default:
        return notifGreen;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#272A2C",
        padding: "10px",
        marginBottom: "8px",
        borderRadius: "8px",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#323537",
          cursor: notification.memorId ? "pointer" : "default",
        },
      }}
      onClick={notification.memorId ? () => onClick(notification) : null}
    >
      <img
        src={getNotificationIcon(notification.type)}
        alt='Notification Icon'
        style={{ 
          width: 28, 
          height: 28, 
          marginRight: 8,
          opacity: notification.read ? 0.6 : 1,
        }}
      />
      <Box sx={{ flexGrow: 1, paddingLeft: 1 }}>
        <Typography
          variant='subtitle1'
          sx={{ 
            color: notification.read ? "#aaa" : "#fff", 
            lineHeight: 1.2, 
            marginBottom: 0.5,
            fontWeight: notification.read ? "normal" : "bold",
          }}
        >
          {notification.title}
        </Typography>
        <Typography 
          variant='body2' 
          sx={{ 
            color: notification.read ? "#888" : "#ccc",
            fontSize: "0.85rem",
          }}
        >
          {notification.description}
        </Typography>
        {notification.points && (
          <Typography 
            variant='caption' 
            sx={{ 
              color: "#82D5C7",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            +{notification.points} points
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        sx={{ 
          color: "#ff1744",
          padding: "4px",
          "&:hover": {
            backgroundColor: "rgba(255, 23, 68, 0.1)",
          },
        }}
      >
        <img
          src={notifDelete}
          alt='Delete Icon'
          style={{ width: 20, height: 20 }}
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
  const { user, clearSession, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMemoryBoard = location.pathname
    .toLowerCase()
    .includes("/memoryboard");

  const [showLeaderboard, setShowLeaderboard] = useState(
    getLeaderboardVisibility()
  );

  // 🚀 NEW: Updated notification state management
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const toggleLeaderboard = () => {
    const newValue = !showLeaderboard;
    setShowLeaderboard(newValue);
    setLeaderboardVisibility(newValue);
  };

  // 🚀 NEW: Improved notification fetching
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token || !user) return;

      setLoadingNotifications(true);
      setNotificationError(null);
      
      try {
        console.log("📬 Fetching notifications...");
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain || user.tenant,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Fetched ${data.length} notifications`);
        setNotifications(data);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        setNotificationError(error.message);
        // Don't show error toast on every fetch, just log it
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [token, user]);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowLeaderboard(getLeaderboardVisibility());
    };

    setShowLeaderboard(getLeaderboardVisibility());

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(LEADERBOARD_VISIBILITY_CHANGE, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        LEADERBOARD_VISIBILITY_CHANGE,
        handleStorageChange
      );
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
    console.log("🚪 Regular user logging out...");

    // Clear session using the proper method
    clearSession();

    // Close menu
    setAnchorEl(null);

    // Show success toast
    toast.success("You've been logged out successfully 👋");

    // Navigate to login page
    navigate("/app/login");
  };

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  
  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);

    // 🚀 NEW: Mark all unread notifications as read when opening the menu
    const unreadNotifications = notifications.filter(notif => !notif.read);
    unreadNotifications.forEach((notification) => {
      markNotificationAsRead(notification.id);
    });
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  // 🚀 NEW: Updated notification handlers
  const handleDeleteNotification = async (id) => {
    try {
      console.log(`🗑️ Deleting notification ${id}`);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || user.tenant,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove from local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );

      toast.success("Notification removed");
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || user.tenant,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      console.log("🧹 Clearing all notifications");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/notifications`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || user.tenant,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear notifications");
      }

      setNotifications([]);
      toast.success("All notifications removed");
    } catch (error) {
      console.error("❌ Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.memorId) {
      console.log(`🎯 Navigating to memor ${notification.memorId}`);
      navigate(`/app/memors/${notification.memorId}`);
      handleNotifClose();
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const classes = useStyles();

  const getTeamName = () => {
    if (!user) return "";
    if (typeof user.team === "string") return user.team;
    if (user.team && typeof user.team === "object" && user.team.name)
      return user.team.name;
    return "";
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
          <NavLink to='/app/home'>
            <img
              src={logo}
              alt='Memorus Logo'
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
          <StyledNavLink to='/app/home' end>
            Home
          </StyledNavLink>
          <StyledNavLink to='/app/memors'>Memors</StyledNavLink>
          {showLeaderboard && (
            <StyledNavLink to='/app/leaderboard'>Leaderboard</StyledNavLink>
          )}
          <StyledNavLink to='/app/memoryBoard'>Memory Board</StyledNavLink>
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
                  <Typography variant='body2' sx={{ color: "#00C896" }}>
                    {getTeamName()}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ backgroundColor: "gray" }} />
              <MenuItem
                onClick={() => {
                  navigate("/app/profile");
                  handleMenuClose();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#181818",
                    color: "#FFFFFF",
                  },
                }}
              >
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1, fontSize: "1rem" }} />
                  My Profile
                </Typography>
              </MenuItem>
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
                <IconButton sx={{ color: "white", paddingLeft: 0, ml: -0.5 }}>
                  {showLeaderboard ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
                <Typography>
                  {showLeaderboard ? "Hide" : "Show"} Leaderboard
                </Typography>
              </MenuItem>
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
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <LockIcon sx={{ mr: 1, fontSize: "1rem" }} />
                  Change Password
                </Typography>
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
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <ExitToAppIcon sx={{ mr: 1, fontSize: "1rem" }} />
                  Log Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          {/* 🚀 NEW: Updated notification menu */}
          <Box>
            <IconButton onClick={handleNotifClick}>
              <Badge
                badgeContent={unreadCount}
                classes={{ badge: classes.customBadge }}
                max={99}
              >
                <NotificationsNoneRoundedIcon
                  sx={{ 
                    color: unreadCount > 0 ? "#D0BCFE" : "#D0BCFE", 
                    fontSize: "30px",
                    animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                  }}
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
                  width: "420px",
                  maxHeight: "500px",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #333",
                }}
              >
                <Typography variant='h6' sx={{ color: "#fff", fontWeight: "bold" }}>
                  Notifications ({notifications.length})
                </Typography>
                <Button
                  variant='text'
                  sx={{ 
                    color: "#82D5C7",
                    fontSize: "0.85rem",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(130, 213, 199, 0.1)",
                    },
                  }}
                  onClick={handleMarkAllRead}
                  disabled={notifications.length === 0}
                >
                  Clear All
                </Button>
              </Box>
              
              <Box
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "8px",
                }}
              >
                {loadingNotifications ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress size={24} sx={{ color: "#d0bcfe" }} />
                    <Typography sx={{ ml: 2, color: "#888" }}>
                      Loading notifications...
                    </Typography>
                  </Box>
                ) : notificationError ? (
                  <Box sx={{ p: 2, textAlign: "center", color: "#ff6b6b" }}>
                    <Typography variant="body2">
                      Failed to load notifications
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {notificationError}
                    </Typography>
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
                  <Box sx={{ p: 3, textAlign: "center", color: "#888" }}>
                    <Typography variant="body1">🔔</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      No notifications yet
                    </Typography>
                    <Typography variant="caption">
                      You'll be notified about new memors and due dates
                    </Typography>
                  </Box>
                )}
              </Box>
            </Menu>
          </Box>
        </Box>

        {/* Mobile Drawer */}
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
              <Typography variant='body2' sx={{ color: "#00C896" }}>
                {getTeamName()}
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
              <StyledNavLink to='/app/home' onClick={toggleDrawer(false)}>
                Home
              </StyledNavLink>
              <StyledNavLink to='/app/memors' onClick={toggleDrawer(false)}>
                Memors
              </StyledNavLink>
              {showLeaderboard && (
                <StyledNavLink
                  to='/app/leaderboard'
                  onClick={toggleDrawer(false)}
                >
                  Leaderboard
                </StyledNavLink>
              )}
              <StyledNavLink
                to='/app/memoryBoard'
                onClick={toggleDrawer(false)}
              >
                Memory Board
              </StyledNavLink>
              <StyledNavLink to='/app/profile' onClick={toggleDrawer(false)}>
                My Profile
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

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    memorId: PropTypes.number,
    points: PropTypes.number,
    read: PropTypes.bool,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Navbar;