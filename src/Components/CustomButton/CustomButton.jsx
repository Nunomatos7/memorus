import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ text, onClose, onClick, sx }) => {
  return (
    <Button
      variant="outlined"
      className="cancel-button"
      onClick={onClick || onClose}
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
        ...sx,
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
