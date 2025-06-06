import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  TextField,
  Skeleton,
} from "@mui/material";
import editIcon from "../../../../assets/images/editIcon.svg";
import deleteIcon from "../../../../assets/images/deleteIcon.svg";
import CustomButton from "../../../../Components/CustomButton/CustomButton";
import ConfirmationModal from "../../../../Components/ConfirmationModal/ConfirmationModal";
import api from "../../../../api/axiosInstance";
import PropTypes from "prop-types";
import defaultAvatar from "../../../../assets/images/default_avatar.png";

const ManageTeamsSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      marginTop: "20px",
      borderRadius: "13.576px",
      border: "2.715px solid #333738",
      background: "#1E1F20",
      padding: "20px",
      backdropFilter: "blur(20px)",
      marginBottom: "50px",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mb: 5,
      }}
    >
      <Skeleton
        variant='rounded'
        width={150}
        height={40}
        sx={{ bgcolor: "#424242", borderRadius: "20px" }}
      />
    </Box>

    {[...Array(4)].map((_, index) => (
      <Box
        key={index}
        sx={{
          marginBottom: "15px",
          borderRadius: "10.861px",
          border: "2.715px solid #333738",
          background: "#272728",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr 4fr 1fr",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Skeleton
            variant='circular'
            width={40}
            height={40}
            sx={{ bgcolor: "#424242" }}
          />

          <Skeleton
            variant='text'
            sx={{ fontSize: "1rem", width: "120px", bgcolor: "#424242" }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Skeleton
              variant='text'
              sx={{ fontSize: "0.875rem", width: "200px", bgcolor: "#424242" }}
            />
            <Skeleton
              variant='text'
              sx={{ fontSize: "0.875rem", width: "150px", bgcolor: "#424242" }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Skeleton
              variant='circular'
              width={24}
              height={24}
              sx={{ bgcolor: "#424242" }}
            />
            <Skeleton
              variant='circular'
              width={24}
              height={24}
              sx={{ bgcolor: "#424242" }}
            />
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

const ManageTeams = ({ searchQuery, openModal, showFeedback, setLoading }) => {
  const [teams, setTeams] = useState({});
  const [teamsData, setTeamsData] = useState([]);
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editedMembers, setEditedMembers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    action: "",
    memberName: "",
    memberEmail: "",
    teamName: "",
  });
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [confirmationDeleteModalOpen, setConfirmationDeleteModalOpen] =
    useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [editingTeamAvatar, setEditingTeamAvatar] = useState(null);
  const [editingTeamAvatarPreview, setEditingTeamAvatarPreview] =
    useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState({});

  useEffect(() => {
    fetchTeamsAndMembers();
  }, []);

  const fetchTeamsAndMembers = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      const teamsResponse = await api.get("/api/teams");

      setTeamsData(teamsResponse.data || []);

      const teamsObj = {};
      const teamsArray = teamsResponse.data || [];

      const usersResponse = await api.get("/api/users");
      const users = usersResponse.data || [];

      const membersArray = [];

      for (const user of users) {
        try {
          const rolesResponse = await api.get(`/api/users/${user.id}/roles`);
          const roles = rolesResponse.data || [];

          const isAdmin = roles.some((role) => role.title === "admin");

          if (!isAdmin) {
            membersArray.push({
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              team: teamsArray.find((t) => t.id === user.teams_id)?.name || "",
            });
          }
        } catch (error) {
          console.error(`Error checking roles for user ${user.id}:`, error);
        }
      }

      teamsArray.forEach((team) => {
        teamsObj[team.name] = membersArray
          .filter((member) => member.team === team.name)
          .map((member) => member.email);
      });

      setTeams(teamsObj);
      setMembers(membersArray);
    } catch (error) {
      console.error("Error fetching teams and members:", error);
      showFeedback("error", "Error", "Failed to load teams and members");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!window.manageTeamsRef) {
      window.manageTeamsRef = {};
    }

    const fetchTeamsAndMembersRef = async () => {
      setIsLoading(true);
      setLoading(true);
      try {
        const teamsResponse = await api.get("/api/teams");

        setTeamsData(teamsResponse.data || []);

        const teamsObj = {};
        const teamsArray = teamsResponse.data || [];

        const usersResponse = await api.get("/api/users");
        const users = usersResponse.data || [];

        const membersArray = [];

        for (const user of users) {
          try {
            const rolesResponse = await api.get(`/api/users/${user.id}/roles`);
            const roles = rolesResponse.data || [];

            const isAdmin = roles.some((role) => role.title === "admin");

            if (!isAdmin) {
              membersArray.push({
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                team:
                  teamsArray.find((t) => t.id === user.teams_id)?.name || "",
              });
            }
          } catch (error) {
            console.error(`Error checking roles for user ${user.id}:`, error);
          }
        }

        teamsArray.forEach((team) => {
          teamsObj[team.name] = membersArray
            .filter((member) => member.team === team.name)
            .map((member) => member.email);
        });

        setTeams(teamsObj);
        setMembers(membersArray);
      } catch (error) {
        console.error("Error fetching teams and members:", error);
        showFeedback("error", "Error", "Failed to load teams and members");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    window.manageTeamsRef.fetchTeams = fetchTeamsAndMembersRef;

    fetchTeamsAndMembersRef();

    return () => {
      if (window.manageTeamsRef?.fetchTeams === fetchTeamsAndMembersRef) {
        delete window.manageTeamsRef.fetchTeams;
      }
    };
  }, []);

  const deleteTeam = async (teamName) => {
    setLoading(true);
    try {
      const teamToDelete = teamsData.find((team) => team.name === teamName);

      if (!teamToDelete) {
        throw new Error(`Team "${teamName}" not found`);
      }

      const teamId = parseInt(teamToDelete.id, 10);
      await api.delete(`/api/teams/${teamId}`);

      setTeams((prevTeams) => {
        const updatedTeams = { ...prevTeams };
        delete updatedTeams[teamName];
        return updatedTeams;
      });

      setTeamsData((prevTeamsData) =>
        prevTeamsData.filter((team) => team.id !== teamToDelete.id)
      );

      showFeedback(
        "success",
        "Team Deleted",
        `The team "${teamName}" has been successfully deleted.`
      );

      fetchTeamsAndMembers();
    } catch (error) {
      console.error("Error deleting team:", error);
      showFeedback("error", "Error", `Failed to delete team: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = (teamName) => {
    setTeamToDelete(teamName);
    setConfirmationDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete);
    }
    setConfirmationDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfirmationDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  const startEditing = (teamName) => {
    setEditingTeam(teamName);
    const currentMembers = teams[teamName] || [];
    setEditedMembers(
      members.reduce((acc, member) => {
        acc[member.email] = currentMembers.includes(member.email);
        return acc;
      }, {})
    );
    setEditingTeamAvatar(null);
    setEditingTeamAvatarPreview(null);
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setIsEditing(true);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPendingAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAvatarChange = async () => {
    if (!pendingAvatarFile || !editingTeam) return;

    setLoading(true);

    try {
      const teamObj = teamsData.find((t) => t.name === editingTeam);
      if (!teamObj) {
        throw new Error(`Team ${editingTeam} not found`);
      }

      const teamId = teamObj.id;

      const formData = new FormData();
      formData.append("name", editingTeam);
      formData.append("image", pendingAvatarFile);

      const response = await api.put(`/api/teams/${teamId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTeamsData((prevTeamsData) =>
        prevTeamsData.map((team) =>
          team.id === teamId ? { ...team, avatar: response.data.avatar } : team
        )
      );

      setEditingTeamAvatar(pendingAvatarFile);
      setEditingTeamAvatarPreview(pendingAvatarPreview);

      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);

      showFeedback(
        "success",
        "Avatar Updated",
        "Team avatar has been updated successfully!"
      );
    } catch (error) {
      console.error("Error updating team avatar:", error);
      showFeedback(
        "error",
        "Avatar Update Failed",
        error.response?.data?.error ||
          error.message ||
          "Failed to update avatar"
      );

      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);

      const fileInput = document.getElementById(`avatar-input-${editingTeam}`);
      if (fileInput) {
        fileInput.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelAvatarChange = () => {
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);

    const fileInput = document.getElementById(`avatar-input-${editingTeam}`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCheckboxToggle = (email, name, action) => {
    setModalData({
      action,
      memberName: name,
      memberEmail: email,
      teamName: editingTeam,
    });
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    const { memberEmail, action } = modalData;
    setEditedMembers((prev) => ({
      ...prev,
      [memberEmail]: action === "add",
    }));
    setModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const saveChangesEditTeam = async () => {
    setLoading(true);
    try {
      const teamObj = teamsData.find((t) => t.name === editingTeam);

      if (!teamObj) {
        throw new Error(`Team ${editingTeam} not found`);
      }

      const teamId = teamObj.id;

      const selectedEmails = Object.entries(editedMembers)
        .filter(([, isSelected]) => isSelected)
        .map(([email]) => email);

      const usersResponse = await api.get("/api/users");
      const users = usersResponse.data;

      const currentTeamMembers = users.filter((u) => u.teams_id === teamId);
      const currentTeamEmails = currentTeamMembers.map((u) => u.email);

      const emailsToAdd = selectedEmails.filter(
        (email) => !currentTeamEmails.includes(email)
      );

      const emailsToRemove = currentTeamEmails.filter(
        (email) => !selectedEmails.includes(email)
      );

      for (const email of emailsToAdd) {
        const user = users.find((u) => u.email === email);
        if (user) {
          await api.patch(`/api/users/${user.id}/team`, { teamsId: teamId });
        }
      }

      for (const email of emailsToRemove) {
        const user = users.find((u) => u.email === email);
        if (user) {
          await api.delete(`/api/users/${user.id}/team`);
        }
      }

      setTeams((prevTeams) => {
        const updatedTeams = { ...prevTeams };
        updatedTeams[editingTeam] = selectedEmails;
        return updatedTeams;
      });

      showFeedback(
        "success",
        "Team Updated",
        `The team "${editingTeam}" members have been successfully updated.`
      );

      fetchTeamsAndMembers();
    } catch (error) {
      console.error("Error updating team:", error);
      showFeedback("error", "Error", `Failed to update team: ${error.message}`);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setEditingTeam(null);
      setEditedMembers({});
      setEditingTeamAvatar(null);
      setEditingTeamAvatarPreview(null);
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
      setSearchQuery2("");
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
    setEditedMembers({});
    setEditingTeamAvatar(null);
    setEditingTeamAvatarPreview(null);
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setSearchQuery2("");
  };

  const getMemberTeam = (email) => {
    return Object.entries(teams).find(([_, members]) =>
      members.includes(email)
    )?.[0];
  };

  const filteredTeams = Object.entries(teams).filter(([teamName]) =>
    teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = Object.values(members).filter((member) =>
    member.name.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  const handleImgError = (teamName) => {
    setAvatarError((prev) => ({ ...prev, [teamName]: true }));
  };

  if (isLoading) {
    return <ManageTeamsSkeleton />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "20px",
        borderRadius: "13.576px",
        border: "2.715px solid #333738",
        background: "#1E1F20",
        padding: "20px",
        backdropFilter: "blur(20px)",
        marginBottom: "50px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <CustomButton
          text='Create a Team'
          onClick={() => openModal("team", "create")}
          sx={{
            backgroundColor: "#B5EDE4",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            boxShadow: "none",
            marginBottom: "40px",
            "&:hover": {
              backgroundColor: "#80ccbc",
            },
          }}
          icon={
            <Typography
              component='span'
              sx={{
                fontWeight: "bold",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              +
            </Typography>
          }
        />
      </Box>

      {filteredTeams.length > 0 ? (
        filteredTeams.map(([teamName, teamMembers]) => (
          <Box
            key={teamName}
            sx={{
              marginBottom: "15px",
              borderRadius: "10.861px",
              border: "2.715px solid #333738",
              background: "#272728",
              padding: "15px",
            }}
          >
            {!isEditing || editingTeam !== teamName ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr 4fr 1fr",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <img
                    src={
                      avatarError[teamName]
                        ? defaultAvatar
                        : teamsData.find((t) => t.name === teamName)?.avatar ||
                          defaultAvatar
                    }
                    alt={`${teamName} avatar`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #82D5C7",
                    }}
                    onError={() => handleImgError(teamName)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {teamName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    Members:{" "}
                    {teamMembers
                      .slice(0, 3)
                      .map(
                        (email) =>
                          members.find((member) => member.email === email)?.name
                      )
                      .join(", ")}
                    {teamMembers.length > 3 && "..."}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => startEditing(teamName)}>
                    <img
                      src={editIcon}
                      alt='Edit teams'
                      style={{ width: "20px" }}
                    />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTeam(teamName)}>
                    <img
                      src={deleteIcon}
                      alt='Delete'
                      style={{ width: "20px" }}
                    />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 6fr",
                    gap: 5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant='body1'
                      sx={{ color: "white", marginBottom: "20px" }}
                    >
                      Editing Team: {teamName}
                    </Typography>

                    <Box sx={{ marginBottom: "20px" }}>
                      <Typography
                        variant='body2'
                        sx={{
                          color: "#CAC4D0",
                          marginBottom: "10px",
                          textAlign: "center",
                        }}
                      >
                        Team Avatar
                      </Typography>
                      <div
                        style={{
                          border: "1px dashed #888",
                          borderRadius: "10px",
                          padding: "15px",
                          textAlign: "center",
                          position: "relative",
                          background: "#1E1E1E",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "180px",
                          width: "150px",
                        }}
                      >
                        <img
                          src={
                            pendingAvatarPreview ||
                            editingTeamAvatarPreview ||
                            (avatarError[teamName]
                              ? defaultAvatar
                              : teamsData.find((t) => t.name === teamName)
                                  ?.avatar) ||
                            defaultAvatar
                          }
                          alt={`${teamName} avatar`}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: pendingAvatarPreview
                              ? "2px solid #FFA726"
                              : editingTeamAvatarPreview
                              ? "2px solid #B5EDE4"
                              : "2px solid #82D5C7",
                            cursor: pendingAvatarPreview
                              ? "default"
                              : "pointer",
                            opacity: pendingAvatarPreview ? 0.8 : 1,
                          }}
                          onClick={() => {
                            if (!pendingAvatarPreview) {
                              document
                                .getElementById(`avatar-input-${teamName}`)
                                .click();
                            }
                          }}
                          onError={() => handleImgError(teamName)}
                        />

                        <input
                          id={`avatar-input-${teamName}`}
                          type='file'
                          accept='image/*'
                          style={{ display: "none" }}
                          onChange={(e) => handleAvatarChange(e)}
                        />

                        {pendingAvatarPreview ? (
                          <Typography
                            variant='caption'
                            sx={{
                              color: "#FFA726",
                              marginTop: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Pending Changes
                          </Typography>
                        ) : editingTeamAvatarPreview ? (
                          <Typography
                            variant='caption'
                            sx={{
                              color: "#B5EDE4",
                              marginTop: "8px",
                            }}
                          >
                            Updated (Click to change)
                          </Typography>
                        ) : (
                          <Typography
                            variant='caption'
                            sx={{
                              color: "#888",
                              marginTop: "8px",
                            }}
                          >
                            Click to change
                          </Typography>
                        )}

                        {pendingAvatarPreview && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              marginTop: "10px",
                            }}
                          >
                            <CustomButton
                              text='✓'
                              onClick={confirmAvatarChange}
                              sx={{
                                minWidth: "30px",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                fontSize: "14px",
                                padding: 0,
                                "&:hover": {
                                  backgroundColor: "#45a049",
                                },
                              }}
                            />
                          </Box>
                        )}
                      </div>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant='body2'
                      sx={{ color: "white", marginBottom: "10px" }}
                    >
                      Members
                    </Typography>
                    <TextField
                      placeholder='Search'
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                      variant='outlined'
                      size='small'
                      sx={{
                        borderRadius: "40px",
                        input: { color: "white" },
                        width: "250px",
                        height: "40px",
                        border: "0.905px solid #88938F",
                        marginBottom: "10px",
                        "& fieldset": { border: "none" },
                      }}
                    />

                    <Box
                      sx={{
                        backgroundColor: "#181818",
                        padding: "10px",
                        borderRadius: "10.706px",
                        border: "0.892px solid #88938F",
                        background: "#181818",
                        maxHeight: "300px",
                        minHeight: "90px",
                        overflowY: "auto",
                        marginBottom: "10px",
                      }}
                    >
                      {filteredMembers
                        .sort((a, b) => {
                          const isInTeamA = teams[editingTeam]?.includes(
                            a.email
                          );
                          const isInTeamB = teams[editingTeam]?.includes(
                            b.email
                          );

                          const isUnassignedA = a.team === "";
                          const isUnassignedB = b.team === "";

                          if (isInTeamA && !isInTeamB) return -1;
                          if (!isInTeamA && isInTeamB) return 1;

                          if (isUnassignedA && !isUnassignedB) return -1;
                          if (!isUnassignedA && isUnassignedB) return 1;

                          return 0;
                        })
                        .map((member) => {
                          const memberTeam = getMemberTeam(member.email);
                          const isInAnotherTeam =
                            memberTeam && memberTeam !== editingTeam;
                          const isInTeam = editedMembers[member.email];
                          const action = isInTeam ? "remove" : "add";

                          return (
                            <Box
                              key={member.email}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px",
                                marginBottom: "10px",
                                opacity: isInAnotherTeam ? 0.6 : 1,
                                borderBottom: "1px solid #333738",
                              }}
                            >
                              <Checkbox
                                disabled={isInAnotherTeam}
                                checked={isInTeam}
                                onChange={() =>
                                  handleCheckboxToggle(
                                    member.email,
                                    member.name,
                                    action
                                  )
                                }
                                sx={{
                                  color: isInAnotherTeam
                                    ? "#888888"
                                    : "#82D5C7",
                                  "&.Mui-checked": {
                                    color: "#82D5C7",
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  color: "#DDE4E1",
                                  flex: 1,
                                  marginLeft: "10px",
                                  textDecoration: isInAnotherTeam
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {member.name}
                                {isInAnotherTeam && ` (Team: ${member.team})`}
                              </Typography>
                              <Typography
                                sx={{ color: "#BEC9C5" }}
                                variant='body2'
                              >
                                {member.email}
                              </Typography>
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <CustomButton
                    text='Cancel'
                    onClick={cancelEditing}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #B5EDE4",
                      color: "#B5EDE4",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    }}
                  />
                  <CustomButton
                    text='Confirm'
                    onClick={saveChangesEditTeam}
                    sx={{
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "#80ccbc",
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        ))
      ) : (
        <Box
          sx={{
            padding: "20px",
            textAlign: "center",
            color: "white",
            opacity: 0.7,
          }}
        >
          No teams found
        </Box>
      )}

      <ConfirmationModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        action={modalData.action}
        context='team'
        itemName={modalData.memberName}
        teamName={modalData.teamName}
      />

      {confirmationDeleteModalOpen && teamToDelete && (
        <ConfirmationModal
          open={confirmationDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          action='delete'
          context='team'
          itemName={teamToDelete}
        />
      )}
    </Box>
  );
};

ManageTeams.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  showFeedback: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ManageTeams;
