import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Checkbox,
  Button,
} from "@mui/material";
import background1 from "../../../assets/images/adminBackground1.svg";
import background3 from "../../../assets/images/adminBackground2.svg";
import background2 from "../../../assets/images/adminBackground3.svg";
import { useState } from "react";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import ConfirmationModal from "../../../Components/ConfirmationModal/ConfirmationModal";

const AdminBoard = () => {
  const [tab, setTab] = useState("memors");
  const [tab2, setTab2] = useState("all");
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };
  const handleTabChange2 = (_, newValue) => {
    setTab2(newValue);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
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
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamThumbnail, setNewTeamThumbnail] = useState(null);
  const [newTeamMembers, setNewTeamMembers] = useState({});

  const memors = [
    {
      title: "Virtual Coffee Break",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "9:00H",
      teamsLeft: 1,
    },
    {
      title: "Fist Bump",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "9:00H",
      teamsLeft: 1,
    },
    {
      title: "Pet Photo",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "0:00H",
      teamsLeft: 1,
    },
    {
      title: "Ugly Sweater",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "0:00H",
      teamsLeft: 1,
    },
    {
      title: "Take a Selfie",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "9:00H",
      teamsLeft: 1,
    },
    {
      title: "Cookie Monster",
      description:
        "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
      date: "10/12/2024",
      points: "+ 10 pts",
      timeLeft: "0:00H",
      teamsLeft: 1,
    },
  ];

  const [teams, setTeams] = useState({
    "Visual Voyagers": [
      "johndoe@abc.com",
      "janedoe@abc.com",
      "johnsmith@abc.com",
      "janesmith@abc.com",
    ],
    "Code Crushers": [
      "charliebrown@abc.com",
      "lucybrown@abc.com",
      "snoopybrown@abc.com",
      "woodstockbrown@abc.com",
    ],
    "Design Divas": ["alice@abc.com", "bob@abc.com", "eve@abc.com"],
    "Marketing Mavericks": [
      "tonystark@abc.com",
      "pepperpotts@abc.com",
      "peterparker@abc.com",
    ],
    "Sales Superstars": [
      "steverogers@abc.com",
      "natasharomanoff@abc.com",
      "brucebanner@abc.com",
    ],
  });

  const members = [
    {
      name: "John Doe",
      email: "johndoe@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Jane Doe",
      email: "janedoe@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "John Smith",
      email: "johnsmith@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Jane Smith",
      email: "janesmith@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Charlie Brown",
      email: "charliebrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Lucy Brown",
      email: "lucybrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Snoopy Brown",
      email: "snoopybrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Woodstock Brown",
      email: "woodstockbrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Alice",
      email: "alice@abc.com",
      team: "Design Divas",
    },
    {
      name: "Bob",
      email: "bob@abc.com",
      team: "Design Divas",
    },
    {
      name: "Eve",
      email: "eve@abc.com",
      team: "Design Divas",
    },
    {
      name: "Tony Stark",
      email: "tonystark@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Thor Odinson",
      email: "thorOdinson@abc.com",
      team: "",
    },
    {
      name: "Per Pos",
      email: "perpos@abc.com",
      team: "",
    },
    {
      name: "ABC DEF",
      email: "abcdef@abc.com",
      team: "",
    },
    {
      name: "JKL MNO",
      email: "jklmno@abc.com",
      team: "",
    },
    {
      name: "Pepper Potts",
      email: "pepperpotts@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Peter Parker",
      email: "peterparker@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Steve Rogers",
      email: "steverogers@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Natasha Romanoff",
      email: "natasharomanoff@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Bruce Banner",
      email: "brucebanner@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Loki Laufeyson",
      email: "lokilaufaeyson@abc.com",
      team: "",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredMemors = memors
    .filter((memor) =>
      memor.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((memor) => {
      if (tab2 === "all") return true;
      if (tab2 === "ongoing") return memor.timeLeft !== "0:00H";
      if (tab2 === "closed") return memor.timeLeft === "0:00H";
      return true;
    });

  const filteredMembers = Object.values(members).filter((member) =>
    member.name.toLowerCase().includes(searchQuery2.toLowerCase())
  );

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

  const saveChanges = () => {
    if (!newTeamName.trim()) {
      alert("Please enter a team name.");
      return;
    }

    const selectedEmails = Object.entries(newTeamMembers)
      .filter(([_, isSelected]) => isSelected)
      .map(([email]) => email);

    if (editingTeam) {
      // Editing an existing team
      setTeams((prev) => ({
        ...prev,
        [editingTeam]: selectedEmails,
      }));
    } else {
      // Creating a new team
      setTeams((prev) => ({
        ...prev,
        [newTeamName]: selectedEmails,
      }));
    }

    // Reset the form and close the modal
    handleTeamModalClose();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
    setEditedMembers({});
    setNewTeamThumbnail(null);
    setSearchQuery2("");
  };

  const getMemberTeam = (email) => {
    return Object.entries(teams).find(([_, members]) =>
      members.includes(email)
    )?.[0];
  };

  const confirmDeleteTeam = () => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      delete updatedTeams[teamToDelete];
      return updatedTeams;
    });
    setDeleteTeamModalOpen(false);
    setTeamToDelete(null);
  };

  const cancelDeleteTeam = () => {
    setDeleteTeamModalOpen(false);
    setTeamToDelete(null);
  };

  const filteredTeams = Object.entries(teams).filter(([teamName]) =>
    teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleCreateTeam = () => {
  //   if (newTeamName.trim()) {
  //     setTeams((prevTeams) => ({
  //       ...prevTeams,
  //       [newTeamName]: Object.entries(newTeamMembers)
  //         .filter(([_, isSelected]) => isSelected)
  //         .map(([email]) => email),
  //     }));
  //     handleTeamModalClose();
  //     setNewTeamName("");
  //     setNewTeamThumbnail(null);
  //     setNewTeamMembers({});
  //   } else {
  //     alert("Please enter a team name.");
  //   }
  // };

  const handleTeamModalClose = () => {
    setIsCreateModalOpen(false);
    setNewTeamThumbnail(null);
    setNewTeamMembers({});
    setNewTeamName("");
    setSearchQuery3("");
    document.body.style.overflow = "auto";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTeamThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const unassignedMembers = members.filter((member) => member.team === "");

  const filteredUnassignedMembers = unassignedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery3.toLowerCase())
  );

  const handleTeamModalOpen = () => {
    setIsCreateModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="container">
      <img
        src={background1}
        alt="leaderboard-bg1"
        style={{
          position: "absolute",
          top: "2",
          right: "0",
          width: "15%",
          zIndex: "0",
        }}
      />
      <img
        src={background2}
        alt="leaderboard-bg2"
        style={{
          position: "absolute",
          top: "25%",
          left: "5%",
          width: "5%",
          zIndex: "0",
        }}
      />
      <img
        src={background3}
        alt="leaderboard-bg3"
        style={{
          position: "absolute",
          top: "35%",
          right: "6%",
          width: "5%",
          zIndex: "0",
        }}
      />
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          color: "white",
          marginBottom: "30px",
          padding: "20px",
        }}
      >
        Admin Board
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Tabs
            value={tab}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14px",
                color: "#CCE8E2",
                padding: "6px 16px",
                borderRadius: "40px",
                border: "1px solid #938f99",
                marginRight: "10px",
                "&:hover": {
                  backgroundColor: "rgba(204, 232, 226, 0.08)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#384c44",
                  color: "#CCE8E2",
                },
              },
            }}
          >
            <Tab value="memors" label="Manage Memors" />
            <Tab value="teams" label="Manage Teams" />
            <Tab value="competition" label="Manage Competition" />
          </Tabs>
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              borderRadius: "40px",
              input: { color: "white" },
              width: "250px",
              border: "0.905px solid #88938F",
            }}
          />
        </Box>

        {tab === "memors" && (
          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
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
                text="Create a Memor"
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
                  "&:hover": {
                    backgroundColor: "#A3DFD8",
                  },
                }}
                icon={
                  <Typography
                    component="span"
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

              <Tabs
                value={tab2}
                onChange={handleTabChange2}
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "14px",
                    color: "#82D5C7",
                    padding: "6px 16px",
                    borderRadius: "40px",
                    border: "1px solid #938f99",
                    marginRight: "10px",
                    "&:hover": { backgroundColor: "rgba(130, 213, 199, 0.08)" },
                    "&.Mui-selected": {
                      backgroundColor: "#88d4c4",
                      color: "#003731",
                    },
                  },
                }}
              >
                <Tab value="all" label="All Memors" />
                <Tab value="ongoing" label="Ongoing" />
                <Tab value="closed" label="Closed" />
              </Tabs>
            </Box>

            {/* Table Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                fontWeight: "bold",
                color: "white",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ flex: 2 }}>
                Title
              </Typography>
              <Typography variant="body2" sx={{ flex: 4 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                Points
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                Time Left
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                Teams Left
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}></Typography>
            </Box>

            {/* Table Rows */}
            {filteredMemors.map((memor, index) => (
              <Box
                key={index}
                onClick={() => toggleExpand(index)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px",
                  alignItems: "center",
                  color: "white",
                  marginBottom: "10px",
                  borderRadius: "10.861px",
                  border: "2.715px solid #333738",
                  background: "#272728",
                  cursor: "pointer",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#3a3b3c",
                  },
                }}
              >
                <Box sx={{ flex: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {memor.title}
                  </Typography>
                  {expandedIndex === index && (
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      {memor.date}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ flex: 4 }}>
                  {expandedIndex === index
                    ? memor.description
                    : `${memor.description.substring(0, 50)} (...)`}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {memor.points}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {memor.timeLeft !== "0:00H" && memor.timeLeft}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {memor.teamsLeft}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "right",
                    gap: "5px",
                  }}
                >
                  <IconButton onClick={(e) => e.stopPropagation()}>
                    {memor.timeLeft !== "0:00H" && (
                      <img
                        src={editIcon}
                        alt="edit"
                        style={{ width: "20px" }}
                      />
                    )}
                  </IconButton>
                  <IconButton onClick={(e) => e.stopPropagation()}>
                    {memor.timeLeft !== "0:00H" && (
                      <img
                        src={deleteIcon}
                        alt="delete"
                        style={{ width: "20px" }}
                      />
                    )}
                  </IconButton>
                  <IconButton >
                    {expandedIndex === index ? (
                      <KeyboardArrowUp sx={{ color: "white" }} />
                    ) : (
                      <KeyboardArrowDown sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {tab === "teams" && (
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
                text="Create a Team"
                onClick={() => handleTeamModalOpen()}
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
                    component="span"
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

            {filteredTeams.map(([teamName, teamMembers]) => (
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
                  // Default view
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 4fr 1fr",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      {teamName}
                    </Typography>
                    <Typography>
                      Members:{" "}
                      {teamMembers
                        .slice(0, 3)
                        .map(
                          (email) =>
                            members.find((member) => member.email === email)
                              ?.name
                        )
                        .join(", ")}
                      {teamMembers.length > 3 && "..."}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton onClick={() => startEditing(teamName)}>
                        <img
                          src={editIcon}
                          alt="Edit"
                          style={{ width: "20px" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setTeamToDelete(teamName);
                          setDeleteTeamModalOpen(true);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
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
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Editing Team: {teamName}
                      </Typography>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "white", marginBottom: "10px" }}
                        >
                          Members
                        </Typography>
                        <TextField
                          placeholder="Search"
                          value={searchQuery2}
                          onChange={(e) => setSearchQuery2(e.target.value)}
                          variant="outlined"
                          size="small"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search
                                    fontSize="small"
                                    sx={{ color: "gray" }}
                                  />
                                </InputAdornment>
                              ),
                            },
                          }}
                          sx={{
                            borderRadius: "40px",
                            input: { color: "white" },
                            width: "250px",
                            height: "40px",
                            border: "0.905px solid #88938F",
                            marginBottom: "10px",
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
                                memberTeam && memberTeam !== teamName;
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
                                    {isInAnotherTeam &&
                                      ` (Team: ${member.team})`}
                                  </Typography>
                                  <Typography
                                    sx={{ color: "#BEC9C5" }}
                                    variant="body2"
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
                        text="Cancel"
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
                        text="Confirm"
                        onClick={saveChanges}
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
            ))}
          </Box>
        )}
        {/* Confirmation Modal */}
        <ConfirmationModal
          open={modalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          action={modalData.action}
          memberName={modalData.memberName}
          teamName={modalData.teamName}
        />

        {/* Confirmation Modal for Deleting Team */}
        {deleteTeamModalOpen && (
          <ConfirmationModal
            open={deleteTeamModalOpen}
            onClose={cancelDeleteTeam}
            onConfirm={confirmDeleteTeam}
            action="delete"
            memberName=""
            teamName={teamToDelete}
          />
        )}

        {/* Create Team Modal */}
        {isCreateModalOpen && (
          <div className="modal-overlay-submit-memor">
            <div
              className="modal-container"
              style={{ padding: "20px", maxWidth: "600px" }}
            >
              <div className="modal-top" style={{ marginBottom: "20px" }}>
                <Button
                  onClick={() => handleTeamModalClose()}
                  sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
                >
                  <ArrowBackIcon />
                </Button>
                <Typography
                  variant="h6"
                  sx={{ marginLeft: "10px", color: "#BEC9C5" }}
                >
                  Admin Board
                </Typography>
              </div>
              <Typography
                variant="h5"
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
                variant="outlined"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                fullWidth
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputBase-input": { color: "#FFFFFF" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#888" },
                    "&:hover fieldset": { borderColor: "#AAA" },
                    "&.Mui-focused fieldset": { borderColor: "#CCC" },
                  },
                  "& .MuiInputLabel-root": { color: "#888" },
                }}
              />
              <Typography
                variant="body1"
                sx={{ color: "#CAC4D0", marginBottom: "10px" }}
              >
                Thumbnail
              </Typography>
              <div
                style={{
                  border: "1px dashed #888",
                  borderRadius: "10px",
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
                  <img
                    src={newTeamThumbnail}
                    alt="Uploaded Thumbnail"
                    style={{ borderRadius: "10px", height: "120px" }}
                  />
                ) : (
                  <>
                    <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={background3}
                          alt="Upload Thumbnail"
                          style={{
                            width: "50px",
                            height: "50px",
                            marginBottom: "10px",
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "#888" }}>
                          Upload file from computer
                        </Typography>
                      </div>
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="file-input"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>
              <Typography
                variant="body1"
                sx={{ color: "#CAC4D0", marginBottom: "10px" }}
              >
                Members
              </Typography>
              <TextField
                placeholder="Search Name"
                value={searchQuery3}
                onChange={(e) => setSearchQuery3(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputBase-input": { color: "#FFFFFF" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#888" },
                    "&:hover fieldset": { borderColor: "#AAA" },
                    "&.Mui-focused fieldset": { borderColor: "#CCC" },
                  },
                  "& .MuiInputLabel-root": { color: "#888" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "#1E1E1E",
                  borderRadius: "10px",
                  padding: "10px",
                  border: "1px solid #333",
                }}
              >
                {filteredUnassignedMembers.map((member) => (
                  <Box
                    key={member.email}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
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
                    />
                    <Typography sx={{ color: "#FFFFFF" }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      {member.email}
                    </Typography>
                  </Box>
                ))}
              </div>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  marginTop: "20px",
                }}
              >
                <CustomButton
                  text="Cancel"
                  onClick={handleTeamModalClose}
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
                  text="Confirm"
                  onClick={saveChanges}
                  sx={{
                    borderRadius: "50px",
                    "&:hover": {
                      backgroundColor: "#80ccbc",
                    },
                  }}
                />
              </Box>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default AdminBoard;
