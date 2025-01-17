import { useState } from "react";
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

// const slidesData = [
//   {
//     id: 1,
//     teamName: "The Debuggers",
//     title: "Coffee break",
//     description: "A nice coffee break with friends",
//     submitDate: "2 days ago",
//     image:
//       "https://cdn.pixabay.com/photo/2023/10/23/16/24/bird-8336436_1280.jpg",
//   },
//   {
//     id: 2,
//     teamName: "Capital Crew",
//     title: "Show us your city",
//     description: "We bet it must look nice :)",
//     submitDate: "8 days ago",
//     image:
//       "https://media.istockphoto.com/id/1368628035/photo/brooklyn-bridge-at-sunset.jpg?s=612x612&w=0&k=20&c=hPbMbTYRAVNYWAUMkl6r62fPIjGVJTXzRURCyCfoG08=",
//   },
//   { id: 3, image: "" },
//   { id: 4, image: "" },
//   { id: 5, image: "" },
//   { id: 6, image: "" },
//   { id: 7, image: "" },
//   { id: 8, image: "" },
// ];

const Home = () => {
  const [selectedSlide, setSelectedSlide] = useState(null);

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
      <WelcomeModal />
      <section className='mb-10'>
        <div
          className='container'
          style={{ marginBottom: "1rem", marginTop: "2rem" }}
        >
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
          <h1 className='home-title'>Latest Memors</h1>
        </div>

        {/* Swiper */}
        <div className='overflow-hidden w-full'>
          <div className='container'>
            <Swiper
              spaceBetween={20}
              breakpoints={{
                640: {
                  slidesPerView: 2.3,
                },
                768: {
                  slidesPerView: 4.3,
                },
                1024: {
                  slidesPerView: 5.3,
                },
              }}
              className='latest-wrapper'
              freeMode={true}
              mousewheel={{
                releaseOnEdges: true,
              }}
              modules={[Mousewheel, FreeMode]}
            >
              {/* Slides */}
              {Object.values(
                memorsData.reduce((acc, memor) => {
                  // Ensure we only include one memor per title
                  if (!acc[memor.title]) {
                    acc[memor.title] = memor;
                  }
                  return acc;
                }, {})
              )
                .sort((a, b) => a.id - b.id) // Sort titles by ID or some ordering criterion
                .map((memor, index) => {
                  // Distribute memors cyclically across teams
                  const teamIndex = index % memorsData.length;
                  const team = memorsData[teamIndex].team;
                  return {
                    ...memor,
                    team, // Assign a team to the memor
                  };
                })
                .map((slide) => (
                  <SwiperSlide
                    key={slide.id}
                    className={
                      slide.image ? "latest-memors-pic" : "latest-memors"
                    }
                  >
                    {slide.image && slide.image.length > 0 && (
                      <div onClick={() => handleImageClick(slide)}>
                        <div className='image-wrapper'>
                          <img
                            width={"100%"}
                            height={"100%"}
                            style={{ objectFit: "cover" }}
                            src={slide.image[0]} // Use the first image
                            alt='Memor Image'
                          />
                        </div>
                        <div className='latest-memors-content'>
                          <CustomButton
                            text={slide.team}
                            onClick={() => handleImageClick(slide)}
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
                          <h3>{slide.submittedDate}</h3>
                          <p style={{ fontSize: "0.9rem" }}>
                            &quot;{slide.title}&quot;
                          </p>
                        </div>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>

        {/* Modal Component */}
        {selectedSlide && (
          <MemorPicture
            image={selectedSlide.image[0]}
            teamName={selectedSlide.team}
            title={selectedSlide.title}
            submitDate={selectedSlide.submittedDate}
            onClose={closeModal}
          />
        )}
      </section>

      <section id='myMemors' className='container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          Memors Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Pending Memors */}
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() =>
                (window.location.href = "/admin/adminBoard?tab=ongoing")
              }
              style={{ cursor: "pointer" }}
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    {mockUser.pending_memors}
                  </Typography>
                  <img src={ongoing} alt='ongoing' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Ongoing Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Closed Memors */}
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() =>
                (window.location.href = "/admin/adminBoard?tab=closed")
              }
              style={{ cursor: "pointer" }}
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    {mockUser.complete_memors}
                  </Typography>
                  <img src={closed} alt='ongoing' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Closed Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Remaining Time */}
          <Grid item xs={12} sm={6}>
            <Card className='card'>
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
                      <span style={{ color: "#215952", fontWeight: "bold" }}>
                        New Year New Us
                      </span>{" "}
                      ends in
                    </Typography>
                  </Box>
                  <Countdown endDate='2025-01-31T00:00:00' role='admin' />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      <section id='currentLeaders' className='pb-10 container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
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
                  style={{ cursor: "pointer" }}
                >
                  <Box
                    display='flex'
                    alignItems='center'
                    style={{ width: "100%" }}
                  >
                    {/* Left Column - Rank Image */}
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

                    {/* Right Column - Team Details */}
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
            ))}
        </Grid>
      </section>
    </>
  );
};

export default Home;
