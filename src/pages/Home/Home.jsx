import { useState } from "react";
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

const rankImages = {
  1: rank1,
  2: rank2,
  3: rank3,
};

const slidesData = [
  {
    id: 1,
    teamName: "The Debuggers",
    title: "Coffee break",
    description: "A nice coffee break with friends",
    submitDate: "2 days ago",
    image:
      "https://cdn.pixabay.com/photo/2023/10/23/16/24/bird-8336436_1280.jpg",
  },
  {
    id: 2,
    teamName: "The Debuggers",
    title: "Show us your city",
    description: "We bet it must look nice :)",
    submitDate: "8 days ago",
    image:
      "https://media.istockphoto.com/id/1368628035/photo/brooklyn-bridge-at-sunset.jpg?s=612x612&w=0&k=20&c=hPbMbTYRAVNYWAUMkl6r62fPIjGVJTXzRURCyCfoG08=",
  },
  { id: 3, image: "" },
  { id: 4, image: "" },
  { id: 5, image: "" },
  { id: 6, image: "" },
  { id: 7, image: "" },
  { id: 8, image: "" },
];

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
          <h1
            className='home-title'
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            Latest Memors <span>•</span>{" "}
            <span className='team-name' style={{ color: "#5547bf" }}>
              The Debuggers
            </span>
          </h1>
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
              {slidesData.map((slide) => (
                <SwiperSlide
                  key={slide.id}
                  className={
                    slide.image ? "latest-memors-pic" : "latest-memors"
                  }
                >
                  {slide.image && (
                    <div onClick={() => handleImageClick(slide)}>
                      <div className='image-wrapper'>
                        <img
                          width={"100%"}
                          height={"100%"}
                          style={{ objectFit: "cover" }}
                          src={slide.image}
                          alt=''
                        />
                      </div>
                      <div className='latest-memors-content'>
                        <h3>{slide.submitDate}</h3>
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
            image={selectedSlide.image}
            teamName={selectedSlide.teamName}
            title={selectedSlide.title}
            submitDate={selectedSlide.submitDate}
            onClose={closeModal}
          />
        )}
      </section>

      <section id='myMemors' className='container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          My Memors
        </Typography>
        <Grid container spacing={3}>
          {/* Pending Memors */}
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() => (window.location.href = "/memors?tab=incomplete")}
              style={{ cursor: "pointer" }}
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    3
                  </Typography>
                  <img src={pending} alt='pending' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Pending Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Memors */}
          <Grid item xs={12} sm={3}>
            <Card
              className='card'
              onClick={() => (window.location.href = "/memors?tab=completed")}
              style={{ cursor: "pointer" }}
            >
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    --
                  </Typography>
                  <img src={completed} alt='Completed memeors icon' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Completed Memors
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
                      <span style={{ color: "#5547bf", fontWeight: "bold" }}>
                        Christmas
                      </span>{" "}
                      ends in
                    </Typography>
                  </Box>
                  <Countdown endDate='2025-12-25T00:00:00' />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      {/* Current Leaders */}
      <section id='currentLeaders' className='pb-10 container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          Current Leaders
        </Typography>
        <Grid container spacing={3}>
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
