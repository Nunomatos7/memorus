import React from "react";
import "./FeedbackModal.css";
import CustomButton from "../CustomButton/CustomButton";

// figures for the background
// import back1 from "../../assets/images/feedbackModalBack1.svg";
// import back2 from "../../assets/images/feedbackModalBack2.svg";
// import back3 from "../../assets/images/feedbackModalBack3.svg";
// import back4 from "../../assets/images/feedbackModalBack4.svg";

const FeedbackModal = ({ type, title, description, actions }) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return "😱";
      case "success":
        return "🥰";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-icon">{getIcon()}</div>
        <h2 className="feedback-title">{title}</h2>
        <p className="feedback-description">{description}</p>
        <div className="feedback-actions">
          {actions.map((action, index) => (
            <CustomButton
              key={index}
              text={action.label}
              onClick={action.onClick}
              sx={action.style}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
