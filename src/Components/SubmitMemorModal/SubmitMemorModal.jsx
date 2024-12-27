import React, { useState } from "react";
import "./SubmitMemorModal.css";
import { Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Groups, Stars } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import QrCode from "../../assets/images/QRcode.svg";
import UploadButton from "../../assets/images/UploadButton.svg";
import CustomButton from "../CustomButton/CustomButton";

const SubmitMemorModal = ({ memor, onClose, onSubmit }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="modal-overlay-submit-memor"
      onClick={(e) => e.target.className === "modal-overlay" && onClose()}
    >
      <div className="modal-container">
        <div className="modal-top">
          <Button
            onClick={onClose}
            sx={{ minWidth: 0, p: 0, color: "#CAC4D0" }}
          >
            <ArrowBackIcon />
          </Button>
          <h4>Details</h4>
        </div>
        <div className="modal-header">
          <Typography variant="h5" className="modal-title">
            {memor.title}
          </Typography>
          <Typography variant="body2" className="modal-description">
            {memor.description}
          </Typography>
        </div>
        <div className="modal-details">
          <div className="modal-details-header">
            <Groups />
            <p className="submission-status">{memor.submission}</p>
          </div>
          <div className="modal-details-header">
            <TodayIcon />
            <p className="due-date">Due on {memor.dueDate}</p>
          </div>
          <div className="modal-details-header">
            <Stars />
            <p className="points">+{memor.points} points</p>
          </div>
        </div>
        <div className="modal-upload">
          <div className="upload-box">
            {uploadedImage ? (
              <div className="uploaded-image">
                <img src={uploadedImage} alt="Uploaded" />
              </div>
            ) : (
              <>
                <div className="qr-code-placeholder">
                  <img src={QrCode} alt="QR code" />
                  <Typography variant="body2" style={{ color: "#DDDAF2" }}>
                    Scan it with your phone
                  </Typography>
                </div>
                <Typography variant="body2" className="or-text">
                  or
                </Typography>
                <div className="qr-code-placeholder">
                  <label htmlFor="file-input">
                    <img
                      src={UploadButton}
                      alt="Upload Button"
                      className="upload-button"
                    />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Typography variant="body2" sx={{ color: "#DDDAF2" }}>
                    Upload Computer File
                  </Typography>
                </div>
              </>
            )}
          </div>
        </div>
        <Typography variant="body2" className="uploaded-photos-title">
          Your team's photos for this Memor
        </Typography>
        <div className="uploaded-photos-slider">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="photo-placeholder"></div>
            ))}
        </div>
        <Typography variant="body2" className="no-photos-text">
          No team memors uploaded yet.
        </Typography>

        <div className="modal-actions">
          <CustomButton text="Cancel" onClose={onClose} />
          <CustomButton
            text="Submit"
            onClick={() => {
              if (uploadedImage) {
                onSubmit();
              } else {
                alert("Please upload an image before submitting!");
              }
            }}
            sx={{
              backgroundColor: "#d0bcfe",
              color: "#381e72",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmitMemorModal;
