import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Skeleton,
} from "@mui/material";
import MemorPicture from "./../../../Components/MemorPicture/MemorPicture";
import "swiper/css";
import "swiper/css/free-mode";
import "./Home.css";
import rank1 from "../../../assets/images/adminRank1.svg";
import rank2 from "../../../assets/images/adminRank2.svg";
import rank3 from "../../../assets/images/adminRank3.svg";
import ongoing from "../../../assets/images/ongoingAdmin.svg";
import closed from "../../../assets/images/closedAdmin.svg";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import background1 from "../../../assets/images/adminBackground1.svg";
import background2 from "../../../assets/images/adminBackground2.svg";
import background3 from "../../../assets/images/adminBackground3.svg";
import Countdown from "../../../Components/Countdown/Countdown";
import { useAuth } from "../../../context/AuthContext";
import PropTypes from "prop-types";

const rankImages = {
  1: rank1,
  2: rank2,
  3: rank3,
};

// Skeleton component for carousel items
const CarouselSkeleton = () => (
  <div className='latest-wrapper'>
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className='latest-memors-pic'
        style={{ marginRight: "20px", display: "inline-block", width: "200px" }}
      >
        <Skeleton
          variant='rectangular'
          width='100%'
          height={150}
          sx={{ borderRadius: 2, mb: 1, bgcolor: "#424242" }}
        />
        <Skeleton
          variant='text'
          sx={{ fontSize: "1rem", mb: 0.5, bgcolor: "#424242" }}
        />
        <Skeleton
          variant='text'
          sx={{ fontSize: "0.9rem", mb: 0.5, bgcolor: "#424242" }}
        />
        <Skeleton
          variant='text'
          sx={{ fontSize: "0.8rem", width: "60%", bgcolor: "#424242" }}
        />
      </div>
    ))}
  </div>
);

// Skeleton component for stat cards
const StatCardSkeleton = ({ cardId }) => (
  <Card className='card'>
    <CardContent>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Skeleton
          variant='text'
          sx={{ fontSize: "2rem", width: "40px", bgcolor: "#424242" }}
        />
        {cardId === "ongoing" ? (
          <img src={ongoing} alt='Ongoing memors icon' />
        ) : (
          <img src={closed} alt='Closed memors icon' />
        )}
      </Box>
      <Typography variant='body2' color='#B0B0B0'>
        {cardId === "ongoing" ? "Pending Memors" : "Completed Memors"}
      </Typography>
    </CardContent>
  </Card>
);

// Skeleton component for countdown card
const CountdownSkeleton = () => (
  <Card className='card'>
    <CardContent>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Skeleton
          variant='text'
          sx={{ fontSize: "1.25rem", width: "80%", mb: 2, bgcolor: "#424242" }}
        />
        <Box display='flex' gap={2}>
          {[...Array(4)].map((_, index) => (
            <Box key={index} textAlign='center'>
              <Skeleton
                variant='text'
                sx={{ fontSize: "2rem", width: "40px", bgcolor: "#424242" }}
              />
              <Skeleton
                variant='text'
                sx={{ fontSize: "0.75rem", width: "40px", bgcolor: "#424242" }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Skeleton component for leaderboard cards
const LeaderboardSkeleton = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <Grid item xs={12} sm={index === 0 ? 5 : index === 1 ? 4 : 3} key={index}>
        <Card className='card'>
          <Box display='flex' alignItems='center' style={{ width: "100%" }}>
            <Box style={{ flex: 1, textAlign: "center" }}>
              <Skeleton
                variant='rectangular'
                width={60}
                height={80}
                sx={{ borderRadius: 1, bgcolor: "#424242" }}
              />
            </Box>
            <Box style={{ flex: index === 0 ? 1 : 1.5, paddingRight: "1rem" }}>
              <Box
                className='team-header'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Skeleton
                  variant='text'
                  sx={{
                    fontSize: "1.25rem",
                    width: "120px",
                    bgcolor: "#424242",
                  }}
                />
                <Skeleton
                  variant='circular'
                  width={50}
                  height={50}
                  sx={{ bgcolor: "#424242" }}
                />
              </Box>
              <Box
                className='stats'
                display='flex'
                justifyContent='space-between'
                marginTop='10px'
              >
                <Box>
                  <Skeleton
                    variant='text'
                    sx={{
                      fontSize: "0.875rem",
                      width: "80px",
                      bgcolor: "#424242",
                    }}
                  />
                  <Skeleton
                    variant='text'
                    sx={{
                      fontSize: "1.5rem",
                      width: "40px",
                      bgcolor: "#424242",
                    }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    variant='text'
                    sx={{
                      fontSize: "0.875rem",
                      width: "80px",
                      bgcolor: "#424242",
                    }}
                  />
                  <Skeleton
                    variant='text'
                    sx={{
                      fontSize: "1.5rem",
                      width: "40px",
                      bgcolor: "#424242",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>
    ))}
  </>
);

const Home = () => {
  const { token, user } = useAuth();
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [memors, setMemors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardTeams, setLeaderboardTeams] = useState([]);
  const [currentCompetition, setCurrentCompetition] = useState(null);
  const [ongoingMemors, setOngoingMemors] = useState(0);
  const [closedMemors, setClosedMemors] = useState(0);

  const swiperRef = useRef(null);

  useEffect(() => {
    document.title = `Memor'us | Admin Home`;
  }, []);

  useEffect(() => {
    // Only fetch if we have a token and user
    if (!token || !user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch active competition
        const competitionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain || "",
            },
          }
        );

        if (!competitionResponse.ok) {
          throw new Error("Failed to fetch active competition");
        }

        const competitionsData = await competitionResponse.json();

        if (competitionsData && competitionsData.length > 0) {
          const activeCompetition = competitionsData[0];
          setCurrentCompetition(activeCompetition);

          // Fetch leaderboard for the current competition
          const leaderboardResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/leaderboard/competition/${
              activeCompetition.id
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain || "",
              },
            }
          );

          if (leaderboardResponse.ok) {
            const leaderboardData = await leaderboardResponse.json();
            if (leaderboardData && leaderboardData.teams) {
              // Sort teams by rank and take top 3
              const teams = leaderboardData.teams
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 3)
                .map((team, index) => ({
                  rank: index + 1,
                  teamName: team.name || `Team ${team.teamId}`,
                  points: team.points || 0,
                  memors: team.memors || 0,
                  avatar: team.avatar || "https://via.placeholder.com/150",
                }));

              setLeaderboardTeams(teams);
            }
          }

          // Fetch latest memors for all teams - using new endpoint
          const latestMemorsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/memors/latest/all`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain || "",
              },
            }
          );

          if (latestMemorsResponse.ok) {
            const latestMemorsData = await latestMemorsResponse.json();

            if (Array.isArray(latestMemorsData)) {
              // Already formatted for display - but we need to enhance for correct image indexing
              const enhancedMemors = latestMemorsData.map((memor) => {
                // If memor has multiple images, we need to track which one this slide represents
                if (
                  memor.image &&
                  Array.isArray(memor.image) &&
                  memor.image.length > 1
                ) {
                  // For admin view, we'll show the first image but track all images
                  return {
                    ...memor,
                    currentImageIndex: 0, // This slide shows the first image
                    allImages: memor.image, // Store all images for modal
                  };
                }
                return memor;
              });
              setMemors(enhancedMemors);
            }
          } else {
            console.error(
              "Error fetching latest memors:",
              await latestMemorsResponse.text()
            );

            // Fallback to old approach if new endpoint isn't available
            try {
              // Fetch memors for the active competition (all teams)
              const memorResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/competitions/${
                  activeCompetition.id
                }/memors`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tenant": user.tenant_subdomain || "",
                  },
                }
              );

              if (!memorResponse.ok) {
                throw new Error("Failed to fetch memors");
              }

              const memorsData = await memorResponse.json();

              // Process memors
              let ongoingCount = 0;
              let closedCount = 0;
              let allSubmissions = [];

              if (Array.isArray(memorsData)) {
                // Count ongoing vs closed
                memorsData.forEach((memor) => {
                  const dueDate = new Date(memor.due_date);
                  const now = new Date();
                  if (dueDate > now) {
                    ongoingCount++;
                  } else {
                    closedCount++;
                  }
                });

                // Now fetch all teams
                const teamsResponse = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/teams`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "X-Tenant": user.tenant_subdomain || "",
                    },
                  }
                );

                if (teamsResponse.ok) {
                  const teamsData = await teamsResponse.json();

                  // For each team, get their completed memors
                  for (const team of teamsData) {
                    try {
                      const teamMemorsResponse = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/memors/team/${
                          team.id
                        }/competition/${activeCompetition.id}/completed`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "X-Tenant": user.tenant_subdomain || "",
                          },
                        }
                      );

                      if (teamMemorsResponse.ok) {
                        const teamMemorsData = await teamMemorsResponse.json();

                        if (Array.isArray(teamMemorsData)) {
                          // Process each memor and its pictures
                          teamMemorsData.forEach((memor) => {
                            if (memor.pictures && memor.pictures.length > 0) {
                              // For admin view, create individual slides for each picture
                              memor.pictures.forEach((pic, picIndex) => {
                                allSubmissions.push({
                                  id: `${memor.id}-${pic.id}`,
                                  memorId: memor.id,
                                  title: memor.title,
                                  description: memor.description,
                                  submittedDate: new Date(
                                    pic.created_at ||
                                      memor.updated_at ||
                                      memor.created_at
                                  ).toLocaleDateString(),
                                  team: team.name,
                                  image: [pic.img_src],
                                  submitter: pic.first_name
                                    ? `${pic.first_name} ${pic.last_name || ""}`
                                    : "Team member",
                                  allImages: memor.pictures.map(
                                    (p) => p.img_src
                                  ), // Store all images
                                  currentImageIndex: picIndex, // Which image this slide represents
                                });
                              });
                            }
                          });
                        }
                      }
                    } catch (teamError) {
                      console.error(
                        `Error fetching memors for team ${team.id}:`,
                        teamError
                      );
                    }
                  }
                }
              }

              // Sort by most recent first
              allSubmissions.sort(
                (a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)
              );

              setMemors(allSubmissions);
              setOngoingMemors(ongoingCount);
              setClosedMemors(closedCount);
            } catch (fallbackError) {
              console.error("Error in fallback approach:", fallbackError);
              setError(`Failed to load memors: ${fallbackError.message}`);
            }
          }

          // Get memor counts for admin dashboard
          const memorsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/competitions/${
              activeCompetition.id
            }/memors`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain || "",
              },
            }
          );

          if (memorsResponse.ok) {
            const memorsData = await memorsResponse.json();

            if (Array.isArray(memorsData)) {
              // Count ongoing vs closed
              let ongoing = 0;
              let closed = 0;

              memorsData.forEach((memor) => {
                const dueDate = new Date(memor.due_date);
                const now = new Date();
                if (dueDate > now) {
                  ongoing++;
                } else {
                  closed++;
                }
              });

              setOngoingMemors(ongoing);
              setClosedMemors(closed);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleImageClick = async (slide, imageIndex = null) => {
    console.log(
      "Admin Home: handleImageClick called with slide:",
      slide,
      "imageIndex:",
      imageIndex
    );

    const preparedSlide = { ...slide };

    // Determine the current index
    let currentIndex = 0;

    if (imageIndex !== null) {
      currentIndex = imageIndex;
    } else if (slide.currentImageIndex !== undefined) {
      currentIndex = slide.currentImageIndex;
    }

    // If we have allImages, use those (all images from the memor)
    // Otherwise try to fetch all images for this memor
    if (slide.allImages && Array.isArray(slide.allImages)) {
      preparedSlide.image = slide.allImages.map((imgSrc) => ({
        img_src: imgSrc,
        alt_text: `Image for ${slide.title}`,
      }));
    } else if (slide.memorId && token) {
      // Try to fetch all images for this memor
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/memors/${
            slide.memorId
          }/pictures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          }
        );

        if (response.ok) {
          const allPictures = await response.json();
          if (allPictures && allPictures.length > 0) {
            preparedSlide.image = allPictures.map((pic) => ({
              img_src: pic.img_src,
              alt_text: pic.alt_text || `Image for ${slide.title}`,
            }));

            // Find the index of the current image in the full array
            const clickedImageSrc = Array.isArray(slide.image)
              ? slide.image[0]
              : slide.image;
            const clickedSrc =
              typeof clickedImageSrc === "object"
                ? clickedImageSrc.img_src
                : clickedImageSrc;
            const foundIndex = allPictures.findIndex(
              (pic) => pic.img_src === clickedSrc
            );
            if (foundIndex !== -1) {
              currentIndex = foundIndex;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching all pictures for memor:", error);
        // Fall back to the slide's existing image
        if (slide.image) {
          preparedSlide.image = Array.isArray(slide.image)
            ? slide.image.map((img) =>
                typeof img === "string"
                  ? { img_src: img, alt_text: `Image for ${slide.title}` }
                  : img
              )
            : [{ img_src: slide.image, alt_text: `Image for ${slide.title}` }];
        }
      }
    } else {
      // Use the slide's existing image
      if (slide.image) {
        preparedSlide.image = Array.isArray(slide.image)
          ? slide.image.map((img) =>
              typeof img === "string"
                ? { img_src: img, alt_text: `Image for ${slide.title}` }
                : img
            )
          : [{ img_src: slide.image, alt_text: `Image for ${slide.title}` }];
      }
    }

    console.log("Admin Home: Final prepared slide image:", preparedSlide.image);
    console.log("Admin Home: Using currentIndex:", currentIndex);

    preparedSlide.currentIndex = currentIndex;
    setSelectedSlide(preparedSlide);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedSlide(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {/* <Loader /> */}
      <section className='mb-10' aria-labelledby='latest-memors-heading'>
        <div
          className='container'
          style={{ marginBottom: "1rem", marginTop: "2rem" }}
        >
          <img
            src={background1}
            alt=''
            style={{
              position: "absolute",
              top: "2",
              right: "0",
              width: "15%",
              zIndex: "0",
            }}
            aria-hidden='true'
          />
          <img
            src={background2}
            alt=''
            style={{
              position: "absolute",
              top: "25%",
              left: "5%",
              width: "5%",
              zIndex: "0",
            }}
            aria-hidden='true'
          />
          <img
            src={background3}
            alt=''
            style={{
              position: "absolute",
              top: "35%",
              right: "6%",
              width: "5%",
              zIndex: "0",
            }}
            aria-hidden='true'
          />
          <h1 id='latest-memors-heading' className='home-title'>
            Latest Memors
          </h1>
        </div>

        {/* Swiper */}
        <div className='overflow-hidden w-full'>
          <div className='container'>
            {loading ? (
              <CarouselSkeleton />
            ) : error ? (
              <Alert severity='error' sx={{ mx: 2 }}>
                {error}
              </Alert>
            ) : memors.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "#aaa" }}>
                <Typography>No memors available for any teams yet.</Typography>
              </Box>
            ) : (
              <Swiper
                ref={swiperRef}
                spaceBetween={20}
                breakpoints={{
                  640: { slidesPerView: 2.3 },
                  768: { slidesPerView: 4.3 },
                  1024: { slidesPerView: 5.3 },
                }}
                className='latest-wrapper'
                freeMode={true}
                mousewheel={{ releaseOnEdges: true }}
                modules={[Mousewheel, FreeMode]}
                aria-label='Latest Memors'
                keyboard={{ enabled: true, onlyInViewport: true }}
              >
                {memors.map((memor) => (
                  <SwiperSlide
                    key={memor.id}
                    className={
                      memor.image && memor.image.length > 0
                        ? "latest-memors-pic"
                        : "latest-memors"
                    }
                    tabIndex='0'
                    role='button'
                    aria-label={`Open memor titled ${memor.title}, submitted on ${memor.submittedDate}`}
                    onClick={() => handleImageClick(memor)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleImageClick(memor);
                      }
                    }}
                  >
                    {memor.image && memor.image.length > 0 && (
                      <div onClick={() => handleImageClick(memor)}>
                        <div className='image-wrapper'>
                          <img
                            width={"100%"}
                            height={"100%"}
                            style={{ objectFit: "cover" }}
                            src={
                              Array.isArray(memor.image)
                                ? memor.image[0]
                                : memor.image
                            }
                            alt='Memor Image'
                          />
                        </div>
                        <div className='latest-memors-content'>
                          <CustomButton
                            text={memor.team}
                            onClick={() => handleImageClick(memor)}
                            sx={{
                              display: "flex",
                              padding: "3.147px 15.953px",
                              justifyContent: "center",
                              alignItems: "center",
                              flex: "1 0 0",
                              alignSelf: "stretch",
                              fontSize: "0.8rem",
                              color: "#003731",
                              fontWeight: "600",
                            }}
                          />
                          <h3>{memor.submittedDate}</h3>
                          <p style={{ fontSize: "0.9rem" }}>
                            &quot;{memor.title}&quot;
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                            by {memor.submitter}
                          </p>
                        </div>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {selectedSlide && (
          <MemorPicture
            images={selectedSlide.image}
            currentIndex={selectedSlide.currentIndex || 0}
            teamName={selectedSlide.team}
            title={selectedSlide.title}
            submitDate={selectedSlide.submittedDate}
            onClose={closeModal}
            onNavigate={handleImageClick}
          />
        )}
      </section>

      {/* The rest of the Admin Home component remains unchanged */}

      <section
        id='adminStats'
        className='container'
        aria-labelledby='memors-dashboard-heading'
        style={{ marginTop: "2rem" }}
      >
        <Typography
          variant='h6'
          gutterBottom
          style={{ color: "white" }}
          id='memors-dashboard-heading'
        >
          Memors Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            {loading ? (
              <StatCardSkeleton cardId='ongoing' />
            ) : (
              <Card
                className='card'
                onClick={() =>
                  (window.location.href = "/app/admin/adminBoard?tab=ongoing")
                }
                onKeyPress={(e) =>
                  handleKeyPress(
                    e,
                    () =>
                      (window.location.href =
                        "/app/admin/adminBoard?tab=ongoing")
                  )
                }
                style={{ cursor: "pointer" }}
                tabIndex='0'
                role='button'
                aria-label='View ongoing Memors'
              >
                <CardContent>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Typography variant='h4' fontWeight='bold'>
                      {ongoingMemors}
                    </Typography>
                    <img src={ongoing} alt='Ongoing Memors' />
                  </Box>
                  <Typography variant='body2' color='#B0B0B0'>
                    Ongoing Memors
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} sm={3}>
            {loading ? (
              <StatCardSkeleton cardId='closed' />
            ) : (
              <Card
                className='card'
                onClick={() => (window.location.href = "/app/admin/adminBoard")}
                onKeyPress={(e) =>
                  handleKeyPress(
                    e,
                    () => (window.location.href = "/app/admin/adminBoard")
                  )
                }
                style={{ cursor: "pointer" }}
                tabIndex='0'
                role='button'
                aria-label='View closed Memors'
              >
                <CardContent>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Typography variant='h4' fontWeight='bold'>
                      {closedMemors}
                    </Typography>
                    <img src={closed} alt='Closed Memors' />
                  </Box>
                  <Typography variant='body2' color='#B0B0B0'>
                    Closed Memors
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {loading ? (
              <CountdownSkeleton />
            ) : (
              <Card className='card' aria-labelledby='competition-heading'>
                <CardContent>
                  {currentCompetition ? (
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Box>
                        <Typography
                          variant='h6'
                          style={{ color: "white" }}
                          id='competition-heading'
                        >
                          The competition{" "}
                          <span
                            style={{ color: "#409C90", fontWeight: "bold" }}
                          >
                            {currentCompetition.name}
                          </span>{" "}
                          ends in
                        </Typography>
                      </Box>
                      <Countdown
                        endDate={currentCompetition.end_date}
                        role='admin'
                        aria-label='Countdown to competition end'
                        aria-live='polite'
                      />
                    </Box>
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant='body1' sx={{ color: "#82D5C7" }}>
                        No active competitions at the moment.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </section>

      <section
        id='currentLeaders'
        className='pb-10 container'
        aria-labelledby='current-leaders-heading'
      >
        <Typography
          variant='h6'
          gutterBottom
          style={{ color: "white" }}
          id='current-leaders-heading'
        >
          Current Leaders
        </Typography>
        {loading ? (
          <Grid container spacing={2}>
            <LeaderboardSkeleton />
          </Grid>
        ) : error ? (
          <Alert severity='warning' sx={{ mx: 2 }}>
            Unable to load leaderboard data.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {leaderboardTeams.length > 0 ? (
              leaderboardTeams
                .filter((team) => team.rank <= 3)
                .map((team) => (
                  <Grid
                    item
                    xs={12}
                    sm={team.rank === 1 ? 5 : team.rank === 2 ? 4 : 3}
                    key={team.rank}
                  >
                    <Card
                      className='card'
                      onClick={() =>
                        (window.location.href = "/app/admin/leaderboard")
                      }
                      style={{ cursor: "pointer" }}
                      tabIndex='0'
                      role='button'
                      aria-label={`View details for ${team.teamName}`}
                    >
                      <Box
                        display='flex'
                        alignItems='center'
                        style={{ width: "100%" }}
                      >
                        <Box style={{ flex: 1, textAlign: "center" }}>
                          <img
                            src={rankImages[team.rank]}
                            alt={`Rank ${team.rank}`}
                            style={{
                              position: "absolute",
                              bottom: "0px",
                              left: "10px",
                              height: `${75 - team.rank * 10}%`,
                            }}
                          />
                        </Box>
                        <Box
                          style={{
                            flex: team.rank === 1 ? 1 : 1.5,
                            paddingRight: "20px",
                          }}
                        >
                          <Box
                            className='team-header'
                            display='flex'
                            justifyContent='space-between'
                          >
                            <Typography variant='h6' className='team-name'>
                              {team.teamName}
                            </Typography>
                            <img
                              src={team.avatar}
                              alt={team.teamName}
                              className='team-avatar-admin'
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          <Box
                            className='stats'
                            display='flex'
                            justifyContent='space-between'
                            marginTop='10px'
                          >
                            <div>
                              <Typography variant='body2' className='label'>
                                Total Points
                              </Typography>
                              <Typography variant='h5' className='value'>
                                {team.points}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant='body2' className='label'>
                                Total Memors
                              </Typography>
                              <Typography variant='h5' className='value'>
                                {team.memors}
                              </Typography>
                            </div>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: "center", color: "#aaa" }}>
                  <Typography>No leaderboard data available yet.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </section>
    </>
  );
};

const handleKeyPress = (event, callback) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

StatCardSkeleton.propTypes = {
  cardId: PropTypes.string,
};

export default Home;
