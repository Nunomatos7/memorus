import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import MemorPicture from "./../../Components/MemorPicture/MemorPicture";
import "swiper/css";
import "swiper/css/free-mode";
import "./Home.css";

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
    // fazer função para calcular o tempo restante
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
      <section className='mb-10'>
        <div className='container mb-3'>
          <h1 className='home-title'>
            Latest Memors • <span className='team-name'>The Debuggers</span>
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
        <h2>My memors</h2>
      </section>
    </>
  );
};

export default Home;
