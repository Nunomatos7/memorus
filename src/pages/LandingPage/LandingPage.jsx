import { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./LandingPage.css";

// Import your existing assets (you'll need to move these to your assets folder)
import logo from "../../../assets/landing-assets/logo-nav.svg";
import heroImg from "../../../assets/landing-assets/heroImg.png";
import topRight from "../../../assets/landing-assets/top-right.svg";
import botLeft from "../../../assets/landing-assets/bot-left.svg";
import botRight from "../../../assets/landing-assets/bot-right.svg";
import homePng from "../../../assets/landing-assets/home.png";
import ongoingPng from "../../../assets/landing-assets/ongoing.png";
import leaderboardPng from "../../../assets/landing-assets/leaderboard.png";
import memoryboardPng from "../../../assets/landing-assets/memoryboard.png";
import bgSlide from "../../../assets/landing-assets/bg-slide.png";
import bgSlideAdmin from "../../../assets/landing-assets/bg-slide-admin.png";
import homePngAdmin from "../../../assets/landing-assets/home-admin.png";
import ongoingPngAdmin from "../../../assets/landing-assets/ongoing-admin.png";
import memoryboardPngAdmin from "../../../assets/landing-assets/memoryboard-admin.png";
import adminBgLeft from "../../../assets/landing-assets/admin-bg-left.svg";
import adminBgRight from "../../../assets/landing-assets/admin-bg-right.svg";
import logoWhite from "../../../assets/landing-assets/logo-white.svg";
import footerRight from "../../../assets/landing-assets/footer-right.svg";
import footerLeft from "../../../assets/landing-assets/footer-left.svg";

// Custom hook for scroll animations
const useScrollAnimation = (delay = 0) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return [
    ref,
    controls,
    {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    },
  ];
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexAdmin, setActiveIndexAdmin] = useState(0);
  const swiperRef = useRef(null);
  const swiperRefAdmin = useRef(null);

  // Scroll animation hooks
  const [heroRef, heroControls, heroVariants] = useScrollAnimation();
  const [featuresRef, featuresControls, featuresVariants] =
    useScrollAnimation(0.2);
  const [collabRef, collabControls, collabVariants] = useScrollAnimation(0.3);
  const [adminRef, adminControls, adminVariants] = useScrollAnimation(0.4);
  const [ctaRef, ctaControls, ctaVariants] = useScrollAnimation(0.2);

  useEffect(() => {
    document.title =
      "Memor'us | Where teams turn moments into collectible memories";
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Content Array - Collaborator
  const changeSlide = (index) => {
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
  };

  const slidesContentCollab = [
    {
      title: "Teams' hub for tracking and celebrating memories ",
      description1:
        "You'll find the latest updates with the freshest memors from your team, giving you a front-row seat to everything happening in real time.",
      description2:
        "You can dive into your personal progress with a quick glance. And let's not miss the leaderboard, where you can cheer on the current champions or strategize your way to the top.",
      specialTitle1: "",
      specialDesc1: "",
      specialTitle2: "",
      specialDesc2: "",
      image: homePng,
      buttonName: "Sharing success",
    },
    {
      title: "Teams can share their best moments",
      description1:
        "Your central hub for all team-building activities, showcasing ongoing and past Memors. It inspires participation, simplifies challenge management, and boosts motivation.",
      description2: "",
      specialTitle1: "Ongoing Memors",
      specialDesc1:
        "Top cards display your task names, due dates, and statuses, with urgency labels to keep your team focused.",
      specialTitle2: "Task Progress",
      specialDesc2:
        "Your Memors are filtered and with labels highlighting achievements, celebrating your progress, and energizing your future tasks.",
      image: ongoingPng,
      buttonName: "Promoting Teamwork",
    },
    {
      title: "Turning achievements into team motivation",
      description1: "",
      description2: "",
      specialTitle1: "Leaderboard",
      specialDesc1:
        "A clear, exciting view of the race to the top, showcasing team rankings based on completed Memors and earned points.",
      specialTitle2: "Celebrating Achievements",
      specialDesc2:
        "Highlights team wins and collective efforts, fostering pride, camaraderie, and collaboration.",
      image: leaderboardPng,
      buttonName: "Inspire Fair Challenge",
    },
    {
      title: "Unlocking team potentials while creating memories",
      description1:
        "The Digital Memory Board is a visual path of your team's achievements. Designed to inspire, celebrate, and connect your team. It captures the essence of collaboration and accomplishment.",
      description2:
        "Whether you're an administrator shaping the experience or a collaborator bringing memories to life, the Digital Memory Board ensures everyone is connected, inspired, and ready to make every moment count.",
      specialTitle1: "",
      specialDesc1: "",
      specialTitle2: "",
      specialDesc2: "",
      image: memoryboardPng,
      buttonName: "Boost Team Spirit",
    },
  ];

  // Content Array - Admin
  const changeSlideAdmin = (indexAdmin) => {
    if (swiperRefAdmin.current && swiperRefAdmin.current.slideTo) {
      swiperRefAdmin.current.slideTo(indexAdmin);
    }
  };

  const slidesContentAdmin = [
    {
      title: "Oversee the status of all the teams",
      description1: "",
      description2: "",
      specialTitle1: "View All Teams' Latest Memories Memor Activities",
      specialDesc1:
        "Browse through recently uploaded. You can see when and who posted the memor.",
      specialTitle2: "Monitor Memor Activities",
      specialDesc2:
        "You can track how many memories are about and which were created already with the number of Ongoing Memors Closed memors.",
      specialTitle3: "Leaderboard",
      specialDesc3:
        "Check the Remaining Time and see the theme of the competition. Analyze Team Performance and view who's running at the top at the ranking.",
      image: homePngAdmin,
      buttonName: "Overview Teams' Progress",
    },
    {
      title: "Space where creativity meets management",
      description1: "",
      description2: "",
      specialTitle1: "Create & Customize",
      specialDesc1:
        'Use the "Create a Memor" button to design interactive challenges, from fun photo tasks to collaborative activities, fostering team connection.',
      specialTitle2: "Organize & Track",
      specialDesc2:
        'The "All," "Ongoing," and "Closed" Memors provides a clear progress view. Admins can edit details, adjust deadlines, and update points, while the Time Left column keeps teams on track.',
      specialTitle3: "Motivation Through Points",
      specialDesc3:
        "Assigning points sparks friendly competition, inspiring teams to rise to the challenge.",
      image: ongoingPngAdmin,
      buttonName: "Shape And Guide Teams",
    },
    {
      title: "Space to build, organize and amplify team collaboration",
      description1: "",
      description2: "",
      specialTitle1: "Create & Edit Teams",
      specialDesc1:
        'The "Create a Team" button allows admins to form or update groups for seamless teamwork and engagement.',
      specialTitle2: "Detailed Overview",
      specialDesc2:
        "Teams are displayed with member lists for a clear snapshot of who's involved.",
      specialTitle3: "Easy Updates",
      specialDesc3:
        "Admins can edit details or reshuffle teams using intuitive tools, ensuring the roster stays current.",
      image: memoryboardPngAdmin,
      buttonName: "Managing success",
    },
  ];

  // Get started URL - you may want to modify this based on your routing needs
  const getStartedUrl = "/app/login"; // Or wherever you want to redirect users

  return (
    <div className='landing-page bg-gray-900 text-white'>
      {/* Navbar */}
      <motion.nav
        className='flex items-center justify-between px-6 py-4 relative'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Logo */}
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='h-8 object-contain' />
        </div>

        {/* Navigation Links */}
        <div className='hidden sm:flex items-center space-x-6'>
          <a
            href={getStartedUrl}
            className='px-4 py-2 text-sm font-semibold text-gray-900 bg-[#D0BCFE] rounded-full hover:bg-purple-300 hover:text-gray-900 transition-all duration-300 ease-in-out'
          >
            Get Started
          </a>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className='sm:hidden text-purple-400 focus:outline-none'
          onClick={toggleMenu}
          aria-label='Toggle Menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </motion.nav>

      {/* Sliding Menu (Mobile) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{
          type: "tween",
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className='fixed top-0 right-0 w-full h-full bg-gray-800 z-50 flex flex-col items-center justify-center sm:hidden'
      >
        {/* Close Button */}
        <button
          className='absolute top-6 right-6 text-[#65558f] text-2xl focus:outline-none'
          onClick={closeMenu}
        >
          &times;
        </button>

        {/* Buttons */}
        <div className='flex flex-col mt-8 space-y-4'>
          <a
            href={getStartedUrl}
            className='px-4 py-2 text-sm font-semibold text-gray-900 bg-[#D0BCFE] rounded-full hover:bg-purple-300 transition-all duration-300 ease-in-out'
          >
            Get Started
          </a>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial='hidden'
        animate={heroControls}
        variants={heroVariants}
        className='relative flex flex-col items-center justify-center text-center px-6 py-10 overflow-hidden'
      >
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className='text-3xl sm:text-5xl font-medium leading-tight mb-6 max-w-3xl z-10'
        >
          Where <span className='text-[#d0bcfe]'>teams</span> turn moments
          <br />
          into <span className='text-[#d0bcfe]'>collectible memories</span>
        </motion.h1>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className='flex space-x-3 mb-8 z-10'
        >
          <a
            href={getStartedUrl}
            className='px-5 py-2 text-md font-semibold text-gray-900 bg-[#d0bcff] rounded-full hover:bg-purple-400 transition-all duration-300 ease-in-out'
          >
            Get Started
          </a>
        </motion.div>

        {/* Image Container */}
        <motion.div
          variants={scaleIn}
          className='relative w-full max-w-4xl z-10'
        >
          {/* Video Overlay */}
          <div className='iframe-container absolute top-1/2 mt-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[90%]'>
            <iframe
              width='100%'
              height='450'
              src='https://www.youtube.com/embed/3aiPeL7qYk0?autoplay=1&mute=1&loop=1&playlist=3aiPeL7qYk0'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
              className='rounded-lg shadow-lg'
            ></iframe>
          </div>

          {/* Hero Image */}
          <motion.img
            src={heroImg}
            alt='Hero'
            className='relative z-10 rounded-lg max-w-full'
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Background Shapes */}
          <motion.img
            src={topRight}
            alt='Top Right'
            className='absolute right-5 z-0 lg:h-44 sm:h-14 h-0'
            style={{ top: "-5%" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={botLeft}
            alt='Bot Left'
            className='absolute bottom-9 lg:w-44 sm:w-14 w-0 z-0'
            style={{ left: "-3rem" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={botRight}
            alt='Bot Right'
            className='absolute bottom-9 right-5 z-50 lg:w-14 sm:w-4 w-0'
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.section>

      <motion.hr
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 container mx-auto'
      />

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial='hidden'
        animate={featuresControls}
        variants={featuresVariants}
        className='relative container mx-auto flex flex-col items-center justify-center text-center px-6 py-10 overflow-hidden'
      >
        <motion.h1
          variants={itemVariants}
          className='text-2xl sm:text-4xl font-medium leading-tight mb-6 max-w-3xl z-10'
        >
          <span className='text-purple-400'>
            Administrators and Collaborators work
          </span>{" "}
          together to create vibrant communities
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className='text-sm sm:text-md font-light mb-6 max-w-2xl z-10'
        >
          We blend the power of team-shared achievements into drivers of
          motivation and collaboration.
        </motion.p>
      </motion.section>

      {/* Collaborators Section */}
      <motion.section
        ref={collabRef}
        initial='hidden'
        animate={collabControls}
        variants={collabVariants}
        className='relative collaborator flex flex-col items-center justify-start px-6 py-14 pt-10'
      >
        {/* Title Section */}
        <div className='lg:text-left container lg:mx-auto self-start w-full sm:text-center sm:self-center'>
          <motion.h1
            variants={itemVariants}
            className='lg:text-3xl lg:ms-14 sm:ms-0 sm:text-4xl font-bold text-white mb-14'
          >
            Collaborators
          </motion.h1>
          <motion.div variants={itemVariants} className='text-center'>
            <p className='text-md sm:text-lg text-white'>
              View notifications, updates, achievements on your Memory Board,
              and revisit past team milestones.
            </p>
          </motion.div>
        </div>

        {/* Buttons Section */}
        <motion.div
          variants={containerVariants}
          className='flex flex-wrap justify-center space-x-2 sm:space-x-4 mt-8 sm:mt-12'
        >
          {slidesContentCollab.map((slide, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              className={`px-4 py-2 font-semibold rounded-full shadow transition duration-300 mb-4 sm:mb-0 ${
                activeIndex === index
                  ? "bg-purple-200 text-[#381e72]"
                  : "bg-transparent text-white border border-purple-200 hover:bg-purple-200 hover:text-[#381e72]"
              }`}
              onClick={() => {
                setActiveIndex(index);
                changeSlide(index);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slide.buttonName}
            </motion.button>
          ))}
        </motion.div>

        {/* Swiper Section */}
        <motion.div
          variants={scaleIn}
          className='relative p-6 sm:p-12 rounded-xl shadow-lg mt-12 w-full max-w-[1440px] mx-auto z-10'
          style={{
            backgroundImage: `url(${bgSlide})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            spaceBetween={20}
            slidesPerView={1}
            className='h-auto mt-7'
          >
            {slidesContentCollab.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className='flex flex-col lg:flex-row items-center p-6 pb-0 sm:p-12 sm:pb-0 sm:pt-20'>
                  {/* Text Section */}
                  <div className='lg:w-1/2 text-left mb-8 lg:mb-0 pr-0 sm:pr-8'>
                    {slide.title && (
                      <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#381e72] mb-4 sm:mb-6'>
                        {slide.title}
                      </h2>
                    )}
                    {slide.description1 && (
                      <p className='text-[#381e72] text-md sm:text-lg mb-4 sm:mb-6'>
                        {slide.description1}
                      </p>
                    )}
                    {slide.description2 && (
                      <p className='text-[#381e72] text-md sm:text-lg mb-4 sm:mb-6'>
                        {slide.description2}
                      </p>
                    )}
                    {slide.specialTitle1 && (
                      <div className='mb-4 sm:mb-6'>
                        <h3 className='text-lg sm:text-xl font-bold text-[#381e72]'>
                          {slide.specialTitle1}
                        </h3>
                        <p className='text-[#381e72] text-sm sm:text-md'>
                          {slide.specialDesc1}
                        </p>
                      </div>
                    )}
                    {slide.specialTitle2 && (
                      <div>
                        <h3 className='text-lg sm:text-xl font-bold text-[#381e72]'>
                          {slide.specialTitle2}
                        </h3>
                        <p className='text-[#381e72] text-sm sm:text-md'>
                          {slide.specialDesc2}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image Section */}
                  <div className='lg:w-1/2 flex justify-center'>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className='w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] object-cover'
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.section>

      {/* Admin section */}
      <motion.section
        ref={adminRef}
        initial='hidden'
        animate={adminControls}
        variants={adminVariants}
        className='relative flex flex-col items-center justify-start px-4 sm:px-6 py-16 sm:py-28'
      >
        {/* Title Section */}
        <div className='container w-full lg:mx-auto lg:text-right sm:text-center'>
          <motion.h1
            variants={itemVariants}
            className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[#82D5C7] mb-6 sm:mb-14'
          >
            Administrators
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className='text-sm sm:text-lg text-[#82D5C7] max-w-lg mx-auto lg:mx-0'
          >
            View notifications, updates, achievements on your Memory Board, and
            revisit past team milestones.
          </motion.p>
        </div>

        {/* Buttons Section */}
        <motion.div
          variants={containerVariants}
          className='flex flex-wrap justify-center space-x-2 sm:space-x-4 mt-6 sm:mt-12'
        >
          {slidesContentAdmin.map((slideAdmin, indexAdmin) => (
            <motion.button
              key={indexAdmin}
              variants={itemVariants}
              className={`px-4 py-2 font-semibold rounded-full shadow transition duration-300 mb-4 sm:mb-0 ${
                activeIndexAdmin === indexAdmin
                  ? "bg-[#82D5C7] text-[#013A2B]"
                  : "bg-transparent text-[#82D5C7] border border-[#82D5C7] hover:bg-[#82D5C7] hover:text-[#013A2B]"
              }`}
              onClick={() => {
                setActiveIndexAdmin(indexAdmin);
                changeSlideAdmin(indexAdmin);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slideAdmin.buttonName}
            </motion.button>
          ))}
        </motion.div>

        {/* Swiper Section */}
        <div className='relative w-full'>
          <motion.div
            variants={scaleIn}
            className='relative p-6 sm:p-12 rounded-xl shadow-lg mt-12 w-full max-w-[1440px] mx-auto z-10'
            style={{
              backgroundImage: `url(${bgSlideAdmin})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Swiper
              onSwiper={(swiper) => (swiperRefAdmin.current = swiper)}
              onSlideChange={(swiper) =>
                setActiveIndexAdmin(swiper.activeIndex)
              }
              spaceBetween={20}
              slidesPerView={1}
              className='h-auto mt-7'
            >
              {slidesContentAdmin.map((slideAdmin, indexAdmin) => (
                <SwiperSlide key={indexAdmin}>
                  <div className='flex flex-col lg:flex-row items-center p-6 sm:p-12'>
                    {/* Text Section */}
                    <div className='lg:w-1/2 text-left mb-8 lg:mb-0 pr-0 sm:pr-8'>
                      {slideAdmin.title && (
                        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#003731] mb-4'>
                          {slideAdmin.title}
                        </h2>
                      )}
                      {slideAdmin.description1 && (
                        <p className='text-[#003731] text-sm sm:text-lg mb-4'>
                          {slideAdmin.description1}
                        </p>
                      )}
                      {slideAdmin.description2 && (
                        <p className='text-[#003731] text-sm sm:text-lg mb-4'>
                          {slideAdmin.description2}
                        </p>
                      )}
                      {slideAdmin.specialTitle1 && (
                        <div className='mb-4'>
                          <h3 className='text-lg sm:text-xl font-bold text-[#003731]'>
                            {slideAdmin.specialTitle1}
                          </h3>
                          <p className='text-[#003731] text-sm sm:text-md'>
                            {slideAdmin.specialDesc1}
                          </p>
                        </div>
                      )}
                      {slideAdmin.specialTitle2 && (
                        <div className='mb-4'>
                          <h3 className='text-lg sm:text-xl font-bold text-[#003731]'>
                            {slideAdmin.specialTitle2}
                          </h3>
                          <p className='text-[#003731] text-sm sm:text-md'>
                            {slideAdmin.specialDesc2}
                          </p>
                        </div>
                      )}
                      {slideAdmin.specialTitle3 && (
                        <div>
                          <h3 className='text-lg sm:text-xl font-bold text-[#003731]'>
                            {slideAdmin.specialTitle3}
                          </h3>
                          <p className='text-[#003731] text-sm sm:text-md'>
                            {slideAdmin.specialDesc3}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image Section */}
                    <div className='lg:w-1/2 flex justify-center'>
                      <img
                        src={slideAdmin.image}
                        alt={slideAdmin.title}
                        className='w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] object-cover'
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Background Decorations */}
          <motion.img
            src={adminBgLeft}
            alt='Admin Background Left'
            className='absolute top-0 w-16 sm:w-32 z-0'
            style={{ left: "-2rem" }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.img
            src={adminBgRight}
            alt='Admin Background Right'
            className='absolute bottom-0 w-16 sm:w-32 z-0'
            style={{ right: "-2rem" }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </motion.section>

      <motion.hr
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 container mx-auto'
      />

      {/* Call to Action */}
      <motion.section
        ref={ctaRef}
        initial='hidden'
        animate={ctaControls}
        variants={ctaVariants}
        className='relative flex items-center justify-center h-[300px] w-full'
      >
        <motion.div
          variants={scaleIn}
          className='relative text-center text-white'
        >
          <motion.h1
            variants={itemVariants}
            className='text-2xl sm:text-4xl font-bold'
          >
            <span className='text-[#D0BCFE]'>Bringing the Building</span> in
            Team-Building to the next level
          </motion.h1>
          <motion.a
            href={getStartedUrl}
            variants={itemVariants}
            className='mt-6 bg-[#D0BCFE] text-black font-semibold rounded-full hover:bg-[#B9A8F6] transition px-6 py-3 inline-block'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className='w-full relative h-[200px] bg-[#381E72] flex items-center justify-center'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo and Links */}
        <motion.div
          className='relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-[600px] px-6 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className='flex items-center mb-4 md:mb-0 md:mr-6'
          >
            <img
              src={logoWhite}
              alt="Memor'us Logo"
              className='h-8 sm:h-10 object-contain'
            />
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={scaleIn}
            className='hidden md:block h-px w-40 bg-white my-4 md:my-0 md:mx-6'
          />

          {/* Links */}
          <motion.div
            variants={containerVariants}
            className='flex flex-col text-start gap-3'
          >
            <motion.a
              variants={itemVariants}
              href='#'
              className='text-white text-sm hover:text-purple-300 transition-colors'
            >
              About Us
            </motion.a>
            <motion.a
              variants={itemVariants}
              href='#'
              className='text-white text-sm hover:text-purple-300 transition-colors'
            >
              Manage cookies
            </motion.a>
            <motion.a
              variants={itemVariants}
              href='#'
              className='text-white text-sm hover:text-purple-300 transition-colors'
            >
              Terms of Use
            </motion.a>
            <motion.a
              variants={itemVariants}
              href='#'
              className='text-white text-sm hover:text-purple-300 transition-colors'
            >
              Get support
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Background Left Image */}
        <motion.img
          src={footerLeft}
          alt='Footer Left'
          className='absolute bottom-0 left-0 h-32 z-0'
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Background Right Image */}
        <motion.img
          src={footerRight}
          alt='Footer Right'
          className='absolute top-0 right-0 h-32 z-0'
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </motion.footer>
    </div>
  );
};

export default LandingPage;
