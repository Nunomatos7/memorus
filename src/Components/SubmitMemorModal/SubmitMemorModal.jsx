import React, { useState } from "react";
import "./SubmitMemorModal.css";
import { Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Groups, Stars } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import QrCode from "../../assets/images/QRcode.svg";
import UploadButton from "../../assets/images/UploadButton.svg";

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
			className="modal-overlay"
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
									<Typography
										variant="body2"
										style={{ color: "#DDDAF2" }}
									>
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
									<Typography
										variant="body2"
										sx={{ color: "#DDDAF2" }}
									>
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
							<div
								key={index}
								className="photo-placeholder"
							></div>
						))}
				</div>
				<Typography variant="body2" className="no-photos-text">
					No team memors uploaded yet.
				</Typography>

				<div className="modal-actions">
					<Button
						variant="outlined"
						className="cancel-button"
						onClick={onClose}
						sx={{
							textTransform: "none",
							fontSize: "14px",
							color: "#d0bcfe",
							padding: "6px 16px",
							borderRadius: "40px",
							border: "1px solid #938f99",
							marginRight: "10px",
							"&:hover": {
								backgroundColor: "rgba(163, 133, 242, 0.2)",
							},
							"&.Mui-selected": {
								backgroundColor: "#d0bcfe",
								color: "#381e72",
								fontWeight: 600,
							},
						}}
					>
						Cancel
					</Button>
					<Button
						variant="outlined"
						className="submit-button"
						onClick={() => {
							if (uploadedImage) {
								onSubmit();
							} else {
								alert(
									"Please upload an image before submitting!",
								);
							}
						}}
						sx={{
							textTransform: "none",
							fontSize: "14px",
							color: "#381E72",
							padding: "6px 16px",
							borderRadius: "40px",
							border: "1px solid #938f99",
							backgroundColor: "#d4bcfc",
							"&:hover": {
								backgroundColor: "rgba(163, 133, 242, 0.2)",
								color: "#d4bcfc",
							},
							"&.Mui-selected": {
								backgroundColor: "#d0bcfe",
								color: "#381e72",
								fontWeight: 600,
							},
						}}
					>
						Submit
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SubmitMemorModal;
