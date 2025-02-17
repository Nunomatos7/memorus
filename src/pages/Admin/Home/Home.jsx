import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import MemorPicture from "./../../../Components/MemorPicture/MemorPicture";
import "swiper/css";
import "swiper/css/free-mode";
import "./Home.css";
import rank1 from "../../../assets/images/rank1admin.svg";
import rank2 from "../../../assets/images/rank2admin.svg";
import rank3 from "../../../assets/images/rank3admin.svg";
import ongoing from "../../../assets/images/ongoingAdmin.svg";
import closed from "../../../assets/images/closedAdmin.svg";
import WelcomeModal from "../../../Components/WelcomeModal/WelcomeModal";
import { leaderboardData } from "../Leaderboard/Leaderboard";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import Loader from "../../../Components/Loader/Loader";
import background1 from "../../../assets/images/background1.svg";
import background2 from "../../../assets/images/background2.svg";
import background3 from "../../../assets/images/background3.svg";
import Countdown from "../../../Components/Countdown/Countdown";
import { memorsData } from "../../../Data/Memors.json";

const rankImages = {
  1: rank1,
  2: rank2,
  3: rank3,
};

export const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  pending_memors: 3,
  complete_memors: 5,
  admin: false,
};

const Home = () => {
  const [selectedSlide, setSelectedSlide] = useState(null);
  const swiperRef = useRef(null);

  const handleImageClick = (slide) => {
    setSelectedSlide(slide);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedSlide(null);
    document.body.style.overflow = "auto";
  };

  // Handle keyboard events for clickable elements
  const handleKeyPress = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  return (
    <>
      <Loader />
      <WelcomeModal />
      <section className='mb-10' aria-labelledby="latest-memors-heading">
        <div
          className='container'
          style={{ marginBottom: "1rem", marginTop: "2rem" }}
        >
          <img
            src={background1}
            alt='Decorative background 1'
            style={{
              position: "absolute",
              top: "2",
              right: "0",
              width: "15%",
              zIndex: "0",
            }}
            aria-hidden="true"
          />
          <img
            src={background2}
            alt='Decorative background 2'
            style={{
              position: "absolute",
              top: "25%",
              left: "5%",
              width: "5%",
              zIndex: "0",
            }}
            aria-hidden="true"
          />
          <img
            src={background3}
            alt='Decorative background 3'
            style={{
              position: "absolute",
              top: "35%",
              right: "6%",
              width: "5%",
              zIndex: "0",
            }}
            aria-hidden="true"
          />
          <h1 id="latest-memors-heading" className='home-title'>Latest Memors</h1>
        </div>

        {/* Swiper */}
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
              aria-label="Latest Memors"
              keyboard={{ enabled: true, onlyInViewport: true }}
            >
              {Object.values(
                memorsData.reduce((acc, memor) => {
                  if (!acc[memor.title] && memor.image?.length > 0) {
                    acc[memor.title] = memor;
                  }
                  return acc;
                }, {})
              )
                .sort((a, b) => a.id - b.id) // Sort titles by ID or some ordering criterion
                .map((memor, index) => (
                  <SwiperSlide
                    key={memor.id}
                    className={
                      memor.image ? "latest-memors-pic" : "latest-memors"
                    }
                    tabIndex='0' // Make slides focusable
                    role='button'
                    aria-label={`Open memor titled ${memor.title}, submitted on ${memor.submittedDate}`}
                    onClick={() => handleImageClick(memor)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleImageClick(memor);
                      }

                      if (e.key === "Tab") {
                        e.preventDefault(); // Prevents default browser scroll behavior

                        let newIndex;
                        if (e.shiftKey) {
                          // Move to previous slide if Shift + Tab
                          newIndex = Math.max(index - 1, 0);
                        } else {
                          // Move to next slide if Tab
                          newIndex = Math.min(index + 1, memorsData.length - 1);
                        }

                        swiperRef.current?.swiper.slideTo(newIndex);
                        // Move focus to the new slide
                        const nextSlide =
                          document.querySelectorAll(".latest-memors-pic")[
                            newIndex
                          ];
                        if (nextSlide) nextSlide.focus();
                      }
                    }}
                  >
                    {memor.image && (
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
                        </div>
                      </div>
                    )}
                  </SwiperSlide>
                ))}

              {Array.from(
                {
                  length: Math.max(
                    0,
                    5 -
                      Object.values(
                        memorsData.reduce((acc, memor) => {
                          if (!acc[memor.title] && memor.image?.length > 0) {
                            acc[memor.title] = memor;
                          }
                          return acc;
                        }, {})
                      ).length
                  ),
                },
                (_, index) => (
                  <SwiperSlide
                    key={`placeholder-${index}`}
                    className='placeholder-slide'
                    role="group"
                    aria-label="Placeholder"
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

        {selectedSlide && (
          <MemorPicture
            image={selectedSlide.image[0]}
            teamName={selectedSlide.team}
            title={selectedSlide.title}
            submitDate={selectedSlide.submittedDate}
            onClose={closeModal}
            aria-labelledby="memor-picture-modal"
          />
        )}
      </section>

      <section id='myMemors' className='container' aria-labelledby="memors-dashboard-heading">
        <Typography variant='h6' gutterBottom style={{ color: "white" }} id="memors-dashboard-heading">
          Memors Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() => (window.location.href = "/admin/adminBoard?tab=ongoing")}
              onKeyPress={(e) => handleKeyPress(e, () => (window.location.href = "/admin/adminBoard?tab=ongoing"))}
              style={{ cursor: "pointer" }}
              tabIndex="0"
              role="button"
              aria-label="View ongoing Memors"
            >
              <CardContent>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <Typography variant='h4' fontWeight='bold'>
                    {mockUser.pending_memors}
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
              onClick={() => (window.location.href = "/admin/adminBoard?tab=closed")}
              onKeyPress={(e) => handleKeyPress(e, () => (window.location.href = "/admin/adminBoard?tab=closed"))}
              style={{ cursor: "pointer" }}
              tabIndex="0"
              role="button"
              aria-label="View closed Memors"
            >
              <CardContent>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <Typography variant='h4' fontWeight='bold'>
                    {mockUser.complete_memors}
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
  <Card className='card' aria-labelledby="competition-heading">
    <CardContent>
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
            id="competition-heading"
          >
            The competition{" "}
            <span style={{ color: "#215952", fontWeight: "bold" }}>
              New Year New Us
            </span>{" "}
            ends in
          </Typography>
        </Box>
        <Countdown
          endDate='2025-01-31T00:00:00'
          role='admin'
          aria-label="Countdown to competition end: New Year New Us"
          aria-live="polite" // Ensures screen readers announce updates
        />
      </Box>
    </CardContent>
  </Card>
</Grid> 
        </Grid>
      </section>

      <section id='currentLeaders' className='pb-10 container' aria-labelledby="current-leaders-heading">
        <Typography variant='h6' gutterBottom style={{ color: "white" }} id="current-leaders-heading">
          Current Leaders
        </Typography>
        <Grid container spacing={2}>
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
                  onClick={() => (window.location.href = "/admin/leaderboard")}
                  onKeyPress={(e) => handleKeyPress(e, () => (window.location.href = "/admin/leaderboard"))}
                  style={{ cursor: "pointer" }}
                  tabIndex="0"
                  role="button"
                  aria-label={`View details for ${team.teamName}`}
                >
                  <Box display='flex' alignItems='center' style={{ width: "100%" }}>
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
                    <Box style={{ flex: team.rank === 1 ? 1 : 1.5, paddingRight: "20px" }}>
                      <Box className='team-header' display='flex' justifyContent='space-between'>
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
                      <Box className='stats' display='flex' justifyContent='space-between' marginTop='10px'>
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