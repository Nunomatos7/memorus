import { useState, useEffect } from "react";
import "./WelcomeModal.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../assets/images/default_avatar.png";

const WelcomeModal = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const hasClickedBegin = localStorage.getItem("hasClickedBegin");
    if (!hasClickedBegin && user) {
      setIsVisible(true);
      fetchUserTeamData();
    }
  }, [user]);

  const fetchUserTeamData = async () => {
    try {
      // First, try to get team info from user object
      if (user?.team) {
        setTeamData(user.team);
        return;
      }

      // If user has teamsId, fetch specific team
      if (user?.teamsId) {
        const response = await api.get(`/api/teams/${user.teamsId}`);
        if (response.data) {
          setTeamData(response.data);
          return;
        }
      }

      // Fallback: fetch all teams and find the one the user belongs to
      const response = await api.get("/api/teams");
      if (response.data && response.data.length > 0) {
        // Try to find the team that contains this user
        const userTeam = response.data.find(
          (team) =>
            team.members?.some((member) => member.id === user?.id) ||
            team.id === user?.teamsId
        );

        if (userTeam) {
          setTeamData(userTeam);
        } else {
          // Last resort: use first team
          setTeamData(response.data[0]);
        }
      }
    } catch (error) {
      // If all API calls fail, try to use any team info from user object
      if (user?.team) {
        setTeamData(user.team);
      }
    }
  };

  const handleBeginClick = () => {
    localStorage.setItem("hasClickedBegin", "true");
    setIsVisible(false);
  };

  const getTeamName = () => {
    return teamData?.name || user?.team?.name || "Your Team";
  };

  const getTeamImage = () => {
    return teamData?.avatar || user?.team?.avatar || "default_avatar.png";
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
          Hello, <span className='user'>{user?.firstName || "dear user"}</span>!
          Welcome to Team&apos;s family!
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
            src={getTeamImage()}
            alt={getTeamName()}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #82D5C7",
            }}
          />
          <span>{getTeamName()}</span>
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
