import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material";
import MemorPicture from "./../../Components/MemorPicture/MemorPicture";
import "./Home.css";
import rank1 from "../../assets/images/rank1home.svg";
import rank2 from "../../assets/images/rank2home.svg";
import rank3 from "../../assets/images/rank3home.svg";
import pending from "../../assets/images/pendingHome.svg";
import completed from "../../assets/images/completedHome.svg";
import WelcomeModal from "../../Components/WelcomeModal/WelcomeModal";
import Countdown from "../../Components/Countdown/Countdown";
import Loader from "../../Components/Loader/Loader";
import background1 from "../../assets/images/background1.svg";
import background2 from "../../assets/images/background2.svg";
import background3 from "../../assets/images/background3.svg";
import { useAuth } from "../../context/AuthContext";
import { getLeaderboardVisibility, LEADERBOARD_VISIBILITY_CHANGE } from "../../assets/utils/leaderboardUtils";

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
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentCompetition, setCurrentCompetition] = useState(null);
  const [pendingMemors, setPendingMemors] = useState(0);
  const [completedMemors, setCompletedMemors] = useState(0);
  
  const swiperRef = useRef(null);

  const [showLeaderboard, setShowLeaderboard] = useState(getLeaderboardVisibility());

  useEffect(() => {
    document.title = `Memor'us | Home`;
  }, []);

  useEffect(() => {
    const handleLeaderboardVisibilityChange = () => {
      setShowLeaderboard(getLeaderboardVisibility());
    };
  
    window.addEventListener(LEADERBOARD_VISIBILITY_CHANGE, handleLeaderboardVisibilityChange);
    window.addEventListener("storage", handleLeaderboardVisibilityChange);
  
    return () => {
      window.removeEventListener(LEADERBOARD_VISIBILITY_CHANGE, handleLeaderboardVisibilityChange);
      window.removeEventListener("storage", handleLeaderboardVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!token || !user || !user.teamsId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (user.teamsId && (!user.team || !user.team.name)) {
          try {
            const teamResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/teams/${user.teamsId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-Tenant": user.tenant_subdomain || "",
                },
              }
            );
            
            if (teamResponse.ok) {
              const teamData = await teamResponse.json();
              if (teamData && teamData.name) {
                user.teamName = teamData.name;
              }
            }
          } catch (teamErr) {
            console.error("Error fetching team details:", teamErr);
          }
        }
        
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
              
              setLeaderboardData(teams);
            }
          }
          
          const latestMemorsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/memors/team/${user.teamsId}/latest`,
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
              const formattedMemors = latestMemorsData.map(memor => {
                let formattedImages = [];
                
                if (memor.image && Array.isArray(memor.image)) {
                  formattedImages = memor.image.map(img => ({
                    img_src: typeof img === 'object' ? (img.img_src || img) : img,
                    alt_text: typeof img === 'object' ? (img.alt_text || `Image for ${memor.title}`) : `Image for ${memor.title}`
                  }));
                }
                
                return {
                  ...memor,
                  image: formattedImages
                };
              });
              
              setMemors(formattedMemors);
            }
          } else {
            console.error("Error fetching latest memors:", await latestMemorsResponse.text());
            
            try {
              const completedMemorsResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/memors/team/${user.teamsId}/competition/${activeCompetition.id}/completed`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tenant": user.tenant_subdomain || "",
                  },
                }
              );
              
              if (completedMemorsResponse.ok) {
                const completedMemorsData = await completedMemorsResponse.json();
                
                if (Array.isArray(completedMemorsData)) {
                  const allSubmissions = [];
                  
                  completedMemorsData.forEach(memor => {
                    if (memor.pictures && memor.pictures.length > 0) {
                      memor.pictures.forEach(pic => {
                        allSubmissions.push({
                          id: `${memor.id}-${pic.id}`,
                          memorId: memor.id,
                          title: memor.title,
                          description: memor.description,
                          submittedDate: new Date(pic.created_at || memor.updated_at || memor.created_at).toLocaleDateString(),
                          dueDate: memor.due_date,
                          team: user.teamName || "Your Team",
                          image: [{
                            img_src: pic.img_src,
                            alt_text: pic.alt_text || `Image for ${memor.title}`
                          }],
                          submitter: pic.user_id === user.id ? "You" : pic.first_name ? `${pic.first_name} ${pic.last_name || ''}` : "Team member"
                        });
                      });
                    }
                  });
                  
                  allSubmissions.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
                  
                  setMemors(allSubmissions);
                  setCompletedMemors(completedMemorsData.length);
                }
              }
            } catch (fallbackErr) {
              console.error("Error in fallback fetch:", fallbackErr);
            }
          }
          
          const progressResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/memors/team/${user.teamsId}/competition/${activeCompetition.id}/progress`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain || "",
              },
            }
          );
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            if (progressData) {
              const pending = (progressData.totalMemors || 0) - (progressData.completedMemors || 0);
              setPendingMemors(Math.max(0, pending));
              setCompletedMemors(progressData.completedMemors || 0);
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

  const handleImageClick = async (slide) => {
    console.log("Home: handleImageClick called with slide:", slide);
    
    const preparedSlide = { ...slide };
    
    if (preparedSlide.image && Array.isArray(preparedSlide.image)) {
      preparedSlide.image = preparedSlide.image.map(img => {
        if (typeof img === 'string') {
          return {
            img_src: img,
            alt_text: `Image for ${slide.title}`
          };
        } else {
          return {
            img_src: img.img_src || img,
            alt_text: img.alt_text || `Image for ${slide.title}`
          };
        }
      });
    }

    if (slide.memorId) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/memors/${slide.memorId}/pictures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          }
        );
        
        if (response.ok) {
          const pictures = await response.json();
          console.log("Home: Fetched pictures with alt_text from API:", pictures);
          
          if (pictures && pictures.length > 0) {
            preparedSlide.image = pictures.map((pic, index) => ({
              img_src: pic.img_src,
              alt_text: pic.alt_text || 
                       (preparedSlide.image[index]?.alt_text) || 
                       `Image for ${slide.title}`
            }));
          }
        }
      } catch (error) {
        console.error("Home: Error fetching pictures:", error);
      }
    }
    
    console.log("Home: Final prepared slide image:", preparedSlide.image);
    setSelectedSlide(preparedSlide);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedSlide(null);
    document.body.style.overflow = "auto";
  };

  const teamMemors = memors;

  return (
    <>
      <Loader />
      <WelcomeModal />
      <section className='mb-10'>
        <div
          className='container'
          style={{
            marginBottom: "1rem",
            marginTop: "2rem",
            position: "relative",
          }}
        >
          <img
            src={background1}
            alt='Decorative background element'
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
            alt='Decorative background element'
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
            alt='Decorative background element'
            style={{
              position: "absolute",
              top: "35%",
              right: "6%",
              width: "5%",
              zIndex: "0",
            }}
            aria-hidden='true'
          />

          <h1
            className='home-title'
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            tabIndex='0'
          >
            Latest Memors <span>•</span>{" "}
            <span className='team-name' style={{ color: "#9282F9" }}>
              {user?.teamName || "Your Team"}
            </span>
          </h1>
        </div>

        <div className='overflow-hidden w-full'>
          <div className='container'>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#d0bcfe" }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>
            ) : teamMemors.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "#aaa" }}>
                <Typography>No memors available for your team yet.</Typography>
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
                keyboard={{ enabled: true, onlyInViewport: true }}
                aria-label='Latest Memors Carousel'
              >
                {teamMemors.map((slide, index) => (
                  <SwiperSlide
                    key={`${slide.id}-${index}`}
                    className='latest-memors-pic'
                    tabIndex='0'
                    role='button'
                    aria-label={`Open memor titled ${slide.title}, submitted on ${slide.submittedDate}`}
                    onClick={() => handleImageClick(slide)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleImageClick(slide);
                      }

                      if (e.key === "Tab") {
                        if (!e.shiftKey && index === teamMemors.length - 1) {
                          e.preventDefault();
                          const nextSection = document.querySelector("#myMemors");
                          if (nextSection) {
                            const focusable = nextSection.querySelector(
                              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                            );
                            if (focusable) {
                              focusable.focus();
                            } else {
                              nextSection.focus();
                            }
                          }
                          return;
                        }

                        if (e.shiftKey && index === 0) {
                          e.preventDefault();
                          const prevElement = document.querySelector(".home-title");
                          if (prevElement) prevElement.focus();
                          return;
                        }

                        e.preventDefault();
                        let newIndex = e.shiftKey
                          ? Math.max(index - 1, 0)
                          : Math.min(index + 1, teamMemors.length - 1);

                        swiperRef.current?.swiper.slideTo(newIndex);

                        const nextSlide = document.querySelectorAll(".latest-memors-pic")[newIndex];
                        if (nextSlide) nextSlide.focus();
                      }
                    }}
                  >
                    <div className='image-wrapper'>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "cover" }}
                        src={
                          slide.image && slide.image.length > 0 && slide.image[0]
                            ? (typeof slide.image[0] === 'object'
                                ? slide.image[0].img_src
                                : slide.image[0])
                            : "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={
                          slide.image && 
                          slide.image.length > 0 && 
                          typeof slide.image[0] === 'object'
                            ? slide.image[0].alt_text
                            : `Image for ${slide.title}`
                        }
                      />
                    </div>
                    <div className='latest-memors-content'>
                      <h3>{slide.submittedDate}</h3>
                      <p style={{ fontSize: "0.9rem" }}>
                        &quot;{slide.title}&quot;
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                        by {slide.submitter}
                      </p>
                    </div>
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
          />
        )}
      </section>

      <section id='myMemors' className='container' tabIndex='0'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          My Memors
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() => (window.location.href = "/memors?tab=incomplete")}
              style={{ cursor: "pointer" }}
              tabIndex='0'
              role='button'
              aria-label='View pending memors'
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    {loading ? <CircularProgress size={30} /> : pendingMemors}
                  </Typography>
                  <img src={pending} alt='Pending memors icon' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Pending Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() => (window.location.href = "/memors?tab=completed")}
              style={{ cursor: "pointer" }}
              tabIndex='0'
              role='button'
              aria-label='View completed memors'
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    {loading ? <CircularProgress size={30} /> : completedMemors}
                  </Typography>
                  <img src={completed} alt='Completed memors icon' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Completed Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              className='card'
              tabIndex='0'
              aria-label='Competition countdown'
            >
              <CardContent>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={40} sx={{ color: "#d0bcfe" }} />
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
                      <Typography variant='h6' style={{ color: "white" }}>
                        The competition{" "}
                        <span style={{ color: "#9282F9", fontWeight: "bold" }}>
                          {currentCompetition.name}
                        </span>{" "}
                        ends in
                      </Typography>
                    </Box>
                    <Countdown endDate={currentCompetition.end_date} role='user' />
                  </Box>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant='body1' sx={{ color: "#d0bcfe" }}>
                      No active competitions at the moment.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      <section id='currentLeaders' className='pb-10 container' tabIndex='0'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          Current Leaders
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={40} sx={{ color: "#d0bcfe" }} />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mx: 2 }}>
            Unable to load leaderboard data.
          </Alert>
        ) : (
          <Grid
            container
            spacing={3}
            style={{ filter: showLeaderboard ? "none" : "blur(15px)", pointerEvents: showLeaderboard ? "auto" : "none" }}
          >
            {leaderboardData.length > 0 ? (
              leaderboardData.map((team) => (
                <Grid
                  item
                  xs={12}
                  sm={team.rank === 1 ? 5 : team.rank === 2 ? 4 : 3}
                  key={team.rank}
                >
                  <Card
                    className='card'
                    onClick={() => {
                      window.location.href = "/leaderboard";
                    }}
                    style={{ cursor: "pointer" }}
                    tabIndex='0'
                    role='button'
                    aria-label={`View leaderboard for ${team.teamName}`}
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
                          paddingRight: "1rem",
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

export default Home;