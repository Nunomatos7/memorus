import { useState, useEffect } from "react";
import "./ConsentModal.css";

const ConsentModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExit, setIsExit] = useState(false);

  useEffect(() => {
    const cookiesAccepted = document.cookie.includes("cookiesAccepted=true");

    if (!cookiesAccepted) {
      // Use two-stage visibility to enable animations
      setIsVisible(true);
      // Small timeout to ensure CSS transition works
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
    }

    // Trigger fade-out
    setIsOpen(false);
    setIsExit(true);

    // Remove from DOM after animation
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
          Our website uses cookies to enhance your experience. By continuing to
          use our site, you accept our use of cookies.
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

export default ConsentModal;
