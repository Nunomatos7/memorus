import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomButton from "../../../../Components/CustomButton/CustomButton";
import ConfirmationModal from "../../../../Components/ConfirmationModal/ConfirmationModal";
import background3 from "../../../../assets/images/adminBackground3.svg";
import api from "../../../../api/axiosInstance";
import { forceRefreshAdminBoard } from "../../../../assets/utils/adminRefresh";
import PropTypes from "prop-types";

const DynamicModal = ({
  modalType,
  action,
  data,
  onClose,
  showFeedback,
  setLoading,
  refreshData,
}) => {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [newMemorTitle, setNewMemorTitle] = useState("");
  const [newMemorDate, setNewMemorDate] = useState(null);
  const [newMemorDescription, setNewMemorDescription] = useState("");
  const [newMemorPoints, setNewMemorPoints] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamThumbnail, setNewTeamThumbnail] = useState(null);
  const [newTeamThumbnailFile, setNewTeamThumbnailFile] = useState(null);
  const [newTeamMembers, setNewTeamMembers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [unassignedMembers, setUnassignedMembers] = useState([]);
  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [newCompetitionDescription, setNewCompetitionDescription] =
    useState("");
  const [newCompetitionStartDate, setNewCompetitionStartDate] = useState("");
  const [newCompetitionEndDate, setNewCompetitionEndDate] = useState("");
  useEffect(() => {
    if ((action === "edit" || action === "delete") && data) {
      switch (modalType) {
        case "memor":
          setNewMemorTitle(data.title || "");
          setNewMemorDescription(data.description || "");
          if (data.date) {
            const parts = data.date.split("/");
            setNewMemorDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
          if (data.points) {
            const pointsMatch = data.points.match(/\d+/);
            if (pointsMatch) {
              setNewMemorPoints(parseInt(pointsMatch[0], 10));
            }
          }
          break;
        case "team":
          setNewTeamName(data.name || "");
          setNewTeamThumbnail(data.avatar || null);
          break;
        case "competition":
          setNewCompetitionTitle(data.title || "");
          setNewCompetitionDescription(data.description || "");
          setNewCompetitionStartDate(data.startDate || "");
          setNewCompetitionEndDate(data.endDate || "");
          break;
      }
    }
    if (modalType === "team" && action !== "delete") {
      fetchUnassignedMembers();
    }
  }, [modalType, action, data]);

  const fetchUnassignedMembers = async () => {
    setLoading(true);
    try {
      const usersResponse = await api.get("/api/users");
      const users = usersResponse.data || [];
      const unassignedMembers = [];

      for (const user of users) {
        if (user.teams_id) continue;
        try {
          const rolesResponse = await api.get(`/api/users/${user.id}/roles`);
          const roles = rolesResponse.data || [];
          const isAdmin = roles.some((role) => role.title === "admin");
          if (!isAdmin) {
            unassignedMembers.push({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
            });
          }
        } catch (error) {
          console.error(`Error checking roles for user ${user.id}:`, error);
        }
      }
      setUnassignedMembers(unassignedMembers);
    } catch (error) {
      console.error("Error fetching unassigned members:", error);
      showFeedback("error", "Error", "Failed to load unassigned members");
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewTeamThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTeamThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUnassignedMembers = unassignedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const validateFormBeforeSubmit = () => {
    if (action === "delete") return true;
    switch (modalType) {
      case "memor":
        return newMemorTitle && newMemorDate && newMemorPoints;
      case "team":
        return newTeamName && Object.values(newTeamMembers).some((v) => v);
      case "competition":
        return (
          newCompetitionTitle &&
          newCompetitionDescription &&
          newCompetitionStartDate &&
          newCompetitionEndDate
        );
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!validateFormBeforeSubmit()) {
      showFeedback(
        "error",
        "Validation Error",
        "Please fill in all required fields"
      );
      return;
    }
    setConfirmationModalOpen(true);
  };

  const executeSubmit = async () => {
    setLoading(true);
    let success = false;
    try {
      switch (modalType) {
        case "memor":
          await handleMemorSubmit();
          success = true;
          break;
        case "team":
          await handleTeamSubmit();
          success = true;
          break;
        case "competition":
          await handleCompetitionSubmit();
          success = true;
          break;
      }
      if (success) {
        if (typeof refreshData === "function") {
          console.log(`Refreshing after ${action} ${modalType}`);
          refreshData();
        }
        setTimeout(() => {
          forceRefreshAdminBoard();
        }, 300);
      }
    } catch (error) {
      console.error(
        `Error ${
          action === "create"
            ? "creating"
            : action === "edit"
            ? "updating"
            : "deleting"
        } ${modalType}:`,
        error
      );
      showFeedback(
        "error",
        "Error",
        `Failed to ${action} ${modalType}: ${error.message}`
      );
    } finally {
      setLoading(false);
      setConfirmationModalOpen(false);
      if (success) {
        onClose();
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const handleMemorSubmit = async () => {
    if (action === "delete" && data?.id) {
      await api.delete(`/api/memors/${data.id}`);
      showFeedback(
        "success",
        "Memor Deleted",
        `The memor "${data.title}" has been successfully deleted.`
      );
      return;
    }

    const memorData = {
      title: newMemorTitle,
      description: newMemorDescription,
      dueDate: formatDate(newMemorDate),
      points: newMemorPoints,
    };

    const competitionsResponse = await api.get("/api/competitions");
    const activeCompetition = competitionsResponse.data.find(
      (comp) => comp.is_active
    );

    if (!activeCompetition) {
      throw new Error("No active competition found");
    }

    memorData.competitionId = activeCompetition.id;

    if (action === "create") {
      await api.post("/api/memors", memorData);
      showFeedback(
        "success",
        "Memor Created",
        `The memor "${newMemorTitle}" has been successfully created.`
      );
    } else if (action === "edit" && data?.id) {
      await api.put(`/api/memors/${data.id}`, memorData);
      showFeedback(
        "success",
        "Memor Updated",
        `The memor "${newMemorTitle}" has been successfully updated.`
      );
    }
  };

  const handleTeamSubmit = async () => {
    if (action === "delete" && data?.name) {
      showFeedback(
        "success",
        "Team Deleted",
        `The team "${data.name}" has been successfully deleted.`
      );
      return;
    }

    if (action === "create") {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", newTeamName);

        if (newTeamThumbnailFile) {
          formData.append("image", newTeamThumbnailFile);
        }

        const teamResponse = await api.post("/api/teams", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const teamId = teamResponse.data.id;
        console.log(`Created team with ID: ${teamId}`);

        const selectedMemberIds = Object.entries(newTeamMembers)
          .filter(([_, isSelected]) => isSelected)
          .map(([email]) => {
            const member = unassignedMembers.find((m) => m.email === email);
            return member ? member.id : null;
          })
          .filter((id) => id !== null);

        for (const userId of selectedMemberIds) {
          try {
            await api.patch(`/api/users/${userId}/team`, { teamsId: teamId });
          } catch (error) {
            console.error(`Error assigning user ${userId} to team:`, error);
          }
        }

        try {
          const competitionsResponse = await api.get(
            "/api/competitions/active"
          );
          if (
            competitionsResponse.data &&
            competitionsResponse.data.length > 0
          ) {
            const activeCompetition = competitionsResponse.data[0];
            console.log(`Found active competition: ${activeCompetition.id}`);

            const addTeamResponse = await api.post(
              `/api/competitions/${activeCompetition.id}/teams/${teamId}`,
              {}
            );

            if (addTeamResponse.status === 201) {
              console.log(
                `Team ${teamId} added to competition ${activeCompetition.id} successfully`
              );
            } else {
              console.warn(
                `Unexpected response when adding team to competition:`,
                addTeamResponse
              );
            }
          } else {
            console.log("No active competition found to add the team to");
          }
        } catch (compError) {
          console.error("Error adding team to competition:", compError);
        }

        setLoading(false);
        showFeedback(
          "success",
          "Team Created",
          `The team "${newTeamName}" has been successfully created with ${selectedMemberIds.length} members.`
        );

        return true;
      } catch (error) {
        setLoading(false);
        console.error("Error creating team:", error);
        showFeedback(
          "error",
          "Team Creation Failed",
          error.response?.data?.error || error.message || "Unknown error"
        );
        throw error;
      }
    }

    if (action === "edit" && data?.id) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", newTeamName);

        if (newTeamThumbnailFile) {
          formData.append("image", newTeamThumbnailFile);
        }

        const teamResponse = await api.put(`/api/teams/${data.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(`Updated team with ID: ${data.id}`);
        setLoading(false);
        showFeedback(
          "success",
          "Team Updated",
          `The team "${newTeamName}" has been successfully updated.`
        );

        return true;
      } catch (error) {
        setLoading(false);
        console.error("Error updating team:", error);
        showFeedback(
          "error",
          "Team Update Failed",
          error.response?.data?.error || error.message || "Unknown error"
        );
        throw error;
      }
    }
  };

  const handleCompetitionSubmit = async () => {
    if (action === "delete" && data?.id) {
      showFeedback(
        "success",
        "Competition Deleted",
        `The competition "${data.title}" has been successfully deleted.`
      );
      return;
    }

    const competitionData = {
      name: newCompetitionTitle,
      description: newCompetitionDescription,
      startDate: formatDate(newCompetitionStartDate),
      endDate: formatDate(newCompetitionEndDate),
      isActive: true,
    };

    if (action === "create") {
      await api.post("/api/competitions", competitionData);
      showFeedback(
        "success",
        "Competition Created",
        `The competition "${newCompetitionTitle}" has been successfully created.`
      );
    } else if (action === "edit" && data?.id) {
      await api.put(`/api/competitions/${data.id}`, competitionData);
      showFeedback(
        "success",
        "Competition Updated",
        `The competition "${newCompetitionTitle}" has been successfully updated.`
      );
    }
  };
  const renderModalContent = () => {
    if (action === "delete") {
      return (
        <>
          <Typography
            variant='h5'
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: "20px",
            }}
          >
            Delete {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          </Typography>
          <Typography sx={{ color: "#FFFFFF", marginBottom: "20px" }}>
            Are you sure you want to delete{" "}
            {modalType === "memor"
              ? "the memor"
              : modalType === "team"
              ? "the team"
              : "the competition"}{" "}
            <strong>
              {modalType === "memor"
                ? data?.title
                : modalType === "team"
                ? data?.name
                : data?.title}
            </strong>
            ?
          </Typography>
          <Typography sx={{ color: "#D64545", marginBottom: "20px" }}>
            This action cannot be undone.
          </Typography>
        </>
      );
    }

    switch (modalType) {
      case "memor":
        return (
          <>
            <Typography
              variant='h5'
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              {action === "create" ? "Create" : "Edit"} Memor
            </Typography>
            <TextField
              label='Title'
              required
              variant='outlined'
              size='medium'
              value={newMemorTitle}
              onChange={(e) => setNewMemorTitle(e.target.value)}
              fullWidth
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
              }}
            />
            <TextField
              type='date'
              label='Due Date'
              required
              size='medium'
              value={newMemorDate || ""}
              onChange={(e) => setNewMemorDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: getTodayDate(),
                "aria-label": "Due Date",
              }}
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
                "& input::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                },
              }}
            />
            <TextField
              label='Description'
              variant='outlined'
              required
              size='medium'
              multiline
              rows={3}
              value={newMemorDescription}
              onChange={(e) => setNewMemorDescription(e.target.value)}
              fullWidth
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
              }}
              inputProps={{
                "aria-label": "memor description",
              }}
            />
            <Typography
              variant='body1'
              sx={{
                color: "#CAC4D0",
                marginBottom: "-30px",
                fontSize: "1.1rem",
              }}
            >
              Points *
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: "20px",
                justifyContent: "space-between",
              }}
            >
              {[5, 10, 20, 30, 50, 100].map((point) => (
                <Button
                  key={point}
                  required
                  onClick={() => setNewMemorPoints(point)}
                  sx={{
                    backgroundColor:
                      newMemorPoints === point ? "#283434" : "#181c1c",
                    color: "#82D5C7",
                    borderRadius: "50%",
                    width: "55px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    border:
                      newMemorPoints === point
                        ? "2px solid #82D5C7"
                        : "1px solid #444",
                    "&:hover": {
                      backgroundColor: "#1f2c29",
                      border: "2px solid #82D5C7",
                    },
                  }}
                >
                  {point}
                </Button>
              ))}
            </Box>
          </>
        );
      case "team":
        return (
          <>
            <Typography
              variant='h5'
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              Team Configuration
            </Typography>
            <TextField
              label="Team's Name"
              required
              variant='outlined'
              size='medium'
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              fullWidth
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#888" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
              }}
              inputProps={{
                "aria-label": "Team's Name",
              }}
            />
            <Typography
              variant='body1'
              sx={{
                color: "#CAC4D0",
                marginBottom: "15px",
                fontSize: "1.1rem",
              }}
            >
              Team Avatar (Optional)
            </Typography>
            <div
              style={{
                border: "1px dashed #888",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px",
                position: "relative",
                background: "#1E1E1E",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {newTeamThumbnail ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={newTeamThumbnail}
                    alt='Team Avatar Preview'
                    style={{
                      borderRadius: "15px",
                      height: "130px",
                      maxWidth: "130px",
                      objectFit: "cover",
                    }}
                    aria-label='Team Avatar Preview'
                  />
                  <Button
                    onClick={() => {
                      setNewTeamThumbnail(null);
                      setNewTeamThumbnailFile(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: "-15px",
                      right: "-15px",
                      minWidth: "20px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#D64545",
                      color: "white",
                      fontSize: "12px",
                      "&:hover": { backgroundColor: "#B03C3C" },
                    }}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <>
                  <label htmlFor='file-input' style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={background3}
                        alt='Upload Avatar'
                        style={{
                          width: "60px",
                          height: "60px",
                          marginBottom: "15px",
                        }}
                      />
                      <Typography variant='body2' sx={{ color: "#888" }}>
                        Upload team avatar from computer
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{ color: "#666", mt: 1 }}
                      >
                        Recommended: Square image, max 5MB
                      </Typography>
                    </div>
                  </label>
                  <input
                    id='file-input'
                    type='file'
                    accept='image/*'
                    className='file-input'
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
            <Typography
              variant='body1'
              sx={{
                color: "#CAC4D0",
                marginBottom: "15px",
                fontSize: "1.1rem",
              }}
            >
              Members *
            </Typography>
            <TextField
              placeholder='Search Name'
              value={searchQuery}
              required
              size='medium'
              onChange={(e) => setSearchQuery(e.target.value)}
              variant='outlined'
              sx={{
                borderRadius: "40px",
                input: {
                  color: "white",
                  fontSize: "1.1rem",
                  padding: "8px 14px",
                },
                width: "260px",
                border: "0.905px solid #88938F",
                "& fieldset": { border: "none" },
                "&:hover": { backgroundColor: "#2E2F30" },
                marginBottom: "20px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search sx={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                "aria-label": "Search Members",
              }}
            />
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                background: "#1E1E1E",
                borderRadius: "15px",
                padding: "15px",
                border: "1px solid #333",
              }}
              role='listbox'
              aria-label='Members List'
            >
              {filteredUnassignedMembers.length > 0 ? (
                filteredUnassignedMembers.map((member) => (
                  <Box
                    key={member.email}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    <Checkbox
                      checked={!!newTeamMembers[member.email]}
                      onChange={() =>
                        setNewTeamMembers((prev) => ({
                          ...prev,
                          [member.email]: !prev[member.email],
                        }))
                      }
                      sx={{ color: "#82D5C7" }}
                      inputProps={{
                        "aria-label": `Select ${member.name}`,
                      }}
                    />
                    <Typography sx={{ color: "#FFFFFF", fontSize: "1.1rem" }}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ color: "#888", fontSize: "0.75rem" }}
                    >
                      {member.email}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  No unassigned members found
                </Box>
              )}
            </div>
          </>
        );

      case "competition":
        return (
          <>
            <Typography
              variant='h5'
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              {action === "create" ? "Create" : "Edit"} Competition
            </Typography>
            <TextField
              label='Title'
              required
              variant='outlined'
              size='medium'
              value={newCompetitionTitle}
              onChange={(e) => setNewCompetitionTitle(e.target.value)}
              fullWidth
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
              }}
            />
            <TextField
              label='Description'
              variant='outlined'
              multiline
              required
              size='medium'
              rows={3}
              value={newCompetitionDescription}
              onChange={(e) => setNewCompetitionDescription(e.target.value)}
              fullWidth
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                  fontSize: "1.1rem",
                },
              }}
            />
            <Typography
              variant='body1'
              sx={{
                color: "#CAC4D0",
                marginBottom: "5px",
                fontSize: "1.1rem",
              }}
            >
              Start Date *
            </Typography>
            <TextField
              type='date'
              required
              size='medium'
              value={newCompetitionStartDate || ""}
              onChange={(e) => setNewCompetitionStartDate(e.target.value)}
              fullWidth
              inputProps={{
                min: getTodayDate(),
              }}
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& input::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                },
              }}
            />
            <Typography
              variant='body1'
              sx={{
                color: "#CAC4D0",
                marginBottom: "5px",
                fontSize: "1.1rem",
              }}
            >
              End Date *
            </Typography>
            <TextField
              type='date'
              required
              size='medium'
              value={newCompetitionEndDate || ""}
              onChange={(e) => setNewCompetitionEndDate(e.target.value)}
              fullWidth
              inputProps={{
                min: newCompetitionStartDate || getTodayDate(),
              }}
              sx={{
                marginBottom: "20px",
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                  fontSize: "1.1rem",
                  padding: "16px 18px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#90948c" },
                  "&:hover fieldset": { borderColor: "#AAA" },
                  "&.Mui-focused fieldset": { borderColor: "#CCC" },
                },
                "& input::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                },
              }}
            />
          </>
        );

      default:
        return <Typography>Invalid modal type</Typography>;
    }
  };
  return (
    <div className='modal-overlay-submit-memor' role='dialog' aria-modal='true'>
      <div
        className='modal-container'
        style={{ padding: "20px", maxWidth: "600px" }}
        tabIndex={-1}
      >
        <div className='modal-top' style={{ marginBottom: "20px" }}>
          <Button
            onClick={onClose}
            sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
            aria-label='Close modal'
          >
            <ArrowBackIcon />
          </Button>
          <Typography
            variant='h4'
            sx={{ marginLeft: "15px", color: "#BEC9C5", fontSize: "1.1rem" }}
            id='modal-title'
          >
            Admin Board
          </Typography>
        </div>

        {renderModalContent()}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
        >
          <CustomButton
            text='Cancel'
            onClick={onClose}
            sx={{
              backgroundColor: "transparent",
              border: "1px solid #B5EDE4",
              color: "#B5EDE4",
              borderRadius: "60px",
              "&:hover": {
                backgroundColor: "rgba(181, 237, 228, 0.08)",
              },
            }}
          />
          <CustomButton
            text={action === "delete" ? "Delete" : "Submit"}
            onClick={handleSubmit}
            sx={{
              borderRadius: "60px",
              backgroundColor: action === "delete" ? "#D64545" : "#B5EDE4",
              color: action === "delete" ? "#FFFFFF" : "#000",
              "&:hover": {
                backgroundColor: action === "delete" ? "#B03C3C" : "#80ccbc",
              },
            }}
          />
        </Box>

        {confirmationModalOpen && (
          <ConfirmationModal
            open={confirmationModalOpen}
            onClose={() => setConfirmationModalOpen(false)}
            onConfirm={executeSubmit}
            action={action}
            context={modalType}
            itemName={
              modalType === "memor"
                ? action === "delete"
                  ? data?.title
                  : newMemorTitle
                : modalType === "team"
                ? action === "delete"
                  ? data?.name
                  : newTeamName
                : action === "delete"
                ? data?.title
                : newCompetitionTitle
            }
          />
        )}
      </div>
    </div>
  );
};

DynamicModal.propTypes = {
  modalType: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  showFeedback: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};

export default DynamicModal;
