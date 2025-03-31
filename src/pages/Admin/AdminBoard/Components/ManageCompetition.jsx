import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import editIcon from "../../../../assets/images/editIcon.svg";
import CustomButton from "../../../../Components/CustomButton/CustomButton";
import api from "../../../../api/axiosInstance";
import PropTypes from "prop-types";

const ManageCompetition = ({
  searchQuery,
  openModal,
  showFeedback,
  setLoading,
}) => {
  const [competitions, setCompetitions] = useState([]);
  const [ongoingCompetition, setOngoingCompetition] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      // First, trigger an update of competition statuses
      await api.get("/api/competitions/update-statuses");

      // Then fetch the competitions
      const response = await api.get("/api/competitions");

      const formattedCompetitions = response.data.map((comp) => ({
        id: comp.id,
        title: comp.name,
        description: comp.description,
        startDate: formatDateForDisplay(comp.start_date),
        endDate: formatDateForDisplay(comp.end_date),
        status: comp.is_active ? "Ongoing" : "Closed",
      }));

      const ongoing = formattedCompetitions.find(
        (comp) => comp.status === "Ongoing"
      );
      setOngoingCompetition(ongoing || null);

      const finished = formattedCompetitions.filter(
        (comp) => comp.status === "Closed"
      );
      setCompetitions(finished);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      showFeedback("error", "Error", "Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.manageCompetitionsRef) {
      window.manageCompetitionsRef.fetchTeams = fetchCompetitions;
    } else {
      window.manageCompetitionsRef = { fetchCompetitions };
    }
    return () => {
      if (window.manageCompetitionsRef) {
        delete window.manageCompetitionsRef.fetchCompetitions;
      }
    };
  }, []);

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatDateForAPI = (dateString) => {
    const parts = dateString.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditCompetition = (competition) => {
    const compForModal = {
      ...competition,
      startDate: formatDateForAPI(competition.startDate),
      endDate: formatDateForAPI(competition.endDate),
    };
    openModal("competition", "edit", compForModal);
  };

  const calculateDaysLeft = (endDate) => {
    const parts = endDate.split("/");
    const date = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const timeDiff = date - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const filteredCompetitions = competitions.filter((comp) =>
    comp.title.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {ongoingCompetition ? (
            <CustomButton
              text='Create a Competition'
              disabled={true}
              sx={{
                backgroundColor: "rgba(49, 49, 49, 1)",
                color: "rgba(26, 26, 26, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "20px",
                border: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "rgba(49, 49, 49, 1)",
                },
                cursor: "not-allowed",
              }}
              icon={
                <Typography
                  component='span'
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(26, 26, 26, 1)",
                  }}
                >
                  +
                </Typography>
              }
            />
          ) : (
            <CustomButton
              text='Create a Competition'
              onClick={() => openModal("competition", "create")}
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
          )}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 4fr",
            marginTop: "40px",
          }}
        >
          <Typography
            variant='body1'
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: "20px",
            }}
          >
            Ongoing Competition
          </Typography>
          {ongoingCompetition ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "25px",
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: "10.861px",
                  border: "2.715px solid #333738",
                  background: "#272728",
                }}
              >
                <Box
                  sx={{
                    flex: 2,
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                    {ongoingCompetition.title}
                  </Typography>
                  <Typography variant='body2'>
                    {ongoingCompetition.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <Typography variant='body2'>Duration</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Typography variant='body2' sx={{ color: "#9FE9E4" }}>
                      {calculateDaysLeft(ongoingCompetition.endDate)} days
                      remaining
                    </Typography>
                    <Typography variant='body2'>
                      {ongoingCompetition.startDate} -{" "}
                      {ongoingCompetition.endDate}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => handleEditCompetition(ongoingCompetition)}
                  >
                    <img src={editIcon} alt='edit' style={{ width: "20px" }} />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0px 25px 25px 25px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  gap: "15px",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant='body2'
                  sx={{ fontWeight: "bold", color: "#C3AAAA" }}
                >
                  No Ongoing Competition
                </Typography>
                <Typography variant='body2' sx={{ color: "#C3AAAA" }}>
                  It looks like there are no active competitions right now. To
                  get started, simply create a new competition by clicking the
                  button. You can define the rules and set timelines.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            backgroundColor: "gray",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        />
        {/* Competition History */}
        <Typography
          variant='body1'
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: "20px",
          }}
        >
          Completed Competitions
        </Typography>

        {/* Table Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
            fontWeight: "bold",
            color: "white",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <Typography variant='body2' sx={{ flex: 2 }}>
            Title
          </Typography>
          <Typography variant='body2' sx={{ flex: 4 }}>
            Description
          </Typography>
          <Typography variant='body2' sx={{ flex: 2 }}>
            Duration
          </Typography>
          <Typography variant='body2' sx={{ flex: 1 }}></Typography>
        </Box>

        {/* Table Rows */}
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((comp, index) => (
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
                <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                  {comp.title}
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ flex: 4 }}>
                {expandedIndex === index
                  ? comp.description
                  : `${comp.description.substring(0, 50)}${
                      comp.description.length > 50 ? " (...)" : ""
                    }`}
              </Typography>
              <Typography variant='body2' sx={{ flex: 2 }}>
                {comp.startDate} - {comp.endDate}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton>
                  {expandedIndex === index ? (
                    <KeyboardArrowUp sx={{ color: "white" }} />
                  ) : (
                    <KeyboardArrowDown sx={{ color: "white" }} />
                  )}
                </IconButton>
              </Box>
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
            No completed competitions found
          </Box>
        )}
      </Box>
    </Box>
  );
};

ManageCompetition.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  showFeedback: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ManageCompetition;
