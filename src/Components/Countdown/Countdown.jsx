import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import PropTypes from "prop-types";

const dropAnimation = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
`;

const appearAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const PaperSheetUser = styled(Box)(({ theme, animateDrop, animateAppear }) => ({
  width: 120,
  height: 100,
  backgroundColor: "#5547bf",
  borderRadius: "8px",
  margin: "0 12px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  animation: `${animateDrop ? dropAnimation : animateAppear ? appearAnimation : ""} 0.5s ease-out forwards`,
}));

const PaperSheetAdmin = styled(Box)(
  ({ theme, animateDrop, animateAppear }) => ({
    width: 120,
    height: 100,
    backgroundColor: "#215952",
    borderRadius: "8px",
    margin: "0 12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    animation: `${animateDrop ? dropAnimation : animateAppear ? appearAnimation : ""} 0.5s ease-out forwards`,
  })
);

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.75rem",
  color: "#ffffff",
});

const Countdown = ({ endDate, role }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));
  const [lastTimeLeft, setLastTimeLeft] = useState(timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setLastTimeLeft(timeLeft);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, timeLeft]);

  return (
    <Box display="flex" justifyContent="center" marginTop={2}>
      {Object.keys(timeLeft).map((interval) => (
        <React.Fragment key={interval}>
          {role === "user" ? (
            <PaperSheetUser
              animateDrop={
                interval !== "seconds" &&
                timeLeft[interval] !== lastTimeLeft[interval]
              }
              animateAppear={
                interval === "seconds" ||
                timeLeft[interval] === lastTimeLeft[interval]
              }
            >
              <StyledTypography>{timeLeft[interval]}</StyledTypography>
              <Typography variant="caption" style={{ marginTop: "5px" }}>
                {interval.toUpperCase()}
              </Typography>
            </PaperSheetUser>
          ) : (
            <PaperSheetAdmin
              animateDrop={
                interval !== "seconds" &&
                timeLeft[interval] !== lastTimeLeft[interval]
              }
              animateAppear={
                interval === "seconds" ||
                timeLeft[interval] === lastTimeLeft[interval]
              }
            >
              <StyledTypography>{timeLeft[interval]}</StyledTypography>
              <Typography variant="caption" style={{ marginTop: "5px" }}>
                {interval.toUpperCase()}
              </Typography>
            </PaperSheetAdmin>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

function calculateTimeLeft(endDate) {
  const now = new Date();
  const targetDate = new Date(endDate);
  const difference = targetDate - now;
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

Countdown.propTypes = {
  endDate: PropTypes.string.isRequired,
};

export default Countdown;
