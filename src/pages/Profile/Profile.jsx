import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../../context/AuthContext";
import background1 from "../../assets/images/background1.svg";
import background2 from "../../assets/images/background2.svg";
import background3 from "../../assets/images/background3.svg";
import { toast } from "react-hot-toast";
import Loader from "../../Components/Loader/Loader";

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    completedMemors: 0,
    teamRank: "-",
    totalPoints: 0,
  });

  useEffect(() => {
    document.title = `Memor'us | Profile`;
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
      fetchUserStats();
      setLoading(false);
    }
  }, [user]);

  // Add an additional effect to fetch team details if teamsId is present but team name is missing
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (user?.teamsId && !user?.team?.name && token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/teams/${user.teamsId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain || "",
              },
            }
          );

          if (response.ok) {
            const teamData = await response.json();
            // Update the user context with team information
            setUser({
              ...user,
              team: {
                id: teamData.id,
                name: teamData.name,
                avatar: teamData.avatar,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching team details:", error);
        }
      }
    };

    fetchTeamDetails();
  }, [user?.teamsId, user?.team?.name, token, user, setUser]);

  const fetchUserStats = async () => {
    if (!token || !user || !user.teamsId) return;

    try {
      // Fetch any active competition first
      const compResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/competitions/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || "",
          },
        }
      );

      if (!compResponse.ok) {
        throw new Error("Failed to fetch active competition");
      }

      const competitionsData = await compResponse.json();

      if (competitionsData && competitionsData.length > 0) {
        const activeCompetition = competitionsData[0];

        // Fetch team progress for this user's team
        const progressResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/memors/team/${
            user.teamsId
          }/competition/${activeCompetition.id}/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain || "",
            },
          }
        );

        // Fetch leaderboard to get team rank and points
        const leaderboardResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leaderboard/competition/${
            activeCompetition.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain || "",
            },
          }
        );

        if (progressResponse.ok && leaderboardResponse.ok) {
          const progressData = await progressResponse.json();
          const leaderboardData = await leaderboardResponse.json();

          // Find user's team in leaderboard
          const userTeam = leaderboardData.teams.find(
            (team) => team.teamId === user.teamsId
          );

          setStats({
            completedMemors: progressData.completedMemors || 0,
            teamRank: userTeam ? userTeam.rank : "-",
            totalPoints: userTeam ? userTeam.points : 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });
    setEditMode(false);
  };

  const handlePasswordFormToggle = () => {
    setPasswordForm(!passwordForm);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || "",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: user.email,
            teamsId: user.teamsId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update user in context
      setUser({
        ...user,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
      });

      setAlert({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain || "",
          },
          body: JSON.stringify({
            email: user.email,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }

      setAlert({
        open: true,
        message: "Password changed successfully!",
        severity: "success",
      });

      toast.success("Password changed successfully!");
      setPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setAlert({
        open: true,
        message:
          error.message || "Failed to change password. Please try again.",
        severity: "error",
      });
      toast.error(error.message || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Background Elements */}
      <img
        src={background1}
        alt=''
        style={{
          position: "absolute",
          top: "2",
          right: "0",
          width: "15%",
          zIndex: "0",
        }}
        aria-hidden='true'
      />
      <img
        src={background2}
        alt=''
        style={{
          position: "absolute",
          top: "25%",
          left: "5%",
          width: "5%",
          zIndex: "0",
        }}
        aria-hidden='true'
      />
      <img
        src={background3}
        alt=''
        style={{
          position: "absolute",
          top: "35%",
          right: "6%",
          width: "5%",
          zIndex: "0",
        }}
        aria-hidden='true'
      />

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: "1",
        }}
      >
        <Typography
          variant='h4'
          sx={{ color: "white", fontWeight: "bold", mb: 4 }}
        >
          My Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: "#1E1F20",
                borderRadius: "16px",
                border: "1px solid #333738",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant='h5'
                  sx={{ color: "white", display: "flex", alignItems: "center" }}
                >
                  <PersonIcon sx={{ mr: 1, color: "#d0bcfe" }} />
                  Profile Information
                </Typography>
                {!editMode && (
                  <Button
                    variant='outlined'
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    sx={{
                      color: "#d0bcfe",
                      borderColor: "#d0bcfe",
                      "&:hover": {
                        borderColor: "#b39ddb",
                        backgroundColor: "rgba(208, 188, 254, 0.08)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      sx={{ color: "#999", mb: 1, ml: 1 }}
                    >
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant='outlined'
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
                            borderColor: "#4e00d1",
                          },
                          "&:hover fieldset": {
                            borderColor: "#6200ea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4e00d1",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      sx={{ color: "#999", mb: 1, ml: 1 }}
                    >
                      Last Name
                    </Typography>
                    <TextField
                      fullWidth
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      variant='outlined'
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
                            borderColor: "#4e00d1",
                          },
                          "&:hover fieldset": {
                            borderColor: "#6200ea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4e00d1",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant='body2'
                      sx={{ color: "#999", mb: 1, ml: 1 }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      name='email'
                      value={formData.email}
                      disabled={true}
                      variant='outlined'
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
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#4e00d1",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant='body2'
                      sx={{ color: "#999", mb: 1, ml: 1 }}
                    >
                      Team
                    </Typography>
                    <TextField
                      fullWidth
                      value={
                        user?.team?.name ||
                        (user?.teamsId
                          ? `Team ID: ${user.teamsId}`
                          : "Not assigned to a team")
                      }
                      disabled
                      variant='outlined'
                      sx={{
                        mb: 2,
                        "& .MuiInputBase-root": {
                          backgroundColor: "#2c2c2c",
                          borderRadius: "8px",
                          color: user?.team?.name ? "#ffffff" : "#aaaaaa",
                        },
                        "& .MuiInputLabel-root": {
                          color: "#ffffff",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#4e00d1",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant='outlined'
                      color='error'
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={submitting}
                      sx={{
                        backgroundColor: "#d0bcfe",
                        color: "#381e72",
                        "&:hover": {
                          backgroundColor: "#b39ddb",
                        },
                      }}
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                )}
              </form>
            </Paper>

            {/* Password Section */}
            <Paper
              sx={{
                p: 4,
                backgroundColor: "#1E1F20",
                borderRadius: "16px",
                border: "1px solid #333738",
                mt: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant='h5'
                  sx={{ color: "white", display: "flex", alignItems: "center" }}
                >
                  <LockIcon sx={{ mr: 1, color: "#d0bcfe" }} />
                  Password
                </Typography>
                <Button
                  variant='outlined'
                  startIcon={passwordForm ? <CancelIcon /> : <EditIcon />}
                  onClick={handlePasswordFormToggle}
                  sx={{
                    color: passwordForm ? "#ff5252" : "#d0bcfe",
                    borderColor: passwordForm ? "#ff5252" : "#d0bcfe",
                    "&:hover": {
                      borderColor: passwordForm ? "#ff1744" : "#b39ddb",
                      backgroundColor: passwordForm
                        ? "rgba(255, 82, 82, 0.08)"
                        : "rgba(208, 188, 254, 0.08)",
                    },
                  }}
                >
                  {passwordForm ? "Cancel" : "Change Password"}
                </Button>
              </Box>

              {passwordForm ? (
                <form onSubmit={handlePasswordSubmit}>
                  <TextField
                    fullWidth
                    type='password'
                    name='currentPassword'
                    label='Current Password'
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    variant='outlined'
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
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#4e00d1",
                        },
                        "&:hover fieldset": {
                          borderColor: "#6200ea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4e00d1",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type='password'
                    name='newPassword'
                    label='New Password'
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    variant='outlined'
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
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#4e00d1",
                        },
                        "&:hover fieldset": {
                          borderColor: "#6200ea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4e00d1",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type='password'
                    name='confirmPassword'
                    label='Confirm New Password'
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    variant='outlined'
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
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#4e00d1",
                        },
                        "&:hover fieldset": {
                          borderColor: "#6200ea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4e00d1",
                        },
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >
                    <Button
                      type='submit'
                      variant='contained'
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={submitting}
                      sx={{
                        backgroundColor: "#d0bcfe",
                        color: "#381e72",
                        "&:hover": {
                          backgroundColor: "#b39ddb",
                        },
                      }}
                    >
                      {submitting ? "Updating..." : "Update Password"}
                    </Button>
                  </Box>
                </form>
              ) : (
                <Typography variant='body1' color='#999'>
                  Your password is securely stored. You can change it anytime by
                  clicking the button above.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Stats and Profile Picture */}
          <Grid item xs={12} md={4}>
            {/* Profile Picture */}
            <Paper
              sx={{
                p: 4,
                backgroundColor: "#1E1F20",
                borderRadius: "16px",
                border: "1px solid #333738",
                mb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mb: 3,
                  bgcolor: "#381e72",
                  fontSize: "3rem",
                }}
              >
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>

              <Typography variant='h5' sx={{ color: "white", mb: 1 }}>
                {user?.firstName} {user?.lastName}
              </Typography>

              <Typography
                variant='body1'
                sx={{ color: "#999", mb: 3, textAlign: "center" }}
              >
                {user?.email}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant='outlined'
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    color: "#d0bcfe",
                    borderColor: "#d0bcfe",
                    "&:hover": {
                      borderColor: "#b39ddb",
                      backgroundColor: "rgba(208, 188, 254, 0.08)",
                    },
                    width: "100%",
                    mb: 2,
                  }}
                  disabled
                >
                  Change Avatar
                </Button>
                <Typography variant='caption' sx={{ color: "#777" }}>
                  Avatar upload coming soon!
                </Typography>
              </Box>
            </Paper>

            {/* User Stats */}
            <Paper
              sx={{
                p: 3,
                backgroundColor: "#1E1F20",
                borderRadius: "16px",
                border: "1px solid #333738",
              }}
            >
              <Typography variant='h6' sx={{ color: "white", mb: 3 }}>
                Activity Stats
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#272728",
                    borderRadius: "12px",
                  }}
                >
                  <CardContent>
                    <Typography variant='body2' color='#999'>
                      Completed Memors
                    </Typography>
                    <Typography
                      variant='h4'
                      sx={{ color: "#d0bcfe", fontWeight: "bold" }}
                    >
                      {stats.completedMemors}
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    backgroundColor: "#272728",
                    borderRadius: "12px",
                  }}
                >
                  <CardContent>
                    <Typography variant='body2' color='#999'>
                      Team Rank
                    </Typography>
                    <Typography
                      variant='h4'
                      sx={{ color: "#d0bcfe", fontWeight: "bold" }}
                    >
                      {stats.teamRank}
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    backgroundColor: "#272728",
                    borderRadius: "12px",
                  }}
                >
                  <CardContent>
                    <Typography variant='body2' color='#999'>
                      Total Points
                    </Typography>
                    <Typography
                      variant='h4'
                      sx={{ color: "#d0bcfe", fontWeight: "bold" }}
                    >
                      {stats.totalPoints}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          variant='filled'
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
