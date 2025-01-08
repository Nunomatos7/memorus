import { useState, useEffect } from "react";
import "./WelcomeModal.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasClickedBegin = localStorage.getItem("hasClickedBegin");
    if (!hasClickedBegin) {
      setIsVisible(true);
    }
  }, []);

  const handleBeginClick = () => {
    localStorage.setItem("hasClickedBegin", "true");
    setIsVisible(false);
  };

  const BeginButton = styled(Button)({
    color: "#381E72",
    backgroundColor: "#D0BCFF",
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    fontSize: "0.8rem",
    fontStyle: "normal",
    fontWeight: 500,
    borderRadius: "28px",
    padding: "10px 20px",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#C4AFFF",
      boxShadow: "none",
    },
    "&:focus": {
      outline: "none",
    },
  });

  if (!isVisible) return null;

  return (
    <div className='modal-back'>
      <div className='welcome-modal'>
        <div style={{ textAlign: "center" }}>
          <h1 className='modal-title'>Welcome to Memor&apos;us</h1>
          <p style={{ fontSize: "40px", margin: "0px" }}>🎉</p>
        </div>
        <p>
          Hello, <span className='user'>dear user</span>! Welcome to Team&apos;s
          family!
        </p>
        <p className='mt-4'>
          We believe that teamwork makes the dream work. Together, we&apos;ll
          conquer challenges, share laughs, and build memories that last a
          lifetime.
        </p>
        <p>
          But first of all, to start your journey,&nbsp;
          <span className='user'>here&apos;s your team:</span>
        </p>
        <div className='team'>
          <img
            className='team-image'
            src='https://media.istockphoto.com/id/2177790198/pt/foto/group-of-young-multi-ethnic-startup-business-team-collaborating-on-project-in-modern-office.jpg?s=2048x2048&w=is&k=20&c=d2l8WTbB8dPYIaybpizLbH-ZFj5moLpM9DHV9vFNG6Q='
            alt='team'
          />
          <span>The Debuggers</span>
        </div>
        <div className='text-right'>
          <BeginButton variant='contained' onClick={handleBeginClick}>
            Let&apos;s Begin
          </BeginButton>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
