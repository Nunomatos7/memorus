import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsentModal.css";
import Proptypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import TermsModal from "../TermsModal/TermsModal";
import { Link } from "@mui/material";

const ConsentModal = ({ setUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("terms");
  const navigate = useNavigate();
  const { setCookiesAccepted, token, user } = useAuth();

  useEffect(() => {
    const cookiesAccepted = document.cookie.includes("cookiesAccepted=true");

    if (!cookiesAccepted) {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  }, []);

  const handleCookieAction = async (accept) => {
    if (accept) {
      // Set cookie for immediate UI update
      document.cookie =
        "cookiesAccepted=true; expires=" +
        new Date(
          new Date().getTime() + 365 * 24 * 60 * 60 * 1000
        ).toUTCString() +
        "; path=/;";
      setCookiesAccepted(true);

      // If user is logged in, save to database too
      if (user && token) {
        try {
          await saveTermsAcceptance(token, user.tenant_subdomain, "cookies");
        } catch (error) {
          console.error("Error saving cookie acceptance to database:", error);
          // Continue anyway as we've set the cookie locally
        }
      }
    } else {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/app/login");
    }

    setIsOpen(false);
    setIsExit(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  const openTermsModal = (tab) => {
    setInitialTab(tab);
    setTermsModalOpen(true);
  };

  if (!isVisible) return null;

  return (
    <>
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
          <p style={{ fontSize: "12px", margin: "0 0 20px 0" }}>
            Read our{" "}
            <Link
              component='button'
              onClick={() => openTermsModal("terms")}
              sx={{
                color: "#d0bcfe",
                cursor: "pointer",
                fontSize: "12px",
                padding: "0 0 5px!important",
                textDecoration: "none",
              }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              component='button'
              onClick={() => openTermsModal("cookies")}
              sx={{
                color: "#d0bcfe",
                cursor: "pointer",
                fontSize: "12px",
                padding: "0 0 5px!important",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
          <div>
            <button
              className='decline'
              onClick={() => handleCookieAction(false)}
            >
              Decline
            </button>
            <button className='accept' onClick={() => handleCookieAction(true)}>
              Accept
            </button>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {termsModalOpen && (
        <TermsModal
          open={termsModalOpen}
          onClose={() => {
            setTermsModalOpen(false);
            // Ensure body overflow is restored
            setTimeout(() => {
              document.body.style.overflow = isVisible ? "hidden" : "auto";
            }, 0);
          }}
          initialTab={initialTab}
        />
      )}
    </>
  );
};

ConsentModal.propTypes = {
  setUser: Proptypes.func.isRequired,
};

export default ConsentModal;
