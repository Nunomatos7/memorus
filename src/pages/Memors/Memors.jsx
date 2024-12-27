import React, { useState } from "react";
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

const initialOngoingMemors = [
  {
    id: 1,
    title: "Virtual Coffee Break",
    dueDate: "10/12/2024",
    submission: "No submission yet",
    status: "incomplete",
    timeLeft: "1 hour left",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 10,
    image: null,
  },
  {
    id: 2,
    title: "Fist bump a colleague",
    dueDate: "12/12/2024",
    submission: "No submission yet",
    status: "incomplete",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 20,
    image: null,
  },
  {
    id: 3,
    title: "Take a photo of your pet",
    dueDate: "17/12/2024",
    submission: "Submitted by a team member",
    status: "submitted",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 30,
    image: null,
  },
  {
    id: 4,
    title: "Fist bump a colleague",
    dueDate: "12/12/2024",
    submission: "No submission yet",
    status: "incomplete",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 40,
    image: null,
  },
  {
    id: 5,
    title: "Take a photo of your pet",
    dueDate: "17/12/2024",
    submission: "Submitted by a team member",
    status: "submitted",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 50,
    image: null,
  },
  {
    id: 6,
    title: "Virtual Coffee Break",
    dueDate: "10/12/2024",
    submission: "No submission yet",
    status: "incomplete",
    timeLeft: "1 hour left",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    points: 60,
    image: null,
  },
];

const allMemors = [
  {
    title: "Take a Selfie",
    dueDate: "10/12/2024",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    submittedOn: "Submitted on December 9th, 13h42",
    status: "submitted",
  },
  {
    title: "Cookie",
    dueDate: "10/12/2024",
    description: "For this team-building activity, capture your team cookies.",
    submittedOn: "Submitted on Due date on November 28th",
    status: "incomplete",
  },
  {
    title: "Ugly Sweater",
    dueDate: "10/12/2024",
    description: "Capture your ugly sweater team activity.",
    submittedOn: "Submitted on December 4th, 15h27",
    status: "submitted",
  },
  {
    title: "Take a Selfie",
    dueDate: "10/12/2024",
    description:
      "For this team-building activity, capture a fun selfie! Show off your personality and creativity. Once you're ready, snap the photo and upload it to complete the task. Let's see your team spirit!",
    submittedOn: "Submitted on December 9th, 13h42",
    status: "submitted",
  },
  {
    title: "Cookie",
    dueDate: "10/12/2024",
    description: "For this team-building activity, capture your team cookies.",
    submittedOn: "Submitted on Due date on November 28th",
    status: "incomplete",
  },
  {
    title: "Ugly Sweater",
    dueDate: "10/12/2024",
    description: "Capture your ugly sweater team activity.",
    submittedOn: "Submitted on December 4th, 15h27",
    status: "submitted",
  },
];

const Memors = () => {
  const [tab, setTab] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemor, setSelectedMemor] = useState(null);
  const [ongoingMemors, setOngoingMemors] = useState(initialOngoingMemors);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollRef = React.useRef();

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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemor(null);
    document.body.style.overflow = "auto";
  };

  const handleSubmitMemor = (id) => {
    setOngoingMemors((prevMemors) =>
      prevMemors.map((memor) =>
        memor.id === id
          ? {
              ...memor,
              submission: "Submitted by you",
              status: "submitted",
            }
          : memor
      )
    );
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // The `2` here controls scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const filteredMemors = allMemors.filter((memor) => {
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
    <div className="container">
      <Box sx={{ marginTop: "7vh" }}>
        <div className="memors-header">
          <Typography variant="h1" sx={{ fontWeight: "bold", color: "white" }}>
            Ongoing Memors
          </Typography>
          <p className="memors-ongoing"> ({ongoingMemors.length}) </p>
        </div>

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
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                    {memor.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Groups fontSize="small" sx={{ mr: 1, color: "gray" }} />
                    <Typography color="gray" sx={{ fontSize: "0.8rem" }}>
                      {memor.submission}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TodayIcon fontSize="small" sx={{ mr: 1, color: "gray" }} />
                    <Typography
                      variant="body2"
                      color="gray"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      Due on {memor.dueDate}
                    </Typography>
                  </Box>

                  {memor.timeLeft && (
                    <Chip
                      label={memor.timeLeft}
                      size="small"
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
                      label="Submitted"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 255, 163, 0.2)",
                        color: "#82D5C7",
                        borderRadius: "40px",
                        marginTop: "10px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                      }}
                    />
                  )}
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
                >
                  <Button
                    variant="contained"
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
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "16px",
                        lineHeight: "1",
                      }}
                    >
                      {">"}
                    </Typography>
                  </Button>

                  <Typography
                    variant="body2"
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
      </Box>
      {isModalOpen && (
        <SubmitMemorModal
          memor={selectedMemor}
          onClose={handleCloseModal}
          onSubmit={() => handleSubmitMemor(selectedMemor.id)} // Pass the memor's unique ID
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
        >
          <Tab value="all" label="All Memors" />
          <Tab value="completed" label="Completed" />
          <Tab value="incomplete" label="Incomplete" />
        </Tabs>

        <TextField
          placeholder="Search Memors"
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
            backgroundColor: "#1E1F20",
            borderRadius: "40px",
            input: { color: "white" },
            width: "250px",
          }}
        />
      </Box>
      <Paper sx={{ backgroundColor: "transparent", paddingBottom: "40px" }}>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {filteredMemors.map((memor, index) => (
            <Box key={index}>
              <ListItem
                className={`memor ${expandedIndex === index ? "expanded" : ""}`}
                sx={{
                  backgroundColor: "#1E1F20",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#2E2F30" },
                }}
                onClick={() => toggleExpand(index)}
              >
                <div className="memor">
                  <div className="title_date">
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {memor.title}
                    </Typography>{" "}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "gray",
                        fontSize: "0.8rem",
                      }}
                    >
                      {memor.dueDate}
                    </Typography>
                  </div>
                  <div className="description">
                    {expandedIndex === index
                      ? memor.description
                      : `${memor.description.substring(0, 50)}...`}
                  </div>
                  <div className="submission">{memor.submittedOn}</div>
                  <div className="status">
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
                          memor.status === "submitted" ? "#82D5C7" : "#D582B0",
                        borderRadius: "40px",
                        width: "7vw",
                      }}
                    />
                  </div>
                  <div className="arrowIcon">
                    <Button
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
                        variant="body"
                        sx={{
                          fontSize: "14px",
                          color: "white",
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
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Memors;
