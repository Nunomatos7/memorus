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
    setActiveIndex(currentIndex || 0);
  }, [currentIndex]);

  if (!teamFilteredImages || teamFilteredImages.length === 0) {
    if (images && images.length > 0) {
      return (
        <div className='modal-overlay' onClick={onClose}>
          <div className='modal-content'>
            <p style={{ color: "white" }}>Loading images...</p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Prepare images for react-image-gallery
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
    <div className='modal-overlay' onClick={onClose}>
      <button
        className='modal-close'
        onClick={onClose}
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
              setActiveIndex((prev) =>
                prev <= 0 ? galleryImages.length - 1 : prev - 1
              );
              if (onNavigate)
                onNavigate(
                  activeIndex <= 0 ? galleryImages.length - 1 : activeIndex - 1
                );
            }}
          >
            &#10094;
          </button>
          <button
            className='memor-nav-arrow right'
            aria-label='Next image'
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) =>
                prev >= galleryImages.length - 1 ? 0 : prev + 1
              );
              if (onNavigate)
                onNavigate(
                  activeIndex >= galleryImages.length - 1 ? 0 : activeIndex + 1
                );
            }}
          >
            &#10095;
          </button>
        </>
      )}
      <div className='memor-main-area'>
        <div
          className='memor-main-image-container'
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={galleryImages[activeIndex]?.original}
            alt={galleryImages[activeIndex]?.originalAlt}
            className='memor-main-image'
            draggable={false}
          />
        </div>
        <div className='modal-sub-content'>
          <h2>{title}</h2>
          <p>
            {teamName} • {submitDate}
          </p>
        </div>
      </div>
      <div className='memor-modal-thumbnails-fixed'>
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
