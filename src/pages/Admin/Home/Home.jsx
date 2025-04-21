import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material";
import MemorPicture from "./../../../Components/MemorPicture/MemorPicture";
import "swiper/css";
import "swiper/css/free-mode";
import "./Home.css";
import rank1 from "../../../assets/images/adminRank1.svg";
import rank2 from "../../../assets/images/adminRank2.svg";
import rank3 from "../../../assets/images/adminRank3.svg";
import ongoing from "../../../assets/images/ongoingAdmin.svg";
import closed from "../../../assets/images/closedAdmin.svg";
import { leaderboardData } from "../Leaderboard/Leaderboard";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import Loader from "../../../Components/Loader/Loader";
import background1 from "../../../assets/images/adminBackground1.svg";
import background2 from "../../../assets/images/adminBackground2.svg";
import background3 from "../../../assets/images/adminBackground3.svg";
import Countdown from "../../../Components/Countdown/Countdown";
import { useAuth } from "../../../context/AuthContext";

const rankImages = {
  1: rank1,
  2: rank2,
  3: rank3,
};

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
            `${import.meta.env.VITE_API_URL}/api/leaderboard/competition/${activeCompetition.id}`,
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
                  memors: Math.ceil((team.points || 0) / 10), // Estimate based on points
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
              // Already formatted for display
              setMemors(latestMemorsData);
            }
          } else {
            console.error("Error fetching latest memors:", await latestMemorsResponse.text());
            
            // Fallback to old approach if new endpoint isn't available
            try {
              // Fetch memors for the active competition (all teams)
              const memorResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/competitions/${activeCompetition.id}/memors`,
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
                memorsData.forEach(memor => {
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
                        `${import.meta.env.VITE_API_URL}/api/memors/team/${team.id}/competition/${activeCompetition.id}/completed`,
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
                          teamMemorsData.forEach(memor => {
                            if (memor.pictures && memor.pictures.length > 0) {
                              memor.pictures.forEach(pic => {
                                allSubmissions.push({
                                  id: `${memor.id}-${pic.id}`,
                                  memorId: memor.id,
                                  title: memor.title,
                                  description: memor.description,
                                  submittedDate: new Date(pic.created_at || memor.updated_at || memor.created_at).toLocaleDateString(),
                                  team: team.name,
                                  image: [pic.img_src],
                                  submitter: pic.first_name ? `${pic.first_name} ${pic.last_name || ''}` : "Team member"
                                });
                              });
                            }
                          });
                        }
                      }
                    } catch (teamError) {
                      console.error(`Error fetching memors for team ${team.id}:`, teamError);
                    }
                  }
                }
              }
              
              // Sort by most recent first
              allSubmissions.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
              
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
            `${import.meta.env.VITE_API_URL}/api/competitions/${activeCompetition.id}/memors`,
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
              
              memorsData.forEach(memor => {
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

  const handleImageClick = (slide) => {
    setSelectedSlide(slide);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedSlide(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Loader />
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
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#82D5C7" }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>
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
                {memors.map((memor, index) => (
                  <SwiperSlide
                    key={memor.id}
                    className={
                      memor.image && memor.image.length > 0 ? "latest-memors-pic" : "latest-memors"
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
                            src={memor.image[0]}
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
            <Card
              className='card'
              onClick={() =>
                (window.location.href = "/admin/adminBoard?tab=ongoing")
              }
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  () => (window.location.href = "/admin/adminBoard?tab=ongoing")
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
                    {loading ? <CircularProgress size={30} /> : ongoingMemors}
                  </Typography>
                  <img src={ongoing} alt='Ongoing Memors' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Ongoing Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() =>
                (window.location.href = "/admin/adminBoard?tab=closed")
              }
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  () => (window.location.href = "/admin/adminBoard?tab=closed")
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
                    {loading ? <CircularProgress size={30} /> : closedMemors}
                  </Typography>
                  <img src={closed} alt='Closed Memors' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Closed Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card className='card' aria-labelledby='competition-heading'>
              <CardContent>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={40} sx={{ color: "#82D5C7" }} />
                  </Box>
                ) : currentCompetition ? (
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
                        <span style={{ color: "#409C90", fontWeight: "bold" }}>
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
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={40} sx={{ color: "#82D5C7" }} />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mx: 2 }}>
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
                      onClick={() => (window.location.href = "/admin/leaderboard")}
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
                  <Typography>
                    No leaderboard data available yet.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </section>
    </>
  );
};

// Helper function for keyboard navigation
const handleKeyPress = (event, callback) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

export default Home;