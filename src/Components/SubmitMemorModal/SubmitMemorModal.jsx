import { useState, useRef, useEffect } from "react";
import "./SubmitMemorModal.css";
import "../FeedbackModal/FeedbackModal.css";
import {
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
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
  const [loadingTeamPhotos, setLoadingTeamPhotos] = useState(false);
  const [normalizedImages, setNormalizedImages] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrError, setQrError] = useState(null);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const qrRefreshInterval = useRef(null);

  useEffect(() => {
    console.log("SubmitMemorModal: Initial memor=", memor);
    console.log("SubmitMemorModal: memor.image=", memor.image);
  }, [memor]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      if (qrRefreshInterval.current) {
        clearInterval(qrRefreshInterval.current);
      }
    };
  }, []);

  // Generate QR code URL with temporary token
  useEffect(() => {
    const generateQRCodeUrl = async () => {
      console.log("=== QR Code Generation Debug ===");
      console.log("memor?.id:", memor?.id);
      console.log("token exists:", !!token);
      console.log("user?.tenant_subdomain:", user?.tenant_subdomain);
      console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

      if (!memor?.id || !token || !user?.tenant_subdomain) {
        console.log("Missing required data for QR generation, skipping...");
        return;
      }

      setIsGeneratingQR(true);
      setQrError(null);

      try {
        const requestUrl = `${import.meta.env.VITE_API_URL}/api/memors/${
          memor.id
        }/temp-token`;
        console.log("Making request to:", requestUrl);

        const requestHeaders = {
          Authorization: `Bearer ${token}`,
          "X-Tenant": user.tenant_subdomain,
          "Content-Type": "application/json",
        };
        console.log("Request headers:", requestHeaders);

        const response = await fetch(requestUrl, {
          method: "POST",
          headers: requestHeaders,
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);
          throw new Error(
            `Failed to generate temporary token: ${response.status} - ${errorText}`
          );
        }

        const responseData = await response.json();
        console.log("Response data:", responseData);

        const { tempToken } = responseData;
        if (!tempToken) {
          console.error("No tempToken in response:", responseData);
          throw new Error("No temporary token received from server");
        }

        // Generate appropriate URL based on environment
        const isLocalhost = window.location.hostname.includes("localhost");
        const protocol = isLocalhost ? "http" : "https";
        const domain = isLocalhost
          ? `${window.location.hostname}:${window.location.port || "5173"}`
          : `${user.tenant_subdomain}.memor-us.com`;

        const qrUrl = `${protocol}://${domain}/app/memors/${memor.id}?token=${tempToken}`;
        console.log("Generated QR URL:", qrUrl);

        setQrCodeUrl(qrUrl);
        console.log("✅ QR code URL generated successfully");

        // Refresh the token every 2.5 minutes (before 3-minute expiry)
        if (qrRefreshInterval.current) {
          clearInterval(qrRefreshInterval.current);
        }

        qrRefreshInterval.current = setInterval(() => {
          console.log("🔄 Refreshing QR token...");
          generateQRCodeUrl();
        }, 150000); // 2.5 minutes
      } catch (error) {
        console.error("❌ Error generating QR code URL:", error);
        console.error("Error stack:", error.stack);
        setQrError(`Failed to generate QR code: ${error.message}`);

        // Fallback to basic URL without token
        const fallbackUrl = `https://${user.tenant_subdomain}.memor-us.com/app/memors/${memor.id}`;
        console.log("Using fallback URL:", fallbackUrl);
        setQrCodeUrl(fallbackUrl);
      } finally {
        setIsGeneratingQR(false);
      }
    };

    generateQRCodeUrl();

    return () => {
      if (qrRefreshInterval.current) {
        clearInterval(qrRefreshInterval.current);
      }
    };
  }, [memor?.id, token, user?.tenant_subdomain]);

  useEffect(() => {
    if (!memor || !memor.id || !token || !user?.tenant_subdomain) return;

    setLoadingTeamPhotos(true);

    const fetchTeamPhotos = async () => {
      try {
        console.log(
          `Fetching pictures for memor ID: ${memor.id} (Team: ${user?.teamsId})`
        );

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/memors/${memor.id}/pictures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch memor pictures: ${response.status}`);
        }

        const pictures = await response.json();
        console.log("API returned pictures:", pictures);
        console.log(
          `Received ${pictures.length} team pictures for memor ${memor.id}`
        );

        setNormalizedImages(pictures);
        console.log("Set normalizedImages to:", pictures);

        if (!memor.image || memor.image.length === 0) {
          memor.image = pictures.map((pic) => ({
            img_src: pic.img_src,
            alt_text: pic.alt_text,
          }));
          console.log("Updated memor.image with alt_text:", memor.image);
        }
      } catch (error) {
        console.error("Error fetching team photos:", error);
        if (memor.image && memor.image.length > 0) {
          const objectImages = memor.image.map((url) => {
            if (typeof url === "string") {
              return {
                img_src: url,
                alt_text: "Memor image",
              };
            }
            return url;
          });
          setNormalizedImages(objectImages);
          console.log(
            "Using existing memor.image as normalized images:",
            objectImages
          );
        } else {
          setNormalizedImages([]);
        }
      } finally {
        setLoadingTeamPhotos(false);
      }
    };

    fetchTeamPhotos();
  }, [memor?.id, token, user?.tenant_subdomain, user?.teamsId]);

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
            document.body.style.overflow = "auto";
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

  const fullNormalizedImages = (() => {
    const images = normalizedImages || [];
    const placeholderCount = Math.max(6 - images.length, 0);
    return [...images, ...Array(placeholderCount).fill(null)];
  })();

  const handleImageClick = (image, event) => {
    if (event) {
      event.stopPropagation();
    }

    console.log("SubmitMemorModal: handleImageClick called with image:", image);

    let imageIndex = -1;

    if (typeof image === "object" && image.img_src) {
      imageIndex = normalizedImages.findIndex(
        (img) =>
          (typeof img === "object" && img.img_src === image.img_src) ||
          (typeof img === "string" && img === image.img_src)
      );
    } else if (typeof image === "string") {
      imageIndex = normalizedImages.findIndex(
        (img) =>
          (typeof img === "string" && img === image) ||
          (typeof img === "object" && img.img_src === image)
      );
    }

    console.log("SubmitMemorModal: Found image at index:", imageIndex);

    const selectedIndex = imageIndex >= 0 ? imageIndex : 0;

    if (selectedIndex < normalizedImages.length) {
      console.log(
        "SubmitMemorModal: Selected image:",
        normalizedImages[selectedIndex]
      );
    }

    setSelectedImage(selectedIndex);
    document.body.style.overflow = "hidden";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError(null);

    if (!file) {
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Invalid file type. Please select a JPEG, PNG, WebP, or GIF image."
      );
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File is too large. Maximum size is 10MB.");
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !uploadedImage) {
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
      const formData = new FormData();
      formData.append("image", uploadedFile);

      setIsSubmitting(true);

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

      setIsSubmitting(false);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to submit image: " + errText);
      }

      const responseData = await res.json();

      if (responseData.img_src) {
        const newImages = [...normalizedImages, responseData.img_src];
        setNormalizedImages(newImages);
        memor.image = newImages;
      }

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
      console.error("Error in handleSubmit:", err);
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

            {/* Display upload error */}
            {uploadError && (
              <Alert
                severity='error'
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  color: "#ff5252",
                }}
              >
                {uploadError}
              </Alert>
            )}

            {/* Display QR code error */}
            {qrError && (
              <Alert
                severity='warning'
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  color: "#ff9800",
                }}
              >
                {qrError}
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <CloudUploadIcon fontSize='small' />
                      Image ready to submit
                    </Typography>
                    <Button
                      variant='text'
                      size='small'
                      sx={{
                        color: "#d0bcfe",
                        mt: 1,
                        fontSize: "0.8rem",
                        "&:hover": {
                          backgroundColor: "rgba(208, 188, 254, 0.08)",
                        },
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
                      {isGeneratingQR ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <CircularProgress
                            size={40}
                            sx={{ color: "#d0bcfe" }}
                          />
                          <Typography
                            variant='body2'
                            style={{ color: "#DDDAF2" }}
                          >
                            Generating secure QR code...
                          </Typography>
                        </Box>
                      ) : qrCodeUrl ? (
                        <>
                          <QRCode
                            value={qrCodeUrl}
                            size={128}
                            bgColor='transparent'
                            fgColor='#d0bcfe'
                            style={{ padding: "8px", borderRadius: "8px" }}
                          />
                          <Typography
                            variant='body2'
                            style={{ color: "#DDDAF2" }}
                          >
                            Scan with your phone (expires in 3 min)
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant='body2'
                          style={{ color: "#DDDAF2" }}
                        >
                          QR code unavailable
                        </Typography>
                      )}
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
                          fontSize: "0.7rem",
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

            {loadingTeamPhotos ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={30} sx={{ color: "#d0bcfe" }} />
              </Box>
            ) : (
              <>
                {normalizedImages.length > 0 ? (
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={5.3}
                    freeMode={true}
                    modules={[FreeMode, Mousewheel]}
                    mousewheel={true}
                    className='uploaded-photos-slider'
                  >
                    {fullNormalizedImages.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        tabIndex={image ? 0 : -1}
                        className='photo-slide'
                        onClick={(event) =>
                          image && handleImageClick(image, event)
                        }
                        onKeyDown={(event) => {
                          if (
                            image &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            handleImageClick(image, event);
                          }
                        }}
                      >
                        {image ? (
                          <img
                            style={{ cursor: "pointer" }}
                            src={
                              typeof image === "string" ? image : image.img_src
                            }
                            alt={
                              typeof image === "object" && image.alt_text
                                ? image.alt_text
                                : `Team photo ${index + 1}`
                            }
                            className='photo'
                            onError={(e) => {
                              e.target.src =
                                "/assets/images/image-placeholder.svg";
                              e.target.alt = "Image failed to load";
                            }}
                          />
                        ) : (
                          <div className='photo-placeholder'></div>
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Typography variant='body2' className='no-photos-text'>
                    No team memors uploaded yet.
                  </Typography>
                )}
              </>
            )}

            {selectedImage !== null && (
              <MemorPicture
                images={normalizedImages}
                currentIndex={
                  typeof selectedImage === "number" ? selectedImage : 0
                }
                title={memor.title}
                submitDate={memor.dueDate}
                teamName={memor.team}
                onClose={() => {
                  setSelectedImage(null);
                  document.body.style.overflow = "auto";
                }}
              />
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
                    borderColor: "#645c6b",
                  },
                }}
              />
              <CustomButton
                text={isSubmitting ? "Submitting..." : "Submit"}
                onClick={handleSubmit}
                disabled={isSubmitting || !uploadedImage}
                icon={
                  isSubmitting ? (
                    <CircularProgress
                      size={16}
                      color='inherit'
                      sx={{ mr: 1 }}
                    />
                  ) : null
                }
                sx={{
                  backgroundColor: "#d0bcfe",
                  color: "#381e72",
                  "&:hover": {
                    backgroundColor: "#c8acf4",
                  },
                  "&:disabled": {
                    backgroundColor: "#a395c5",
                    color: "#2d1a54",
                  },
                  minWidth: "120px",
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
    team_submissions: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,

  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SubmitMemorModal;
