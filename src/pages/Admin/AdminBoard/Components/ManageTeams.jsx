import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  TextField,
} from "@mui/material";
import editIcon from "../../../../assets/images/editIcon.svg";
import deleteIcon from "../../../../assets/images/deleteIcon.svg";
import CustomButton from "../../../../Components/CustomButton/CustomButton";
import ConfirmationModal from "../../../../Components/ConfirmationModal/ConfirmationModal";
import api from "../../../../api/axiosInstance";
import PropTypes from "prop-types";

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

  const [confirmationDeleteModalOpen, setConfirmationDeleteModalOpen] =
    useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    fetchTeamsAndMembers();
  }, []);

  const fetchTeamsAndMembers = async () => {
    setLoading(true);
    try {
      const teamsResponse = await api.get("/api/teams");
      
      // Teams now come with pre-signed avatar URLs from the backend
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
    }
  };

  useEffect(() => {
    if (!window.manageTeamsRef) {
      window.manageTeamsRef = {};
    }

    const fetchTeamsAndMembersRef = async () => {
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
    setIsEditing(true);
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
      // Get team ID
      const teamObj = teamsData.find((t) => t.name === editingTeam);

      if (!teamObj) {
        throw new Error(`Team ${editingTeam} not found`);
      }

      const teamId = teamObj.id;

      const selectedEmails = Object.entries(editedMembers)
        .filter(([_, isSelected]) => isSelected)
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
        `The team "${editingTeam}" has been successfully updated.`
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
      setSearchQuery2("");
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
    setEditedMembers({});
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
                  gap: 2
                }}
              >
                {/* Team Avatar */}
                <Box>
                  <img
                    src={teamsData.find(t => t.name === teamName)?.avatar || "default_avatar.png"}
                    alt={`${teamName} avatar`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #82D5C7"
                    }}
                    onError={(e) => {
                      e.target.src = "default_avatar.png";
                    }}
                  />
                </Box>
                
                {/* Team Name */}
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
                
                {/* Team Members */}
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
                
                {/* Action Buttons */}
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
              // Edit mode
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 6fr",
                    gap: 5,
                  }}
                >
                  <Typography variant='body1' sx={{ color: "white" }}>
                    Editing Team: {teamName}
                  </Typography>
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

      {/* Confirmation Modal for Member Action */}
      <ConfirmationModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        action={modalData.action}
        context='team'
        itemName={modalData.memberName}
        teamName={modalData.teamName}
      />

      {/* Confirmation Modal for Team Deletion */}
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