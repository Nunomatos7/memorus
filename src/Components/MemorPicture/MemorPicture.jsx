import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";
import { useAuth } from "../../context/AuthContext"; // Add this import

const MemorPicture = ({
  images,
  currentIndex,
  teamName,
  title,
  submitDate,
  onClose,
  onNavigate,
  memorId, // Add this prop
}) => {
  const { token, user } = useAuth(); // Get auth context to access user's team
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);
  const [teamFilteredImages, setTeamFilteredImages] = useState([]);
  
  // Load team-filtered images if memorId is provided
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
            console.log('Loaded team-filtered images:', teamPictures);
            if (teamPictures.length > 0) {
              setTeamFilteredImages(teamPictures);
            } else {
              // Fallback to provided images if no team images found
              console.log('No team pictures found, using provided images');
              setTeamFilteredImages(images);
            }
          }
        } catch (error) {
          console.error('Error loading team images:', error);
          setTeamFilteredImages(images);
        }
      } else {
        // Use provided images if memorId is not available
        setTeamFilteredImages(images);
      }
    };
    
    loadTeamFilteredImages();
  }, [memorId, images, token, user?.tenant_subdomain]);
  
  // Debug - log what images we received
  useEffect(() => {
    console.log("MemorPicture received images:", images);
    console.log("Using team filtered images:", teamFilteredImages);
    
    if (images && images.length > 0) {
      console.log("First image format:", images[0]);
      // If it's an object with img_src and alt_text
      if (typeof images[0] === 'object' && images[0] !== null) {
        console.log("First image alt_text:", images[0].alt_text);
      }
    }
  }, [images, teamFilteredImages]);
  
  const handlePrevious = useCallback(() => {
    setActiveIndex(prev => {
      if (teamFilteredImages.length === 0) return prev;
      const newIndex = prev <= 0 ? teamFilteredImages.length - 1 : prev - 1;
      if (onNavigate) onNavigate(newIndex);
      return newIndex;
    });
  }, [teamFilteredImages, onNavigate]);
  
  const handleNext = useCallback(() => {
    setActiveIndex(prev => {
      if (teamFilteredImages.length === 0) return prev;
      const newIndex = prev >= teamFilteredImages.length - 1 ? 0 : prev + 1;
      if (onNavigate) onNavigate(newIndex);
      return newIndex;
    });
  }, [teamFilteredImages, onNavigate]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrevious, handleNext]);
  
  if (!teamFilteredImages || teamFilteredImages.length === 0) {
    if (images && images.length > 0) {
      // Fallback to original images if team filtering returned nothing
      return (
        <div className='modal-overlay' onClick={onClose}>
          <div className='modal-content'>
            <p style={{ color: 'white' }}>Loading images...</p>
          </div>
        </div>
      );
    }
    return null;
  }
  
  // Get current image
  const currentImage = teamFilteredImages[activeIndex];
  console.log("Current image at index", activeIndex, ":", currentImage);
  
  // Get image URL and alt text
  let imageUrl = '';
  let altText = 'Memor image';
  
  if (typeof currentImage === 'string') {
    imageUrl = currentImage;
  } else if (currentImage && typeof currentImage === 'object') {
    // Handle all possible object structures we've seen in the codebase
    if (currentImage.img_src) {
      imageUrl = currentImage.img_src;
      if (currentImage.alt_text) {
        altText = currentImage.alt_text;
        console.log("Using alt_text from object:", altText);
      }
    } else if (currentImage.image) {
      imageUrl = currentImage.image;
      if (currentImage.alt_text) {
        altText = currentImage.alt_text;
        console.log("Using alt_text from image property:", altText);
      }
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <button className='modal-close' onClick={onClose}>
        &times;
      </button>
      <div className='memor-modal-content' onClick={(e) => e.stopPropagation()}>
        <img 
          src={imageUrl} 
          alt={altText}
        />
        <div className='modal-navigation'>
          <button
            className='nav-button prev-button'
            onClick={handlePrevious}
            aria-label='Previous image'
          >
            &#10094;
          </button>
          <span className='image-counter'>
            {activeIndex + 1} / {teamFilteredImages.length}
          </span>
          <button
            className='nav-button next-button'
            onClick={handleNext}
            aria-label='Next image'
          >
            &#10095;
          </button>
        </div>
        <div className='modal-sub-content'>
          <h2>{title}</h2>
          <p>
            {teamName} • {submitDate}
          </p>
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
  memorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Add this
};

export default MemorPicture;