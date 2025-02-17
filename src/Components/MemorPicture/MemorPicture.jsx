import { useEffect } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";

const MemorPicture = ({ image, teamName, title, submitDate, onClose }) => {
  if (!image) return null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className='modal-overlay' onClick={onClose}>
      <button className='modal-close' onClick={onClose}>
        &times;
      </button>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <img src={image} alt='Selected Memor' />
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
  image: PropTypes.string,
  teamName: PropTypes.string,
  title: PropTypes.string,
  submitDate: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default MemorPicture;
