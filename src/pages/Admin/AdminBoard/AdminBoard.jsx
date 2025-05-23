import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import background1 from "../../../assets/images/adminBackground1.svg";
import background2 from "../../../assets/images/adminBackground2.svg";
import background3 from "../../../assets/images/adminBackground3.svg";
import Loader from "../../../Components/Loader/Loader";
import ManageMemors from "./Components/ManageMemors";
import ManageTeams from "./Components/ManageTeams";
import ManageCompetition from "./Components/ManageCompetition";
import DynamicModal from "./Components/DynamicModal";
import FeedbackModal from "../../../Components/FeedbackModal/FeedbackModal";
import { useLocation } from "react-router-dom";

const AdminBoard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab") || "all";

  const [tab, setTab] = useState("memors");
  const [tab2, setTab2] = useState(tabParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState(tab);
  const [loading, setLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
  });
  const [modalState, setModalState] = useState({
    open: false,
    type: null,
    action: null,
    data: null,
  });

  useEffect(() => {
    console.log(`Refreshing ${activeTab} data (trigger: ${refreshTrigger})`);

    if (activeTab === "memors" && window.manageMemorsRef?.fetchMemors) {
      window.manageMemorsRef.fetchMemors();
    } else if (activeTab === "teams" && window.manageTeamsRef?.fetchTeams) {
      window.manageTeamsRef.fetchTeams();
    } else if (
      activeTab === "competition" &&
      window.manageCompetitionRef?.fetchCompetitions
    ) {
      window.manageCompetitionRef.fetchCompetitions();
    }
  }, [activeTab, refreshTrigger]);

  useEffect(() => {
    document.title = `Memor'us | Admin board`;
  }, []);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setActiveTab(newValue);
    setSearchQuery("");
  };

  const handleTabChange2 = (_, newValue) => {
    setTab2(newValue);
  };

  const cleanSearchQuery = () => {
    setSearchQuery("");
  };

  const openModal = (type, action, data = null) => {
    setModalState({
      open: true,
      type,
      action,
      data,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      type: null,
      action: null,
      data: null,
    });

    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 300);
  };
  const showFeedback = (type, title, description) => {
    setFeedbackModal({
      open: true,
      type,
      title,
      description,
    });
  };

  return (
    <>
      <Loader loading={loading} />

      <div className='container'>
        <img
          src={background1}
          alt='leaderboard-bg1'
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
          alt='leaderboard-bg2'
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
          alt='leaderboard-bg3'
          style={{
            position: "absolute",
            top: "35%",
            right: "6%",
            width: "5%",
            zIndex: "0",
          }}
        />
        <Typography
          variant='h4'
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
              onChange={(event, newValue) => {
                handleTabChange(event, newValue);
                cleanSearchQuery();
              }}
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
              <Tab value='memors' label='Manage Memors' />
              <Tab value='teams' label='Manage Teams' />
              <Tab value='competition' label='Manage Competition' />
            </Tabs>
            <TextField
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant='outlined'
              size='small'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search fontSize='small' sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                },
              }}
              inputProps={{
                "aria-label": "Search",
              }}
              sx={{
                borderRadius: "40px",
                input: { color: "white" },
                width: "250px",
                border: "0.905px solid #88938F",
                "& fieldset": { border: "none" },
                "&:hover": { backgroundColor: "#2E2F30" },
              }}
            />
          </Box>

          {tab === "memors" && (
            <ManageMemors
              searchQuery={searchQuery}
              tab2={tab2}
              onTabChange={handleTabChange2}
              openModal={openModal}
              showFeedback={showFeedback}
              setLoading={setLoading}
            />
          )}

          {tab === "teams" && (
            <ManageTeams
              searchQuery={searchQuery}
              openModal={openModal}
              showFeedback={showFeedback}
              setLoading={setLoading}
            />
          )}

          {tab === "competition" && (
            <ManageCompetition
              searchQuery={searchQuery}
              openModal={openModal}
              showFeedback={showFeedback}
              setLoading={setLoading}
            />
          )}

          {/* Dynamic Modal */}
          {modalState.open && (
            <DynamicModal
              modalType={modalState.type}
              action={modalState.action}
              data={modalState.data}
              onClose={closeModal}
              showFeedback={showFeedback}
              setLoading={setLoading}
              refreshData={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}

          {/* Feedback Modal */}
          {feedbackModal.open && (
            <FeedbackModal
              type={feedbackModal.type}
              title={feedbackModal.title}
              description={feedbackModal.description}
              actions={[
                {
                  label: "Close",
                  onClick: () =>
                    setFeedbackModal({
                      open: false,
                      type: "",
                      title: "",
                      description: "",
                    }),
                  style: { backgroundColor: "#4caf50", color: "#fff" },
                },
              ]}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export default AdminBoard;
