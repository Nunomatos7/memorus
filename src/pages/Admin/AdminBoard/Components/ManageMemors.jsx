import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Tabs, Tab } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import editIcon from "../../../../assets/images/editIcon.svg";
import deleteIcon from "../../../../assets/images/deleteIcon.svg";
import CustomButton from "../../../../Components/CustomButton/CustomButton";
import ConfirmationModal from "../../../../Components/ConfirmationModal/ConfirmationModal";
import api from "../../../../api/axiosInstance";
import PropTypes from "prop-types";

const ManageMemors = ({
  searchQuery,
  tab2,
  onTabChange,
  openModal,
  showFeedback,
  setLoading,
}) => {
  const [memors, setMemors] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [memorToDelete, setMemorToDelete] = useState(null);

  useEffect(() => {
    fetchMemors();
  }, [tab2]);

  const fetchMemors = async () => {
    setLoading(true);
    try {
      const competitionsResponse = await api.get("/api/competitions");
      const activeCompetition = competitionsResponse.data.find(
        (comp) => comp.is_active
      );

      if (!activeCompetition) {
        setMemors([]);
        setLoading(false);
        return;
      }

      // Get memors for the active competition
      const memorsResponse = await api.get(
        `/api/competitions/${activeCompetition.id}/memors`
      );

      const formattedMemors = memorsResponse.data.map((memor) => ({
        id: memor.id,
        title: memor.title,
        description: memor.description,
        date: new Date(memor.due_date).toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
        points: `+ ${memor.points} pts`,
        teamsLeft: memor.team_submissions ? memor.team_submissions.length : 0,
        is_done: memor.is_done,
      }));

      setMemors(formattedMemors);
    } catch (error) {
      console.error("Error fetching memors:", error);
      showFeedback("error", "Error", "Failed to load memors");
    } finally {
      setLoading(false);
    }
  };
  // In ManageMemors.jsx - Replace the current useEffect with this one

  useEffect(() => {
    // Set up the global reference immediately
    if (!window.manageMemorsRef) {
      window.manageMemorsRef = {};
    }

    // Define the reference to the current fetchMemors function
    const fetchMemorsRef = async () => {
      setLoading(true);
      try {
        const competitionsResponse = await api.get("/api/competitions");
        const activeCompetition = competitionsResponse.data.find(
          (comp) => comp.is_active
        );

        if (!activeCompetition) {
          setMemors([]);
          setLoading(false);
          return;
        }

        // Get memors for the active competition
        const memorsResponse = await api.get(
          `/api/competitions/${activeCompetition.id}/memors`
        );

        const formattedMemors = memorsResponse.data.map((memor) => ({
          id: memor.id,
          title: memor.title,
          description: memor.description,
          date: new Date(memor.due_date).toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
          points: `+ ${memor.points} pts`,
          teamsLeft: memor.team_submissions ? memor.team_submissions.length : 0,
          is_done: memor.is_done,
        }));

        setMemors(formattedMemors);
      } catch (error) {
        console.error("Error fetching memors:", error);
        showFeedback("error", "Error", "Failed to load memors");
      } finally {
        setLoading(false);
      }
    };

    // Store the function reference
    window.manageMemorsRef.fetchMemors = fetchMemorsRef;

    // Initial data fetch
    fetchMemorsRef();

    // Cleanup when component unmounts
    return () => {
      if (window.manageMemorsRef?.fetchMemors === fetchMemorsRef) {
        delete window.manageMemorsRef.fetchMemors;
      }
    };
  }, [tab2]); // Only depend on tab2 to avoid infinite loops

  const deleteMemor = async (memor) => {
    setLoading(true);
    try {
      await api.delete(`/api/memors/${memor.id}`);
      showFeedback(
        "success",
        "Memor Deleted",
        `The memor "${memor.title}" has been successfully deleted.`
      );
      fetchMemors(); // Refresh the list
    } catch (error) {
      console.error("Error deleting memor:", error);
      showFeedback(
        "error",
        "Error",
        `Failed to delete memor: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditMemor = (memor) => {
    openModal("memor", "edit", memor);
  };

  const handleDeleteMemor = (memor) => {
    setMemorToDelete(memor);
    setConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (memorToDelete) {
      deleteMemor(memorToDelete);
    }
    setConfirmationModalOpen(false);
    setMemorToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfirmationModalOpen(false);
    setMemorToDelete(null);
  };

  const calculateDaysLeft = (dateString) => {
    const parts = dateString.split("/");
    // Convert from DD/MM/YYYY to MM/DD/YYYY for JS Date
    const dueDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
    const today = new Date();

    // Reset time to midnight for comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const timeDiff = dueDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const filteredMemors = memors
    .filter((memor) =>
      memor.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((memor) => {
      if (tab2 === "all") return true;
      if (tab2 === "ongoing") return calculateDaysLeft(memor.date) > 0;
      if (tab2 === "closed") return calculateDaysLeft(memor.date) <= 0;
      return true;
    });

  return (
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
          text='Create a Memor'
          onClick={() => openModal("memor", "create")}
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

        <Tabs
          value={tab2}
          onChange={onTabChange}
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
              "&:hover": {
                backgroundColor: "rgba(130, 213, 199, 0.08)",
              },
              "&.Mui-selected": {
                backgroundColor: "#88d4c4",
                color: "#003731",
              },
            },
          }}
        >
          <Tab value='all' label='All Memors' />
          <Tab value='ongoing' label='Ongoing' />
          <Tab value='closed' label='Closed' />
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
        <Typography variant='body2' sx={{ flex: 2 }}>
          Title
        </Typography>
        <Typography variant='body2' sx={{ flex: 4 }}>
          Description
        </Typography>
        <Typography variant='body2' sx={{ flex: 1 }}>
          Points
        </Typography>
        <Typography variant='body2' sx={{ flex: 1 }}>
          Time Left
        </Typography>
        <Typography variant='body2' sx={{ flex: 1 }}>
          Teams Left
        </Typography>
        <Typography variant='body2' sx={{ flex: 1 }}></Typography>
      </Box>

      {/* Table Rows */}
      {filteredMemors.length > 0 ? (
        filteredMemors.map((memor, index) => (
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
                {memor.title}
              </Typography>
              {expandedIndex === index && (
                <Typography variant='caption' sx={{ color: "#CBCBCB" }}>
                  {memor.date}
                </Typography>
              )}
            </Box>
            <Typography variant='body2' sx={{ flex: 4 }}>
              {expandedIndex === index
                ? memor.description
                : `${memor.description.substring(0, 50)}${
                    memor.description.length > 50 ? " (...)" : ""
                  }`}
            </Typography>
            <Typography variant='body2' sx={{ flex: 1 }}>
              {memor.points}
            </Typography>
            <Typography variant='body2' sx={{ flex: 1 }}>
              {(() => {
                const daysLeft = calculateDaysLeft(memor.date);
                if (daysLeft > 0) {
                  return `${daysLeft} days left`;
                } else if (daysLeft === 0) {
                  return (
                    <span style={{ color: "#d8504d" }}>&lt; 1 day left</span>
                  );
                } else {
                  return <span style={{ color: "#d8504d" }}>Closed</span>;
                }
              })()}
            </Typography>
            <Typography variant='body2' sx={{ flex: 1 }}>
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
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditMemor(memor);
                }}
                sx={{
                  display: calculateDaysLeft(memor.date) < 0 ? "none" : "block",
                }}
              >
                <img src={editIcon} alt='edit' style={{ width: "20px" }} />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMemor(memor);
                }}
                sx={{
                  display: calculateDaysLeft(memor.date) < 0 ? "none" : "block",
                }}
              >
                <img src={deleteIcon} alt='delete' style={{ width: "20px" }} />
              </IconButton>

              <IconButton aria-label='expand'>
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
          No memors found
        </Box>
      )}
      {/* Confirmation Modal */}
      {confirmationModalOpen && memorToDelete && (
        <ConfirmationModal
          open={confirmationModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          action='delete'
          context='memor'
          itemName={memorToDelete.title}
        />
      )}
    </Box>
  );
};

ManageMemors.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  tab2: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  showFeedback: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ManageMemors;
