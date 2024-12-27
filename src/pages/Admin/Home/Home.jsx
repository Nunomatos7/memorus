import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import MemorPicture from "../../../Components/MemorPicture/MemorPicture";
import "swiper/css";
import "swiper/css/free-mode";
import "./Home.css";
import WelcomeModal from "../../../Components/WelcomeModal/WelcomeModal";

const cardStyle = {
  backgroundColor: "#1E1E1E",
  color: "white",
  borderRadius: "10px",
  minHeight: "150px",
};

const slidesData = [
  {
    id: 1,
    teamName: "The Debuggers",
    title: "Coffe break",
    description: "A nice coffe break with friends",
    submitDate: "2 days ago",
    // fazer função para calcular o tempo restante
    image:
      "https://cdn.pixabay.com/photo/2023/10/23/16/24/bird-8336436_1280.jpg",
  },
  {
    id: 2,
    teamName: "Capital crew",
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
];

const Home = () => {
  const [selectedSlide, setSelectedSlide] = useState(null);

  const handleImageClick = (slide) => {
    setSelectedSlide(slide); // Pass the entire slide object
  };

  const closeModal = () => {
    setSelectedSlide(null);
  };

  return (
    <>
      <WelcomeModal />
      <section className='mb-10'>
        <div className='container mb-3'>
          <h1 className='home-title'>
            Latest Memors
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
          <Grid item xs={12} sm={4}>
            <Card style={cardStyle}>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    3
                  </Typography>
                  <AccessTimeIcon
                    style={{ color: "#9F80FF", fontSize: "30px" }}
                  />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Pending Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Memors */}
          <Grid item xs={12} sm={4}>
            <Card style={cardStyle}>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h4' fontWeight='bold'>
                    --
                  </Typography>
                  <PersonIcon style={{ color: "#9F80FF", fontSize: "30px" }} />
                </Box>
                <Typography variant='body2' color='#B0B0B0'>
                  Completed Memors
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Remaining Time */}
          <Grid item xs={12} sm={4}>
            <Card style={cardStyle}>
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
                    style={{ margin: "10px 0", fontSize: "2.5rem" }}
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
    </>
  );
};

export default Home;
