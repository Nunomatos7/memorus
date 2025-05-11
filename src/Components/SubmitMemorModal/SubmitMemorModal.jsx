import { useState, useRef, useEffect } from "react";
import "./SubmitMemorModal.css";
import "../FeedbackModal/FeedbackModal.css";
import { Typography, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Groups, Stars } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import QRCode from "react-qr-code";
import UploadButton from "../../assets/images/UploadButton.svg";
import CustomButton from "../CustomButton/CustomButton";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import MemorPicture from "../MemorPicture/MemorPicture";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

const SubmitMemorModal = ({ memor, onClose, onSubmit }) => {
  const { token, user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitMemorOpen, setIsSubmitMemorOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isSubmitMemorOpen && modalRef.current && !selectedImage) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          if (selectedImage) {
            setSelectedImage(null);
          } else {
            onClose();
          }
        } else if (event.key === "Tab") {
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSubmitMemorOpen, selectedImage, onClose]);

  const normalizedImages = (() => {
    const images = memor.image || [];
    const placeholderCount = Math.max(6 - images.length, 0);
    return [...images, ...Array(placeholderCount).fill(null)];
  })();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError(null);
    
    if (!file) {
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.');
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum size is 10MB.');
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }
    
    // Set the uploaded file for submission
    setUploadedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    console.log("🔄 handleSubmit iniciado");

    if (!uploadedFile || !uploadedImage) {
      console.log("❌ Nenhuma imagem carregada");
      setFeedback({
        type: "error",
        title: "Oops! Something happened...",
        description:
          "Please upload an image before submitting! Try again or check the details.",
      });
      setIsSubmitMemorOpen(false);
      return;
    }

    try {
      // Create FormData object and append the file
      const formData = new FormData();
      formData.append("image", uploadedFile);

      console.log("📤 A enviar imagem para memor:", memor.id);
      console.log("🧾 Headers:", {
        Authorization: `Bearer ${token}`,
        "X-Tenant": user?.tenant_subdomain,
      });

      // Set up loading state
      setIsSubmitting(true);

      // Send the request using fetch with FormData
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/memors/${memor.id}/pictures`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user?.tenant_subdomain,
          },
          body: formData,
        }
      );

      // Reset loading state
      setIsSubmitting(false);

      console.log("✅ Resposta recebida:", res);

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Erro da API:", errText);
        throw new Error("Erro ao submeter a imagem: " + errText);
      }

      const responseData = await res.json();
      console.log("🎉 Submissão bem-sucedida:", responseData);

      // Show success feedback
      setFeedback({
        type: "success",
        title: "You submitted a Memor",
        description:
          responseData.points_awarded > 0
            ? `Congratulations! You earned ${responseData.points_awarded} points for your team. Check your team's Memory Board to see your new Memor.`
            : "Another one to the team board, keep going! Check your team's Memory Board to see your new Memor.",
      });

      onSubmit();
    } catch (err) {
      console.error("💥 Erro no handleSubmit:", err);
      setFeedback({
        type: "error",
        title: "Failed to submit",
        description: err.message || "Something went wrong. Please try again.",
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
      // Reset file input for a new attempt
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadedImage(null);
      setUploadedFile(null);
      setUploadError(null);
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
          <div
            ref={modalRef}
            className='modal-container'
            role='dialog'
            aria-modal='true'
            tabIndex={-1}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
          >
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
              <Typography
                variant='h5'
                id='modal-title'
                className='modal-title'
                aria-live='polite'
              >
                {memor.title}
              </Typography>
              <Typography
                variant='body2'
                id='modal-description'
                className='modal-description'
                aria-live='polite'
              >
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

            {/* Display upload error if any */}
            {uploadError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff5252'
                }}
              >
                {uploadError}
              </Alert>
            )}

            <div className='modal-upload'>
              <div className='upload-box'>
                {uploadedImage ? (
                  <div className='uploaded-image'>
                    <img src={uploadedImage} alt='Uploaded' />
                    <Typography 
                      variant='body2' 
                      sx={{ 
                        color: "#DDDAF2", 
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      <CloudUploadIcon fontSize="small" />
                      Image ready to submit
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ 
                        color: "#d0bcfe", 
                        mt: 1,
                        fontSize: "0.8rem",
                        "&:hover": {
                          backgroundColor: "rgba(208, 188, 254, 0.08)"
                        }
                      }}
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Choose different image
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className='qr-code-placeholder'>
                      <QRCode
                        value={`https://memor-us.com/memors/${memor.id}`}
                        size={128}
                        bgColor='transparent'
                        fgColor='#d0bcfe'
                        style={{ padding: "8px", borderRadius: "8px" }}
                      />
                      <Typography variant='body2' style={{ color: "#DDDAF2" }}>
                        Scan it with your phone
                      </Typography>
                    </div>
                    <Typography variant='body2' className='or-text'>
                      or
                    </Typography>
                    <div className='qr-code-placeholder'>
                      <label
                        htmlFor='file-input'
                        tabIndex={0}
                        role='button'
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            document.getElementById("file-input").click();
                          }
                        }}
                      >
                        <img
                          src={UploadButton}
                          alt='Upload Button'
                          className='upload-button'
                        />
                      </label>

                      <input
                        id='file-input'
                        ref={fileInputRef}
                        type='file'
                        accept='image/jpeg,image/png,image/webp,image/gif'
                        aria-label='Upload photo button'
                        className='file-input'
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <Typography variant='body2' sx={{ color: "#DDDAF2" }}>
                        Upload Computer File
                      </Typography>
                      <Typography 
                        variant='caption' 
                        sx={{ 
                          color: "#9282F9",
                          display: "block",
                          mt: 1,
                          fontSize: "0.7rem"
                        }}
                      >
                        Supported: JPEG, PNG, WebP, GIF (max 10MB)
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
                  tabIndex={image ? 0 : -1}
                  className='photo-slide'
                  onClick={(event) => image && handleImageClick(image, event)}
                  onKeyDown={(event) => {
                    if (image && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      handleImageClick(image, event);
                    }
                  }}
                >
                  {image ? (
                    <img
                      style={{ cursor: "pointer" }}
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
                images={memor.image}
                currentIndex={memor.image.indexOf(selectedImage)}
                title={memor.title}
                submitDate={memor.dueDate}
                teamName={memor.team}
                onClose={() => setSelectedImage(null)}
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
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "transparent",
                  border: "1px solid #988c9c",
                  color: "#D0BCFE",
                  "&:hover": {
                    backgroundColor: "rgba(181, 237, 228, 0.08)",
                  },
                  "&:disabled": {
                    color: "#645c6b",
                    borderColor: "#645c6b"
                  }
                }}
              />
              <CustomButton
                text={isSubmitting ? 'Submitting...' : 'Submit'}
                onClick={handleSubmit}
                disabled={isSubmitting || !uploadedImage}
                icon={isSubmitting ? <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> : null}
                sx={{
                  backgroundColor: "#d0bcfe",
                  color: "#381e72",
                  "&:hover": {
                    backgroundColor: "#c8acf4",
                  },
                  "&:disabled": {
                    backgroundColor: "#a395c5",
                    color: "#2d1a54"
                  },
                  minWidth: "120px"
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
    id: PropTypes.number.isRequired,
  }).isRequired,

  onClose: PropTypes.func.isRequired,

  onSubmit: PropTypes.func.isRequired,
};

export default SubmitMemorModal;