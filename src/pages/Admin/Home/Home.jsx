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
    teamName: "Capital Crew",
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
  };

  const closeModal = () => {
    setSelectedSlide(null);
  };

  return (
    <>
      <WelcomeModal />
      <section className='mb-10'>
        <div className='container mb-3'>
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
                        <p>{slide.description}</p>
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

      <section id='myMemors' className='mb-10 container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          My Memors
        </Typography>
        <Grid container spacing={3}>
          {/* Pending Memors */}
          <Grid item xs={12} sm={3}>
            <Card className='card'>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    3
                  </Typography>
                  <img src={ongoing} alt='ongoing' />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Pending Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Closed Memors */}
          <Grid item xs={12} sm={3}>
            <Card className='card'>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    --
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
                <div className='flex justify-between items-center'>
                  <Typography
                    variant='h4'
                    fontWeight='bold'
                    fontSize={"1.5rem"}
                  >
                    Remaining time
                  </Typography>
                  <Typography
                    variant='h3'
                    fontWeight='bold'
                    color='white'
                    style={{ margin: "10px 0", fontSize: "2rem" }}
                  >
                    20 days
                  </Typography>
                </div>
                <Typography variant='body2' color='#B0B0B0'>
                  The theme of this competition is:{" "}
                  <span style={{ color: "white", fontWeight: "bold" }}>
                    Christmas
                  </span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      <section id='currentLeaders' className='mb-10 container'>
        <Typography variant='h6' gutterBottom style={{ color: "white" }}>
          Current Leaders
        </Typography>
        <Grid container spacing={3}>
          {/* First Place */}
          <Grid item xs={12} sm={5}>
            <Card className='card'>
              <Box
                display='flex'
                alignItems='center'
                style={{ width: "100%", height: "100%" }}
              >
                {/* Left Column - Number */}
                <Box style={{ flex: 1, textAlign: "center" }}>
                  <img
                    src={rank1}
                    alt='rank'
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      left: "10px",
                      height: "75%",
                    }}
                  />
                </Box>
                {/* Right Column - Team Details */}
                <Box style={{ flex: 1, paddingRight: "20px" }}>
                  <Box
                    className='team-header'
                    display='flex'
                    justifyContent='space-between'
                  >
                    <Typography variant='h6' className='team-name'>
                      Visual Voyagers
                    </Typography>
                    <img
                      src='https://via.placeholder.com/50'
                      alt='Visual Voyagers'
                      className='team-avatar-admin'
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
                        510
                      </Typography>
                    </div>
                    <div>
                      <Typography variant='body2' className='label'>
                        Total Memors
                      </Typography>
                      <Typography variant='h5' className='value'>
                        51
                      </Typography>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className='card'>
              <Box display='flex' alignItems='center' style={{ width: "100%" }}>
                {/* Left Column - Number */}
                <Box style={{ flex: 1, textAlign: "center" }}>
                  <img
                    src={rank2}
                    alt='rank'
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      left: "10px",
                      height: "65%",
                    }}
                  />
                </Box>

                {/* Right Column - Team Details */}
                <Box style={{ flex: 1.2, paddingRight: "20px" }}>
                  <Box
                    className='team-header'
                    display='flex'
                    justifyContent='space-between'
                  >
                    <Typography variant='h6' className='team-name'>
                      Visual Voyagers
                    </Typography>
                    <img
                      src='https://via.placeholder.com/50'
                      alt='Visual Voyagers'
                      className='team-avatar-admin'
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
                        510
                      </Typography>
                    </div>
                    <div>
                      <Typography variant='body2' className='label'>
                        Total Memors
                      </Typography>
                      <Typography variant='h5' className='value'>
                        51
                      </Typography>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className='card'>
              <Box display='flex' alignItems='center' style={{ width: "100%" }}>
                {/* Left Column - Number */}
                <Box style={{ flex: 1, textAlign: "center" }}>
                  <img
                    src={rank3}
                    alt='rank'
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      left: "10px",
                      height: "55%",
                    }}
                  />
                </Box>

                {/* Right Column - Team Details */}
                <Box style={{ flex: 1.5, paddingRight: "20px" }}>
                  <Box
                    className='team-header'
                    display='flex'
                    justifyContent='space-between'
                  >
                    <Typography variant='h6' className='team-name'>
                      Visual Voyagers
                    </Typography>
                    <img
                      src='https://via.placeholder.com/50'
                      alt='Visual Voyagers'
                      className='team-avatar-admin'
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
                        510
                      </Typography>
                    </div>
                    <div>
                      <Typography variant='body2' className='label'>
                        Total Memors
                      </Typography>
                      <Typography variant='h5' className='value'>
                        51
                      </Typography>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default Home;
