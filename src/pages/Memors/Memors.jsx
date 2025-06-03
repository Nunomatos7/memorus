import { useState, useEffect, useRef } from "react";
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
  Alert,
  Skeleton,
} from "@mui/material";
import { Groups, Search, Stars } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TodayIcon from "@mui/icons-material/Today";
import "./Memors.css";
import SubmitMemorModal from "../../Components/SubmitMemorModal/SubmitMemorModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { useLocation, useNavigate } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import Loader from "../../Components/Loader/Loader";
import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import { useAuth } from "../../context/AuthContext";

// Skeleton component for ongoing memor cards
const OngoingMemorSkeleton = () => (
  <Card
    sx={{
      width: "300px",
      height: "220px",
      backgroundColor: "#1E1F20",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      paddingBottom: "8px",
    }}
  >
    <CardContent>
      <Skeleton
        variant='text'
        sx={{ fontSize: "1.2rem", mb: 1, bgcolor: "#424242" }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Skeleton
          variant='circular'
          width={20}
          height={20}
          sx={{ mr: 1, bgcolor: "#424242" }}
        />
        <Skeleton
          variant='text'
          sx={{ fontSize: "0.8rem", width: "60%", bgcolor: "#424242" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Skeleton
          variant='circular'
          width={20}
          height={20}
          sx={{ mr: 1, bgcolor: "#424242" }}
        />
        <Skeleton
          variant='text'
          sx={{ fontSize: "0.8rem", width: "70%", bgcolor: "#424242" }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "10px", mt: 1 }}>
        <Skeleton
          variant='rounded'
          width={80}
          height={24}
          sx={{ bgcolor: "#424242", borderRadius: "20px" }}
        />
      </Box>
    </CardContent>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
      }}
    >
      <Skeleton
        variant='rounded'
        width={30}
        height={30}
        sx={{ bgcolor: "#424242", borderRadius: "8px" }}
      />
      <Skeleton
        variant='text'
        sx={{ fontSize: "0.8rem", width: "80px", bgcolor: "#424242" }}
      />
    </Box>
  </Card>
);

// Skeleton component for horizontal scrolling container
const OngoingMemorsCarouselSkeleton = () => (
  <Box sx={{ mb: 3 }}>
    <Swiper
      spaceBetween={20}
      slidesPerView='auto'
      freeMode={true}
      mousewheel={{ releaseOnEdges: true }}
      scrollbar={{
        hide: false,
        draggable: true,
        dragSize: "auto",
      }}
      modules={[Mousewheel, FreeMode, Scrollbar]}
      keyboard={{ enabled: true, onlyInViewport: true }}
      aria-label='Loading Ongoing Memors'
      style={{
        paddingBottom: "20px",
      }}
    >
      {[...Array(4)].map((_, index) => (
        <SwiperSlide key={index} style={{ width: "300px" }}>
          <OngoingMemorSkeleton />
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
);

// Skeleton component for memor list items
const MemorListItemSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <ListItem
      sx={{
        backgroundColor: "#1E1F20",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      <div className='memor' style={{ width: "100%" }}>
        <div className='title_date'>
          <Skeleton
            variant='text'
            sx={{ fontSize: "1rem", width: "200px", bgcolor: "#424242" }}
          />
        </div>
        <div className='description'>
          <Skeleton
            variant='text'
            sx={{ fontSize: "0.875rem", width: "80%", bgcolor: "#424242" }}
          />
          <Skeleton
            variant='text'
            sx={{
              fontSize: "0.875rem",
              width: "60%",
              bgcolor: "#424242",
              mt: 0.5,
            }}
          />
        </div>
        <div className='points'>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant='circular'
              width={20}
              height={20}
              sx={{ mr: 1, bgcolor: "#424242" }}
            />
            <Skeleton
              variant='text'
              sx={{ fontSize: "1rem", width: "80px", bgcolor: "#424242" }}
            />
          </Box>
        </div>
        <div className='status'>
          <Skeleton
            variant='rounded'
            width={80}
            height={24}
            sx={{ bgcolor: "#424242", borderRadius: "20px" }}
          />
        </div>
        <div className='submissions'>
          <Skeleton
            variant='circular'
            width={35}
            height={35}
            sx={{ bgcolor: "#424242" }}
          />
        </div>
        <div className='arrowIcon'>
          <Skeleton
            variant='rounded'
            width={30}
            height={30}
            sx={{ bgcolor: "#424242", borderRadius: "8px" }}
          />
        </div>
      </div>
    </ListItem>
  </Box>
);

// Skeleton component for the tabs and search section
const TabsSearchSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0px 16px 8px 16px",
    }}
  >
    <Box sx={{ display: "flex", gap: 1 }}>
      <Skeleton
        variant='rounded'
        width={80}
        height={32}
        sx={{ bgcolor: "#424242", borderRadius: "20px" }}
      />
      <Skeleton
        variant='rounded'
        width={90}
        height={32}
        sx={{ bgcolor: "#424242", borderRadius: "20px" }}
      />
      <Skeleton
        variant='rounded'
        width={85}
        height={32}
        sx={{ bgcolor: "#424242", borderRadius: "20px" }}
      />
    </Box>
    <Skeleton
      variant='rounded'
      width={250}
      height={40}
      sx={{ bgcolor: "#424242", borderRadius: "20px" }}
    />
  </Box>
);

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
  const [memors, setMemors] = useState([]);
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
          throw new Error(
            `Failed to fetch active competition: ${competitionResponse.status} ${competitionResponse.statusText}`
          );
        }

        const competitionsData = await competitionResponse.json();
        console.log("Active competitions:", competitionsData);

        if (!competitionsData || competitionsData.length === 0) {
          setLoading(false);
          setError("No active competition found");
          return;
        }

        const activeCompetition = competitionsData[0];
        setCurrentCompetition(activeCompetition);

        // Then fetch memors for this competition
        const memorResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions/${
            activeCompetition.id
          }/memors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );

        if (!memorResponse.ok) {
          throw new Error(
            `Failed to fetch memors for this competition: ${memorResponse.status} ${memorResponse.statusText}`
          );
        }

        const memorsData = await memorResponse.json();
        console.log("Memors data:", memorsData);

        // Process all memors
        const allProcessedMemors = memorsData.map((memor) => {
          const timeLeftInfo = getTimeLeft(memor.due_date);

          // For checking if expired, we need to compare to the end of the due date
          const dueDate = new Date(memor.due_date);
          dueDate.setHours(23, 59, 59, 999); // Set to end of day

          const now = new Date();
          const isExpired = dueDate < now;

          // Check if there are team submissions (but not by the current user)
          const hasTeamSubmission =
            memor.team_submissions &&
            memor.team_submissions.length > 0 &&
            !memor.has_my_submission;

          // Determine the status
          let status = "incomplete";
          if (memor.has_my_submission) {
            status = "submitted";
          } else if (hasTeamSubmission) {
            status = "team-submitted";
          } else if (isExpired) {
            status = "expired";
          }

          // Determine the submission text
          let submissionText = "No submission yet";
          if (memor.has_my_submission) {
            submissionText = "Submitted by you";
          } else if (hasTeamSubmission) {
            submissionText = "Submitted by team member";
          } else if (isExpired) {
            submissionText = "Expired";
          }

          return {
            ...memor,
            competitionName: activeCompetition.name,
            status: status,
            submission: submissionText,
            dueDate: new Date(memor.due_date).toLocaleDateString("pt-PT"),
            dueDateRaw: new Date(memor.due_date), // Keep raw date for sorting
            timeLeft: isExpired ? { text: "Expired", days: 0 } : timeLeftInfo,
            isExpired,
            hasTeamSubmission: hasTeamSubmission,
          };
        });

        // Filter for ongoing section - only active memors
        const ongoingMemors = allProcessedMemors
          .filter((memor) => !memor.isExpired)
          .sort((a, b) => a.dueDateRaw - b.dueDateRaw); // Sort by due date (closest first)

        setOngoingMemors(ongoingMemors);

        // All memors for the list below - sorted by due date (distant dates on top)
        const sortedAllMemors = [...allProcessedMemors].sort(
          (a, b) => b.dueDateRaw - a.dueDateRaw
        );
        setMemors(sortedAllMemors);

        // Check for memor ID in URL
        const pathnameParts = location.pathname.split("/");
        const memorIdFromUrl = pathnameParts[2];

        if (memorIdFromUrl) {
          const memorToOpen = allProcessedMemors.find(
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
    end.setHours(23, 59, 59, 999); // Set to end of the due date

    const diff = end - now;

    if (diff <= 0) return "Expired";

    // Calculate days remaining (same day = 1 day left)
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return {
      text: `< ${days} day${days > 1 ? "s" : ""} left${days > 1 ? "s" : ""}`,
      days: days,
    };
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleOpenModal = async (memor) => {
    console.log("Memors: Opening modal for memor:", memor);

    // Prepare memor for display
    const preparedMemor = { ...memor };

    // Fetch the pictures with alt_text from the API
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/memors/${memor.id}/pictures`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain,
          },
        }
      );

      if (response.ok) {
        const pictures = await response.json();
        console.log(
          "Memors: Fetched pictures with alt_text from API:",
          pictures
        );

        if (pictures && pictures.length > 0) {
          // Use the pictures from the API which include the correct alt_text
          preparedMemor.image = pictures;
          console.log("Memors: Using pictures from API with alt_text");
        } else {
          // Fall back to the existing images if API returns no pictures
          preparedMemor.image = Array.isArray(memor.image)
            ? memor.image.map((img) => {
                if (typeof img === "string") {
                  return {
                    img_src: img,
                    alt_text: `Image for ${memor.title}`,
                  };
                }
                return img;
              })
            : [];
        }
      } else {
        // Fall back to existing images if API call fails
        preparedMemor.image = Array.isArray(memor.image)
          ? memor.image.map((img) => {
              if (typeof img === "string") {
                return {
                  img_src: img,
                  alt_text: `Image for ${memor.title}`,
                };
              }
              return img;
            })
          : [];
      }
    } catch (error) {
      console.error("Error fetching pictures:", error);
      // Fall back to existing images on error
      preparedMemor.image = Array.isArray(memor.image)
        ? memor.image.map((img) => {
            if (typeof img === "string") {
              return {
                img_src: img,
                alt_text: `Image for ${memor.title}`,
              };
            }
            return img;
          })
        : [];
    }

    setSelectedMemor(preparedMemor);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";

    // Update URL without causing a page refresh using replaceState
    window.history.replaceState(null, "", `/app/memors/${memor.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemor(null);
    document.body.style.overflow = "auto";

    // Update URL without causing a page refresh using replaceState
    window.history.replaceState(null, "", "/app/memors");
  };

  const handleSubmitMemor = (id) => {
    setOngoingMemors((prevMemors) =>
      prevMemors.map((memor) =>
        memor.id === id
          ? {
              ...memor,
              submission: "Submitted by you",
              status: "submitted",
              has_my_submission: true,
            }
          : memor
      )
    );

    setMemors((prevMemors) =>
      prevMemors.map((memor) =>
        memor.id === id
          ? {
              ...memor,
              submission: "Submitted by you",
              status: "submitted",
              has_my_submission: true,
            }
          : memor
      )
    );
  };

  const filteredMemors = memors.filter((memor) => {
    const matchesSearch = memor.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (tab === "completed") {
      return memor.status === "submitted" && matchesSearch;
    }
    if (tab === "incomplete") {
      return (
        (memor.status === "incomplete" || memor.status === "expired") &&
        matchesSearch
      );
    }
    return matchesSearch;
  });

  return (
    <>
      {/* <Loader /> */}
      <div className='container'>
        <Box>
          <div className='memors-header'>
            {loading ? (
              <Skeleton
                variant='text'
                sx={{ fontSize: "2rem", width: "300px", bgcolor: "#424242" }}
              />
            ) : (
              <Typography
                variant='h4'
                component='h1'
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {currentCompetition ? (
                  <>
                    Ongoing Memors
                    <span className='memors-ongoing'>
                      {" "}
                      ({ongoingMemors.length})
                    </span>
                  </>
                ) : (
                  "No Active Competition"
                )}
              </Typography>
            )}
          </div>

          {loading ? (
            <OngoingMemorsCarouselSkeleton />
          ) : error ? (
            <Alert severity='warning' sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Swiper
                spaceBetween={20}
                slidesPerView='auto'
                freeMode={true}
                mousewheel={{ releaseOnEdges: true }}
                scrollbar={{
                  hide: false,
                  draggable: true,
                  dragSize: "auto",
                }}
                modules={[Mousewheel, FreeMode, Scrollbar]}
                keyboard={{ enabled: true, onlyInViewport: true }}
                aria-label='Ongoing Memors Carousel'
                style={{
                  paddingBottom: "20px",
                }}
              >
                {ongoingMemors.length > 0 ? (
                  ongoingMemors.map((memor, index) => (
                    <SwiperSlide key={index} style={{ width: "300px" }}>
                      <Card
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
                            <Typography
                              color='#CBCBCB'
                              sx={{ fontSize: "0.8rem" }}
                            >
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
                              Due on {memor.dueDate}{" "}
                              {memor.timeLeft && memor.timeLeft.days === 1}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: "10px" }}>
                            {memor.timeLeft && memor.timeLeft.days === 1 && (
                              <Chip
                                label={memor.timeLeft.text}
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

                        {memor.status !== "expired" &&
                          memor.status !== "submitted" && (
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
                          )}
                      </Card>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide style={{ width: "100%" }}>
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        color: "#aaa",
                        width: "100%",
                      }}
                    >
                      <Typography>
                        No ongoing memors available at this time
                      </Typography>
                    </Box>
                  </SwiperSlide>
                )}
              </Swiper>
            </Box>
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
        {loading ? (
          <Skeleton
            variant='rectangular'
            width='100%'
            height={1}
            sx={{ bgcolor: "#424242", my: 4 }}
          />
        ) : (
          <Divider
            sx={{
              backgroundColor: "gray",
              marginTop: "20px",
              marginBottom: "40px",
            }}
          />
        )}

        {/* Tabs Section */}
        {loading ? (
          <TabsSearchSkeleton />
        ) : (
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
        )}

        {loading ? (
          <Paper sx={{ backgroundColor: "transparent", paddingBottom: "40px" }}>
            <List sx={{ display: "flex", flexDirection: "column" }}>
              {[...Array(5)].map((_, index) => (
                <MemorListItemSkeleton key={index} />
              ))}
            </List>
          </Paper>
        ) : error ? (
          <Alert severity='warning' sx={{ my: 2 }}>
            {error}
          </Alert>
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
                              fontWeight: "bold",
                              color: "white",
                              fontSize:
                                expandedIndex === index ? "1.25rem" : "1rem",
                            }}
                          >
                            {memor.title}
                          </Typography>{" "}
                          {expandedIndex === index && (
                            <Typography
                              variant='body2'
                              sx={{
                                color: "#CBCBCB",
                                fontSize: "0.8rem",
                                mt: 1,
                              }}
                            >
                              Due on {memor.dueDate}
                            </Typography>
                          )}
                        </div>
                        <div className='description'>
                          {expandedIndex === index
                            ? memor.description
                            : `${memor.description.substring(0, 50)}${
                                memor.description.length > 50 ? "..." : ""
                              }`}
                        </div>

                        <div className='points'>
                          <Typography
                            variant='body2'
                            sx={{
                              color: "#CBCBCB",
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Stars />
                            {memor.points} points
                          </Typography>
                        </div>

                        <div className='status'>
                          <Chip
                            label={
                              memor.status === "submitted"
                                ? "Submitted"
                                : memor.status === "expired"
                                ? "Expired"
                                : "Incomplete"
                            }
                            sx={{
                              bgcolor:
                                memor.status === "submitted"
                                  ? "rgba(0, 255, 163, 0.2)"
                                  : memor.status === "expired"
                                  ? "rgba(105, 105, 105, 0.2)"
                                  : "rgba(255, 0, 136, 0.2)",
                              color:
                                memor.status === "submitted"
                                  ? "#82D5C7"
                                  : memor.status === "expired"
                                  ? "#aaaaaa"
                                  : "#D582B0",
                              borderRadius: "40px",
                              width: "7vw",
                            }}
                          />
                        </div>
                        <div className='submissions'>
                          {memor.status !== "expired" &&
                            memor.status !== "submitted" && (
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
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleOpenModal(memor);
                                  }
                                }}
                                aria-label={`Submit ${memor.title}`}
                              />
                            )}
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
                    No {tab === "all" ? "" : tab} memors found
                    {searchQuery ? " matching your search" : ""}
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
