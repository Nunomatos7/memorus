import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import MemorPicture from "./../../Components/MemorPicture/MemorPicture";
import "./Home.css";
import rank1 from "../../assets/images/rank1home.svg";
import rank2 from "../../assets/images/rank2home.svg";
import rank3 from "../../assets/images/rank3home.svg";
import pending from "../../assets/images/pendingHome.svg";
import completed from "../../assets/images/completedHome.svg";
import WelcomeModal from "../../Components/WelcomeModal/WelcomeModal";
import { leaderboardData } from "../Leaderboard/Leaderboard";
import Countdown from "../../Components/Countdown/Countdown";
import Loader from "../../Components/Loader/Loader";
import background1 from "../../assets/images/background1.svg";
import background2 from "../../assets/images/background2.svg";
import background3 from "../../assets/images/background3.svg";
import { memorsData } from "../../Data/Memors.json";
import { getLeaderboardVisibility } from "../../assets/utils/leaderboardUtils";

const rankImages = {
  1: rank1,
  2: rank2,
  3: rank3,
};

const Home = () => {
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showLeaderboard] = useState(getLeaderboardVisibility());
  const swiperRef = useRef(null);

  useEffect(() => {
    document.title = `Memor'us | Home`;
  }, []);

  const handleImageClick = (slide) => {
    setSelectedSlide(slide);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedSlide(null);
    document.body.style.overflow = "auto";
  };

  const debuggerSlides = memorsData.filter(
    (slide) => slide.team === "The Debuggers" && slide.image
  );

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
          {/* Background Images */}
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

          {/* Page Title */}
          <h1
            className='home-title'
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            tabIndex='0'
          >
            Latest Memors <span>•</span>{" "}
            <span className='team-name' style={{ color: "#9282F9" }}>
              The Debuggers
            </span>
          </h1>
        </div>

        {/* Swiper Section */}
        <div className='overflow-hidden w-full'>
          <div className='container'>
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
              {memorsData
                .filter(
                  (slide) => slide.team === "The Debuggers" && slide.image
                )
                .map((slide, index) => (
                  <SwiperSlide
                    key={slide.id}
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

                      // Se for o último slide e Tab (sem Shift), salta para a secção seguinte
                      if (e.key === "Tab") {
                        if (
                          !e.shiftKey &&
                          index === debuggerSlides.length - 1
                        ) {
                          e.preventDefault();
                          const nextSection =
                            document.querySelector("#myMemors");
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
                          return; // Impede o resto da lógica de correr
                        }

                        // Shift+Tab no primeiro slide volta ao título
                        if (e.shiftKey && index === 0) {
                          e.preventDefault();
                          const prevElement =
                            document.querySelector(".home-title");
                          if (prevElement) prevElement.focus();
                          return;
                        }

                        // Caso contrário: navega entre os slides
                        e.preventDefault();
                        let newIndex = e.shiftKey
                          ? Math.max(index - 1, 0)
                          : Math.min(index + 1, debuggerSlides.length - 1);

                        swiperRef.current?.swiper.slideTo(newIndex);

                        const nextSlide =
                          document.querySelectorAll(".latest-memors-pic")[
                            newIndex
                          ];
                        if (nextSlide) nextSlide.focus();
                      }
                    }}
                  >
                    <div className='image-wrapper'>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "cover" }}
                        src={slide.image[0]}
                        alt={`Memor image: ${slide.title}`}
                      />
                    </div>
                    <div className='latest-memors-content'>
                      <h3>{slide.submittedDate}</h3>
                      <p style={{ fontSize: "0.9rem" }}>
                        &quot;{slide.title}&quot;
                      </p>
                    </div>
                  </SwiperSlide>
                ))}

              {/* Placeholder Slides */}
              {Array.from(
                {
                  length: Math.max(
                    0,
                    5 -
                      memorsData.filter(
                        (slide) => slide.team === "The Debuggers" && slide.image // Trocar para a equipe do user
                      ).length
                  ),
                },
                (_, index) => (
                  <SwiperSlide
                    key={`placeholder-${index}`}
                    className='placeholder-slide'
                    tabIndex='0'
                    aria-label='Empty memor placeholder'
                  >
                    <div className='placeholder-content'>
                      <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
                        Placeholder
                      </p>
                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>

        {/* Memor Picture Modal */}
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

      {/* My Memors Section */}
      <section id='myMemors' className='container' tabIndex='0'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          My Memors
        </Typography>
        <Grid container spacing={3}>
          {/* Pending Memors Card */}
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
                    6
                  </Typography>
                  <img src={pending} alt='Pending memors icon' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Pending Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Memors Card */}
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
                    2
                  </Typography>
                  <img src={completed} alt='Completed memors icon' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Completed Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Countdown Card */}
          <Grid item xs={12} sm={6}>
            <Card
              className='card'
              tabIndex='0'
              aria-label='Competition countdown'
            >
              <CardContent>
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
                        New Year New Us
                      </span>{" "}
                      ends in
                    </Typography>
                  </Box>
                  <Countdown endDate='2025-05-31T00:00:00' role='user' />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      {/* Current Leaders Section */}
      <section id='currentLeaders' className='pb-10 container' tabIndex='0'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          Current Leaders
        </Typography>
        <Grid
          container
          spacing={3}
          style={{ filter: showLeaderboard ? "none" : "blur(15px)" }}
        >
          {leaderboardData
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
                    {/* Rank Image */}
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

                    {/* Team Details */}
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
            ))}
        </Grid>
      </section>
    </>
  );
};

export default Home;
