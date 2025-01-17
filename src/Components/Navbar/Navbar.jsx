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
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logoText.svg";
import profileIcon from "../../assets/images/profile.svg";
import notifPurple from "../../assets/images/notifPurple.svg";
import notifGreen from "../../assets/images/notifGreen.svg";
import notifDelete from "../../assets/images/notifDelete.svg";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { Badge } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  customBadge: {
    backgroundColor: "#42102B",
    color: "#fff",
  },
});

const NotificationItem = ({ notification, onDelete }) => {
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
    >
      <img
        src={notification.image}
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
        onClick={() => onDelete(notification.id)}
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

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      image: notifPurple,
      title: "Less than a day to submit your memor!",
      description: "Don't forget to submit your memor 'Virtual Coffee Break'!",
    },
    {
      id: 2,
      image: notifGreen,
      title: "You've received a new memor",
      description: "A new memor was added to your team's memors.",
    },
    {
      id: 3,
      image: notifGreen,
      title: "You've received a new memor",
      description: "A new memor was added to your team's memors.",
    },
    {
      id: 4,
      image: notifGreen,
      title: "You've received a new memor",
      description: "A new memor was added to your team's memors.",
    },
    
  ]);

  const classes = useStyles();

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: "#111315",
        height: "60px",
        boxShadow: "none",
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
          <StyledNavLink to='/leaderboard'>Leaderboard</StyledNavLink>
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
                    User
                  </Typography>
                  <Typography variant='body2' color='gray'>
                    user@blip.com
                  </Typography>
                  <Typography variant='body2' sx={{ color: "#00C896" }}>
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
                badgeContent={notifications.length}
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
                  backgroundColor: "#232627",
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
                >
                  Remove All
                </Button>
              </Box>
              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDeleteNotification}
                  />
                ))}
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
                Jane Doe
              </Typography>
              <Typography variant='body2' color='gray'>
                jane.doe@example.com
              </Typography>
              <Typography variant='body2' sx={{ color: "#00C896" }}>
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
              <StyledNavLink to='/home' onClick={toggleDrawer(false)}>
                Home
              </StyledNavLink>
              <StyledNavLink to='/memors' onClick={toggleDrawer(false)}>
                Memors
              </StyledNavLink>
              <StyledNavLink to='/leaderboard' onClick={toggleDrawer(false)}>
                Leaderboard
              </StyledNavLink>
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

export default Navbar;
