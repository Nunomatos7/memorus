import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";
import { useAuth } from "../../context/AuthContext";

const MemorPicture = ({
  images,
  currentIndex,
  teamName,
  title,
  submitDate,
  onClose,
  onNavigate,
  memorId,
}) => {
  const { token, user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);
  const [teamFilteredImages, setTeamFilteredImages] = useState([]);

  useEffect(() => {
    const loadTeamFilteredImages = async () => {
      if (memorId && token && user?.tenant_subdomain) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/memors/${memorId}/pictures`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant": user.tenant_subdomain,
              },
            }
          );

          if (response.ok) {
            const teamPictures = await response.json();
            if (teamPictures.length > 0) {
              setTeamFilteredImages(teamPictures);
            } else {
              setTeamFilteredImages(images);
            }
          }
        } catch {
          setTeamFilteredImages(images);
        }
      } else {
        setTeamFilteredImages(images);
      }
    };
    loadTeamFilteredImages();
  }, [memorId, images, token, user?.tenant_subdomain]);

  useEffect(() => {
    console.log("MemorPicture: currentIndex changed to:", currentIndex);

    if (currentIndex !== undefined && currentIndex !== null) {
      const maxIndex = Math.max(
        0,
        (teamFilteredImages.length || images.length) - 1
      );
      const safeIndex = Math.max(0, Math.min(currentIndex, maxIndex));
      console.log("MemorPicture: Setting activeIndex to:", safeIndex);
      setActiveIndex(safeIndex);
    }
  }, [currentIndex, teamFilteredImages.length, images.length]);

  useEffect(() => {
    if (
      teamFilteredImages.length > 0 &&
      currentIndex !== undefined &&
      currentIndex !== null
    ) {
      const maxIndex = teamFilteredImages.length - 1;
      const safeIndex = Math.max(0, Math.min(currentIndex, maxIndex));
      setActiveIndex(safeIndex);
    }
  }, [teamFilteredImages, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "Right": // For older browsers
          event.preventDefault();
          handleNextImage();
          break;
        case "ArrowLeft":
        case "Left": // For older browsers
          event.preventDefault();
          handlePreviousImage();
          break;
        case "Escape":
        case "Esc": // For older browsers
          event.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Focus the modal container for accessibility
    const modalElement = document.querySelector(".modal-overlay");
    if (modalElement) {
      modalElement.focus();
    }

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, teamFilteredImages.length, onClose]);

  const handleNextImage = () => {
    if (teamFilteredImages.length <= 1) return;

    const newIndex =
      activeIndex >= teamFilteredImages.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  const handlePreviousImage = () => {
    if (teamFilteredImages.length <= 1) return;

    const newIndex =
      activeIndex <= 0 ? teamFilteredImages.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  // Handle background click to close modal
  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (background)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!teamFilteredImages || teamFilteredImages.length === 0) {
    if (images && images.length > 0) {
      return (
        <div className='modal-overlay' onClick={handleOverlayClick}>
          <div className='modal-content'>
            <p style={{ color: "white" }}>Loading images...</p>
          </div>
        </div>
      );
    }
    return null;
  }

  const galleryImages = teamFilteredImages.map((img) => {
    if (typeof img === "string") {
      return { original: img, thumbnail: img };
    } else if (img && typeof img === "object") {
      const src = img.img_src || img.image || "";
      return {
        original: src,
        thumbnail: src,
        description: img.alt_text || "Memor image",
        originalAlt: img.alt_text || "Memor image",
        thumbnailAlt: img.alt_text || "Memor image",
      };
    }
    return { original: "", thumbnail: "" };
  });

  return (
    <div
      className='modal-overlay'
      onClick={handleOverlayClick}
      tabIndex={0}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      <button
        className='modal-close'
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label='Close viewer'
      >
        &times;
      </button>
      {galleryImages.length > 1 && (
        <>
          <button
            className='memor-nav-arrow left'
            aria-label='Previous image'
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousImage();
            }}
          >
            &#10094;
          </button>
          <button
            className='memor-nav-arrow right'
            aria-label='Next image'
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
          >
            &#10095;
          </button>
        </>
      )}
      <div className='memor-main-area'>
        <div className='memor-main-image-container'>
          <img
            src={galleryImages[activeIndex]?.original}
            alt={galleryImages[activeIndex]?.originalAlt}
            className='memor-main-image'
            draggable={false}
          />
        </div>
      </div>
      <div className='memor-modal-thumbnails-fixed'>
        <div className='modal-sub-content'>
          <h2 id='modal-title'>{title}</h2>
          <p id='modal-description'>
            {teamName} • {submitDate}
          </p>
        </div>
        <div className='memor-thumbnails-row'>
          {galleryImages.map((item, idx) => (
            <img
              key={idx}
              src={item.thumbnail}
              alt={item.thumbnailAlt}
              className={`memor-thumbnail${
                activeIndex === idx ? " active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
                if (onNavigate) onNavigate(idx);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(idx);
                  if (onNavigate) onNavigate(idx);
                }
              }}
              tabIndex={0}
              role='button'
              aria-label={`Go to image ${idx + 1}`}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

MemorPicture.propTypes = {
  images: PropTypes.array.isRequired,
  currentIndex: PropTypes.number,
  teamName: PropTypes.string,
  title: PropTypes.string,
  submitDate: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
  memorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MemorPicture;
