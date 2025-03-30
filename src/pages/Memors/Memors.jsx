import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Alert
} from "@mui/material";
import { Groups, Search } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TodayIcon from "@mui/icons-material/Today";
import "./Memors.css";
import SubmitMemorModal from "../../Components/SubmitMemorModal/SubmitMemorModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { useLocation, useNavigate } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Loader from "../../Components/Loader/Loader";
import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import { useAuth } from "../../context/AuthContext";

const Memors = () => {
  const { token, user } = useAuth();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab") || "all";

  const navigate = useNavigate();

  const [tab, setTab] = useState(tabParam);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemor, setSelectedMemor] = useState(null);
  const [ongoingMemors, setOngoingMemors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCompetition, setCurrentCompetition] = useState(null);

  useEffect(() => {
    document.title = `Memor'us | Memors`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch active competition
        const competitionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );
        
        if (!competitionResponse.ok) {
          throw new Error("Failed to fetch active competition");
        }
        
        const competitionsData = await competitionResponse.json();
        
        if (!competitionsData || competitionsData.length === 0) {
          setLoading(false);
          setError("No active competition found");
          return;
        }
        
        const activeCompetition = competitionsData[0];
        setCurrentCompetition(activeCompetition);
        
        // Then fetch memors for this competition
        const memorResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions/${activeCompetition.id}/memors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );
        
        if (!memorResponse.ok) {
          throw new Error("Failed to fetch memors for this competition");
        }
        
        const memorsData = await memorResponse.json();
        
        // Process memors
        const processedMemors = memorsData.map(memor => ({
          ...memor,
          competitionName: activeCompetition.name,
          status: memor.has_my_submission ? "submitted" : "incomplete",
          submission: memor.has_my_submission
            ? "Submitted by you"
            : "No submission yet",
          dueDate: new Date(memor.due_date).toLocaleDateString("pt-PT"),
          timeLeft: getTimeLeft(memor.due_date),
        }));

        setOngoingMemors(processedMemors);
        
        // Check for memor ID in URL
        const pathnameParts = location.pathname.split("/");
        const memorIdFromUrl = pathnameParts[2]; // ex: /memors/1 → "1"

        if (memorIdFromUrl) {
          const memorToOpen = processedMemors.find(
            (memor) => String(memor.id) === memorIdFromUrl
          );
          if (memorToOpen) {
            setSelectedMemor(memorToOpen);
            setIsModalOpen(true);
            document.body.style.overflow = "hidden";
          }
        }
      } catch (err) {
        console.error("Error loading memors:", err);
        setError(`Failed to load memors: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.tenant_subdomain) {
      fetchData();
    }
  }, [token, user?.tenant_subdomain, location.pathname]);

  const getTimeLeft = (dueDate) => {
    const now = new Date();
    const end = new Date(dueDate);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} dia${days > 1 ? "s" : ""} restante${
      days > 1 ? "s" : ""
    }`;
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleOpenModal = (memor) => {
    setSelectedMemor(memor);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    navigate(`/memors/${memor.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemor(null);
    document.body.style.overflow = "auto";
    navigate("/memors");
  };

  const handleSubmitMemor = (id) => {
    setOngoingMemors((prevMemors) =>
      prevMemors.map((memor) =>
        memor.id === id
          ? {
              ...memor,
              submission: "Submitted by you",
              status: "submitted",
              has_my_submission: true
            }
          : memor
      )
    );
  };

  const filteredMemors = ongoingMemors.filter((memor) => {
    const matchesSearch = memor.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (tab === "completed") {
      return memor.status === "submitted" && matchesSearch;
    }
    if (tab === "incomplete") {
      return memor.status === "incomplete" && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <>
      <Loader />
      <div className='container'>
        <Box>
          <div className='memors-header'>
            <Typography
              variant='h4'
              component='h1'
              sx={{ fontWeight: "bold", color: "white" }}
            >
              {currentCompetition ? (
                <>
                  Ongoing Memors
                  <span className='memors-ongoing'> ({ongoingMemors.length})</span>
                </>
              ) : (
                loading ? 'Loading Memors...' : 'No Active Competition'
              )}
            </Typography>
          </div>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={40} sx={{ color: "#d0bcfe" }} />
            </Box>
          ) : error ? (
            <Alert severity="warning" sx={{ my: 2 }}>{error}</Alert>
          ) : (
            <>
              {/* Swiper Section */}
              <Swiper
                spaceBetween={80}
                breakpoints={{
                  640: {
                    slidesPerView: 2.3,
                  },
                  768: {
                    slidesPerView: 3.3,
                  },
                  1024: {
                    slidesPerView: 4.3,
                  },
                }}
                freeMode={true}
                mousewheel={{
                  releaseOnEdges: true,
                }}
                modules={[Mousewheel, FreeMode]}
              >
                {ongoingMemors.map((memor, index) => (
                  <SwiperSlide key={index}>
                    <Card
                      key={index}
                      sx={{
                        width: "300px",
                        height: "220px",
                        backgroundColor: "#1E1F20",
                        color: "white",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingBottom: "8px",
                        flexShrink: 0,
                      }}
                      tabIndex={0}
                      aria-label={`Memor: ${memor.title}`}
                    >
                      <CardContent>
                        <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                          {memor.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Groups
                            fontSize='small'
                            sx={{ mr: 1, color: "#CBCBCB" }}
                            aria-hidden='true'
                          />
                          <Typography color='#CBCBCB' sx={{ fontSize: "0.8rem" }}>
                            {memor.submission}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <TodayIcon
                            fontSize='small'
                            sx={{ mr: 1, color: "#CBCBCB" }}
                            aria-hidden='true'
                          />
                          <Typography
                            variant='body2'
                            color='#CBCBCB'
                            sx={{ fontSize: "0.8rem" }}
                          >
                            Due on {memor.dueDate}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          {memor.timeLeft && (
                            <Chip
                              label={memor.timeLeft}
                              size='small'
                              sx={{
                                backgroundColor: "rgba(255, 0, 136, 0.2)",
                                color: "#D582B0",
                                borderRadius: "40px",
                                marginTop: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                              }}
                            />
                          )}
                          {memor.status === "submitted" && (
                            <Chip
                              label='Submitted'
                              size='small'
                              sx={{
                                backgroundColor: "rgba(0, 255, 163, 0.2)",
                                color: "#82D5C7",
                                borderRadius: "40px",
                                marginTop: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          width: "fit-content",
                        }}
                        onClick={() => handleOpenModal(memor)}
                        role='button'
                        tabIndex={0}
                        aria-label={`View details for ${memor.title}`}
                      >
                        <Button
                          variant='contained'
                          aria-label='Add picture'
                          sx={{
                            backgroundColor: "#7E57C2",
                            color: "white",
                            borderRadius: "8px",
                            width: "30px",
                            height: "30px",
                            minWidth: "0px",
                            padding: "0px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                            "&:hover": {
                              backgroundColor: "#6A48B3",
                            },
                          }}
                        >
                          <AddRoundedIcon fontSize='small' />
                        </Button>

                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: "0.8rem",
                            color: "white",
                          }}
                        >
                          View details
                        </Typography>
                      </Box>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </Box>
        
        {isModalOpen && selectedMemor && (
          <SubmitMemorModal
            memor={selectedMemor}
            onClose={handleCloseModal}
            onSubmit={() => handleSubmitMemor(selectedMemor.id)}
          />
        )}

        {/* Divider */}
        <Divider
          sx={{
            backgroundColor: "gray",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        />

        {/* Tabs Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 16px 8px 16px",
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
                color: "#d0bcfe",
                padding: "6px 16px",
                borderRadius: "40px",
                border: "1px solid #938f99",
                marginRight: "10px",
                "&:hover": {
                  backgroundColor: "rgba(163, 133, 242, 0.2)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#d0bcfe",
                  color: "#381e72",
                  fontWeight: 600,
                },
              },
            }}
            aria-label='Memor Tabs'
          >
            <Tab value='all' label='All Memors' />
            <Tab value='completed' label='Completed' />
            <Tab value='incomplete' label='Incomplete' />
          </Tabs>

          <TextField
            placeholder='Search Memors'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search fontSize='small' sx={{ color: "#CBCBCB" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{
              "aria-label": "Search Memors",
            }}
            sx={{
              backgroundColor: "#1E1F20",
              borderRadius: "40px",
              input: { color: "white" },
              width: "250px",
              border: "0.905px solid #88938F",
              "& fieldset": { border: "none" },
              "&:hover": { backgroundColor: "#2E2F30" },
            }}
          />
        </Box>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress size={40} sx={{ color: "#d0bcfe" }} />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ my: 2 }}>{error}</Alert>
        ) : (
          <Paper sx={{ backgroundColor: "transparent", paddingBottom: "40px" }}>
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              aria-label='Memors List'
            >
              {filteredMemors.length > 0 ? (
                filteredMemors.map((memor, index) => (
                  <Box key={index}>
                    <ListItem
                      className={`memor ${
                        expandedIndex === index ? "expanded" : ""
                      }`}
                      sx={{
                        backgroundColor: "#1E1F20",
                        borderRadius: "12px",
                        padding: "12px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#2E2F30" },
                      }}
                      onClick={() => toggleExpand(index)}
                      role='button'
                      tabIndex={0}
                      aria-label={`Expand ${memor.title}`}
                    >
                      <div className='memor'>
                        <div className='title_date'>
                          <Typography
                            variant='h6'
                            sx={{
                              mb: 1,
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            {memor.title}
                          </Typography>{" "}
                          <Typography
                            variant='body2'
                            sx={{
                              color: "#CBCBCB",
                              fontSize: "0.8rem",
                            }}
                          >
                            {memor.dueDate}
                          </Typography>
                        </div>
                        <div className='description'>
                          {expandedIndex === index
                            ? memor.description
                            : `${memor.description.substring(0, 50)}...`}
                        </div>

                        <div className='status'>
                          <Chip
                            label={
                              memor.status === "submitted"
                                ? "Submitted"
                                : "Incomplete"
                            }
                            sx={{
                              bgcolor:
                                memor.status === "submitted"
                                  ? "rgba(0, 255, 163, 0.2)"
                                  : "rgba(255, 0, 136, 0.2)",
                              color:
                                memor.status === "submitted"
                                  ? "#82D5C7"
                                  : "#D582B0",
                              borderRadius: "40px",
                              width: "7vw",
                            }}
                          />
                        </div>
                        <div className='submissions'>
                          <BackupRoundedIcon
                            sx={{
                              color: "#CBCBCB",
                              fontSize: "35px",
                              cursor: "pointer",
                              "&:hover": { color: "white" },
                            }}
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(memor);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                handleOpenModal(memor);
                              }
                            }}
                            aria-label={`Submit ${memor.title}`}
                          />
                        </div>

                        <div className='arrowIcon'>
                          <Button
                            aria-label='expand'
                            sx={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              backgroundColor: "transparent",
                              padding: "0px",
                              minWidth: "0px",
                              "&:hover": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <Typography
                              variant='body'
                              alt='expand'
                              sx={{
                                fontSize: "14px",
                                color: "#CBCBCB",
                              }}
                            >
                              {expandedIndex === index ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </ListItem>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: "center", color: "#aaa" }}>
                  <Typography>
                    No {tab === "all" ? "" : tab} memors found{searchQuery ? " matching your search" : ""}
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        )}
      </div>
    </>
  );
};

export default Memors;