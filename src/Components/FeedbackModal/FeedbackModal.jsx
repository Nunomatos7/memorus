import React, { useEffect } from "react";
import "./FeedbackModal.css";
import CustomButton from "../CustomButton/CustomButton";

const FeedbackModal = ({ type, title, description, actions }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getIcon = () => {
    switch (type) {
      case "error":
        return "😱";
      case "success":
        return "🥰";
      default:
        return "ℹ";
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
