import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsentModal.css";
import Proptypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

const ConsentModal = ({ setUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const navigate = useNavigate();
  const { setCookiesAccepted } = useAuth();

  useEffect(() => {
    const cookiesAccepted = document.cookie.includes("cookiesAccepted=true");

    if (!cookiesAccepted) {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  }, []);

  const handleCookieAction = (accept) => {
    if (accept) {
      document.cookie =
        "cookiesAccepted=true; expires=" +
        new Date(
          new Date().getTime() + 365 * 24 * 60 * 60 * 1000
        ).toUTCString() +
        "; path=/;";
      setCookiesAccepted(true);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }

    setIsOpen(false);
    setIsExit(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className={`cookie-consent-overlay ${isOpen ? "open" : ""}`}>
      <div
        className={`modal-content ${isOpen ? "open" : ""} ${
          isExit ? "exit" : ""
        }`}
      >
        <h2>We use cookies</h2>
        <p>
          Our website uses cookies to enhance your experience to manage
          information stored in your browser. We don&apos;t share any
          information with third-parties. All data is of responsible use of
          Memor&apos;us, LTD and your tenant.
          <br />
          By continuing to use our site, you accept our use of cookies.
        </p>
        <div>
          <button className='decline' onClick={() => handleCookieAction(false)}>
            Decline
          </button>
          <button className='accept' onClick={() => handleCookieAction(true)}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

ConsentModal.propTypes = {
  setUser: Proptypes.func.isRequired,
};

export default ConsentModal;
