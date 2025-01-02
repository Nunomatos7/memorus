import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import background1 from "../../../assets/images/adminBackground1.svg";
import background3 from "../../../assets/images/adminBackground2.svg";
import background2 from "../../../assets/images/adminBackground3.svg";
import { useState } from "react";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import {
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

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
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleTeamExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
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

  const teams = members.reduce((acc, member) => {
    const team = member.team || "No Team Assigned";
    if (!acc[team]) acc[team] = [];
    acc[team].push(member);
    return acc;
  }, {});

  const filteredTeams = Object.entries(teams).filter(([teamName]) =>
    teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
                Actions
              </Typography>
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
                    gap: "5px",
                  }}
                >
                  <IconButton>
                    <img src={editIcon} alt="edit" style={{ width: "20px" }} />
                  </IconButton>
                  <IconButton>
                    <img
                      src={deleteIcon}
                      alt="delete"
                      style={{ width: "20px" }}
                    />
                  </IconButton>
                  <IconButton onClick={(e) => e.stopPropagation()}>
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
                  marginBottom: "20px",
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleTeamExpand(teamName)}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {teamName}
                  </Typography>
                  <IconButton>
                    {expandedTeam === teamName ? (
                      <KeyboardArrowUp sx={{ color: "white" }} />
                    ) : (
                      <KeyboardArrowDown sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </Box>

                {expandedTeam === teamName && (
                  <Box sx={{ marginTop: "10px", paddingLeft: "20px" }}>
                    {teamMembers.map((member) => (
                      <Box
                        key={member.email}
                        sx={{
                          marginBottom: "10px",
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor: "#333738",
                        }}
                      >
                        <Typography sx={{ color: "white" }}>
                          {member.name} - {member.email}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AdminBoard;
