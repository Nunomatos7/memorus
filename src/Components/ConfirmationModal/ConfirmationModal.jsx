import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import CustomButton from "../CustomButton/CustomButton";
import img1 from "../../assets/images/confirmationModalBack1.svg";
import img2 from "../../assets/images/confirmationModalBack2.svg";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  action,
  context,
  itemName,
  teamName,
}) => {
  let message = "";
  if (context === "team") {
    if (action === "delete") {
      message = (
        <>
          Are you sure you want to delete the team{" "}
          <span style={{ color: "#1E928A" }}>{itemName}</span>?
        </>
      );
    } else {
      message = (
        <>
          Are you sure you want to {action}{" "}
          <span style={{ color: "#1E928A" }}>{itemName}</span>{" "}
          {action === "remove" ? "from" : "to"} the team{" "}
          <span style={{ color: "#1E928A" }}>{teamName}</span>?
        </>
      );
    }
  } else if (context === "memor") {
    message = (
      <>
        Are you sure you want to delete the memor{" "}
        <span style={{ color: "#1E928A" }}>{itemName}</span>?
      </>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{ onClick: (e) => e.stopPropagation() }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: "23.635px",
          background: "#232627",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          <img
            src={img1}
            alt="background"
            style={{
              position: "absolute",
              top: "15px",
              left: "0px",
              width: "29px",
              height: "31px",
            }}
          />
          <img
            src={img2}
            alt="background"
            style={{
              position: "absolute",
              top: "45px",
              left: "0px",
              width: "119px",
              height: "102px",
            }}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Are you sure?
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <CustomButton
            text="Cancel"
            onClick={onClose}
            sx={{
              backgroundColor: "transparent",
              border: "1px solid #B5EDE4",
              color: "#B5EDE4",
              borderRadius: "50px",
              "&:hover": {
                backgroundColor: "rgba(181, 237, 228, 0.08)",
              },
            }}
          />
          <CustomButton
            text="Confirm"
            onClick={onConfirm}
            sx={{
              borderRadius: "50px",
              "&:hover": {
                backgroundColor: "#80ccbc",
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
