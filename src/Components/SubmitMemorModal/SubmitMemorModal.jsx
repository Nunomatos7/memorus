import { useState } from "react";
import "./SubmitMemorModal.css";
import "../FeedbackModal/FeedbackModal.css";
import { Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Groups, Stars } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import QrCode from "../../assets/images/QRcode.svg";
import UploadButton from "../../assets/images/UploadButton.svg";
import CustomButton from "../CustomButton/CustomButton";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import MemorPicture from "../MemorPicture/MemorPicture";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import PropTypes from "prop-types";

const SubmitMemorModal = ({ memor, onClose, onSubmit }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitMemorOpen, setIsSubmitMemorOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const normalizedImages = (() => {
    const images = memor.image || [];
    const placeholderCount = Math.max(6 - images.length, 0);
    return [...images, ...Array(placeholderCount).fill(null)];
  })();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeMemorPicture = () => {
    setSelectedImage(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (uploadedImage) {
      onSubmit();

      setFeedback({
        type: "success",
        title: "You submitted a Memor",
        description:
          "Another one to the team board, keep going! Check your team's Memory Board to see your new Memor.",
      });
    } else {
      setFeedback({
        type: "error",
        title: "Oops! Something happened...",
        description:
          "Please upload an image before submitting! Try again or check the details.",
      });

      setIsSubmitMemorOpen(false);
    }
  };

  const closeFeedbackModal = () => {
    setFeedback(null);
    if (feedback?.type === "success") {
      onClose();
    } else {
      setIsSubmitMemorOpen(true);
    }
  };

  return (
    <>
      {feedback && (
        <FeedbackModal
          type={feedback.type}
          title={feedback.title}
          description={feedback.description}
          actions={
            feedback.type === "error"
              ? [
                  {
                    label: "Close",
                    onClick: onClose,
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid #988c9c",
                      color: "#D0BCFE",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    },
                  },
                  {
                    label: "Try Again",
                    onClick: closeFeedbackModal,
                    style: {
                      backgroundColor: "#d0bcfe",
                      color: "#381e72",
                      "&:hover": {
                        backgroundColor: "#c8acf4",
                      },
                    },
                  },
                ]
              : [
                  {
                    label: "Close",
                    onClick: closeFeedbackModal,
                    style: {
                      backgroundColor: "transparent",
                      border: "1px solid #988c9c",
                      color: "#D0BCFE",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    },
                  },
                  {
                    label: "Go to Memory Board",
                    onClick: () => {
                      onSubmit();
                      window.location.href = "/memoryBoard";
                    },
                    style: {
                      backgroundColor: "#d0bcfe",
                      color: "#381e72",
                      "&:hover": {
                        backgroundColor: "#c8acf4",
                      },
                    },
                  },
                ]
          }
        />
      )}

      {isSubmitMemorOpen && !feedback && (
        <div className='modal-overlay-submit-memor'>
          <div className='modal-container'>
            <div className='modal-top'>
              <Button
                onClick={onClose}
                sx={{ minWidth: 0, p: 0, color: "#CAC4D0" }}
              >
                <ArrowBackIcon />
              </Button>
              <h4>Details</h4>
            </div>
            <div className='modal-header'>
              <Typography variant='h5' className='modal-title'>
                {memor.title}
              </Typography>
              <Typography variant='body2' className='modal-description'>
                {memor.description}
              </Typography>
            </div>
            <div className='modal-details'>
              <div className='modal-details-header'>
                <Groups />
                <p className='submission-status'>{memor.submission}</p>
              </div>
              <div className='modal-details-header'>
                <TodayIcon />
                <p className='due-date'>Due on {memor.dueDate}</p>
              </div>
              <div className='modal-details-header'>
                <Stars />
                <p className='points'>+{memor.points} points</p>
              </div>
            </div>
            <div className='modal-upload'>
              <div className='upload-box'>
                {uploadedImage ? (
                  <div className='uploaded-image'>
                    <img src={uploadedImage} alt='Uploaded' />
                  </div>
                ) : (
                  <>
                    <div className='qr-code-placeholder'>
                      <img src={QrCode} alt='QR code' />
                      <Typography variant='body2' style={{ color: "#DDDAF2" }}>
                        Scan it with your phone
                      </Typography>
                    </div>
                    <Typography variant='body2' className='or-text'>
                      or
                    </Typography>
                    <div className='qr-code-placeholder'>
                      <label htmlFor='file-input'>
                        <img
                          src={UploadButton}
                          alt='Upload Button'
                          className='upload-button'
                        />
                      </label>
                      <input
                        id='file-input'
                        type='file'
                        accept='image/*'
                        className='file-input'
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <Typography variant='body2' sx={{ color: "#DDDAF2" }}>
                        Upload Computer File
                      </Typography>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Typography variant='body2' className='uploaded-photos-title'>
              Your team&apos;s photos for this Memor
            </Typography>

            <Swiper
              spaceBetween={15}
              slidesPerView={5.3}
              freeMode={true}
              modules={[FreeMode, Mousewheel]}
              mousewheel={true}
              className='uploaded-photos-slider'
            >
              {normalizedImages.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className='photo-slide'
                  onClick={() => image && handleImageClick(image)}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`Team photo ${index + 1}`}
                      className='photo'
                    />
                  ) : (
                    <div className='photo-placeholder'></div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {selectedImage && (
              <MemorPicture
                image={selectedImage}
                title={memor.title}
                submitDate={memor.dueDate}
                teamName={memor.team}
                onClose={closeMemorPicture}
              />
            )}

            {(memor.image?.length ?? 0) === 0 && (
              <Typography variant='body2' className='no-photos-text'>
                No team memors uploaded yet.
              </Typography>
            )}

            <div className='modal-actions'>
              <CustomButton
                text='Cancel'
                onClick={onClose}
                sx={{
                  backgroundColor: "transparent",
                  border: "1px solid #988c9c",
                  color: "#D0BCFE",
                  "&:hover": {
                    backgroundColor: "rgba(181, 237, 228, 0.08)",
                  },
                }}
              />
              <CustomButton
                text='Submit'
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#d0bcfe",
                  color: "#381e72",
                  "&:hover": {
                    backgroundColor: "#c8acf4",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

SubmitMemorModal.propTypes = {
  memor: PropTypes.shape({
    image: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    submission: PropTypes.string,
    dueDate: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    team: PropTypes.string.isRequired,
  }).isRequired,

  onClose: PropTypes.func.isRequired,

  onSubmit: PropTypes.func.isRequired,
};

export default SubmitMemorModal;
