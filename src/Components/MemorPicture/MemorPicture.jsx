import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";

const MemorPicture = ({ images, currentIndex, teamName, title, submitDate, onClose, onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);

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
  }, [onClose, activeIndex]);

  if (!images || images.length === 0) return null;

  const handlePrevious = () => {
    const newIndex = activeIndex <= 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex >= images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <button className='modal-close' onClick={onClose}>
        &times;
      </button>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <img src={images[activeIndex]} alt='Selected Memor' />
        
        <div className='modal-navigation'>
          <button 
            className='nav-button prev-button' 
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            &#10094;
          </button>
          <span className="image-counter">{activeIndex + 1} / {images.length}</span>
          <button 
            className='nav-button next-button' 
            onClick={handleNext}
            aria-label="Next image"
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
  images: PropTypes.arrayOf(PropTypes.string),
  currentIndex: PropTypes.number,
  teamName: PropTypes.string,
  title: PropTypes.string,
  submitDate: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func
};

export default MemorPicture;