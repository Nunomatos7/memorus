import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";

const MemorPicture = ({
  images,
  currentIndex,
  teamName,
  title,
  submitDate,
  onClose,
  onNavigate,
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);
  
  // Debug - log what images we received
  useEffect(() => {
    console.log("MemorPicture received images:", images);
    if (images && images.length > 0) {
      console.log("First image format:", images[0]);
      // If it's an object with img_src and alt_text
      if (typeof images[0] === 'object' && images[0] !== null) {
        console.log("First image alt_text:", images[0].alt_text);
      }
    }
  }, [images]);
  
  const handlePrevious = useCallback(() => {
    setActiveIndex(prev => {
      const newIndex = prev <= 0 ? images.length - 1 : prev - 1;
      if (onNavigate) onNavigate(newIndex);
      return newIndex;
    });
  }, [images, onNavigate]);
  
  const handleNext = useCallback(() => {
    setActiveIndex(prev => {
      const newIndex = prev >= images.length - 1 ? 0 : prev + 1;
      if (onNavigate) onNavigate(newIndex);
      return newIndex;
    });
  }, [images, onNavigate]);
  
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
  
  if (!images || images.length === 0) return null;
  
  // Get current image
  const currentImage = images[activeIndex];
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
            {activeIndex + 1} / {images.length}
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
};

export default MemorPicture;