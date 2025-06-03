import { Box, Button } from "@mui/material";
import PropTypes from 'prop-types';

const CustomButton = ({ text, onClick, sx, icon }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "10px 20px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#B5EDE4",
        color: "#000",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#A3DFD8",
        },
        ...sx,
      }}
    >
      {icon && <Box component="span">{icon}</Box>}
      {text}
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  sx: PropTypes.object,
  icon: PropTypes.element,
};

export default CustomButton;
