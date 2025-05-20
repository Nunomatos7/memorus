import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * Modal component for displaying Terms of Service and Cookie Policy
 *
 * @param {Object} props Component properties
 * @param {boolean} props.open Whether the modal is open
 * @param {Function} props.onClose Function to call when modal is closed
 * @param {string} props.initialTab Which tab should be active on open ('terms' or 'cookies')
 */
const TermsModal = ({ open, onClose, initialTab = "terms" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canAccept, setCanAccept] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    // Reset scroll position and acceptance status when tab changes
    setScrollPosition(0);
    setCanAccept(false);
  }, [activeTab]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Calculate how far user has scrolled (as a percentage)
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollPosition(scrollPercentage);

    // Enable accept button when scrolled at least 70% through the content
    if (scrollPercentage > 70 && !canAccept) {
      setCanAccept(true);
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccept = () => {
    // Set a cookie or localStorage item to remember user accepted
    localStorage.setItem("termsAccepted", "true");
    localStorage.setItem("cookiesAccepted", "true");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='terms-modal-title'
      aria-describedby='terms-modal-description'
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
          maxWidth: "800px",
          maxHeight: "90vh",
          bgcolor: "#1E1F20",
          border: "1px solid #333738",
          borderRadius: "16px",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          height: "80vh", // Set a fixed height
        }}
      >
        {/* Header with title and close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            px: 3,
            backgroundColor: "#232627",
            borderBottom: "1px solid #333738",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={onClose}
              sx={{ color: "#CAC4D0", mr: 1 }}
              aria-label='Back'
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              id='terms-modal-title'
              variant='h6'
              component='h2'
              color='white'
            >
              Legal Policies
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: "#CAC4D0" }}
            aria-label='Close'
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs for Terms and Cookie Policy */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "#333738",
            backgroundColor: "#232627",
            "& .MuiTabs-indicator": {
              backgroundColor: "#d0bcfe",
              height: "3px",
            },
            "& .MuiTab-root": {
              color: "#CAC4D0",
              fontWeight: "bold",
              fontSize: "14px",
              padding: "12px 16px",
              "&.Mui-selected": {
                color: "#d0bcfe",
              },
            },
          }}
        >
          <Tab
            label='Terms of Service'
            value='terms'
            id='terms-tab'
            aria-controls='terms-panel'
          />
          <Tab
            label='Cookie Policy'
            value='cookies'
            id='cookies-tab'
            aria-controls='cookies-panel'
          />
        </Tabs>

        {/* Content area with scrolling */}
        <Box
          sx={{
            p: 3,
            overflowY: "auto",
            flex: 1,
            height: "400px", // Set a fixed height to ensure content is shown
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#1e1e1e",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#444",
              borderRadius: "10px",
              "&:hover": {
                background: "#555",
              },
            },
          }}
          onScroll={handleScroll}
          role='tabpanel'
          id={`${activeTab}-panel`}
          aria-labelledby={`${activeTab}-tab`}
        >
          {activeTab === "terms" ? (
            <TermsOfServiceContent />
          ) : (
            <CookiePolicyContent />
          )}
        </Box>

        {/* Footer with buttons */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #333738",
            backgroundColor: "#232627",
            minHeight: "64px", // Set minimum height
          }}
        >
          <Typography variant='caption' color='#999'>
            {scrollPosition < 70 && !canAccept
              ? "Please scroll to read the full document"
              : "Thank you for reviewing our policies"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={onClose}
              sx={{
                color: "#d0bcfe",
                borderColor: "#d0bcfe",
                "&:hover": {
                  borderColor: "#b39ddb",
                  backgroundColor: "rgba(208, 188, 254, 0.08)",
                },
              }}
              variant='outlined'
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!canAccept}
              sx={{
                backgroundColor: "#d0bcfe",
                color: "#381e72",
                "&:hover": {
                  backgroundColor: "#b39ddb",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#4a4a4a",
                  color: "#999",
                },
              }}
              variant='contained'
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// Terms of Service Content Component
const TermsOfServiceContent = () => (
  <Box sx={{ color: "white", textAlign: "left" }}>
    <Typography variant='h5' sx={{ color: "white", mb: 2 }}>
      Terms of Service
    </Typography>
    <Typography variant='subtitle1' sx={{ color: "#d0bcfe", mb: 2 }}>
      Last Updated: May 20, 2025
    </Typography>
    <Typography variant='body1' sx={{ color: "white", mb: 3 }}>
      Please read these Terms of Service ("Terms") carefully before using the
      Memor'us platform operated by Memor'us Ltd.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      1. Acceptance of Terms
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      By accessing or using our service, you agree to be bound by these Terms.
      If you disagree with any part of the terms, you may not access the
      service.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      2. Use License
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Permission is granted to temporarily use the Memor'us platform for
      personal, non-commercial transitory viewing only. This is the grant of a
      license, not a transfer of title, and under this license you may not:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>modify or copy the materials;</li>
      <li>use the materials for any commercial purpose;</li>
      <li>
        attempt to decompile or reverse engineer any software contained on the
        platform;
      </li>
      <li>
        remove any copyright or other proprietary notations from the materials;
      </li>
      <li>
        transfer the materials to another person or "mirror" the materials on
        any other server.
      </li>
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      3. User Accounts
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      When you create an account with us, you must provide information that is
      accurate, complete, and current at all times. Failure to do so constitutes
      a breach of the Terms, which may result in immediate termination of your
      account on our service.
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      You are responsible for safeguarding the password that you use to access
      the service and for any activities or actions under your password. You
      agree not to disclose your password to any third party.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      4. Content Ownership
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      The Memor'us platform allows you to post, link, store, share and otherwise
      make available certain information, text, graphics, videos, or other
      material. You retain any and all of your rights to any Content you submit,
      post or display on or through the Service and you are responsible for
      protecting those rights.
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      By posting Content, you grant us the right and license to use, modify,
      perform, display, reproduce, and distribute such Content on and through
      the Service.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      5. Prohibited Uses
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      You may use the platform only for lawful purposes and in accordance with
      these Terms. You agree not to use the platform:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>
        In any way that violates any applicable national or international law or
        regulation.
      </li>
      <li>
        To transmit, or procure the sending of, any advertising or promotional
        material, including any "junk mail", "chain letter" or "spam".
      </li>
      <li>
        To impersonate or attempt to impersonate the platform, a platform
        employee, another user, or any other person or entity.
      </li>
      <li>
        To engage in any other conduct that restricts or inhibits anyone's use
        or enjoyment of the platform, or which may harm or offend.
      </li>
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      6. Termination
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      We may terminate or suspend your account immediately, without prior notice
      or liability, for any reason whatsoever, including without limitation if
      you breach the Terms. Upon termination, your right to use the service will
      immediately cease.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      7. Limitation of Liability
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      In no event shall Memor'us Ltd, nor its directors, employees, partners,
      agents, suppliers, or affiliates, be liable for any indirect, incidental,
      special, consequential or punitive damages, including without limitation,
      loss of profits, data, use, goodwill, or other intangible losses,
      resulting from your access to or use of or inability to access or use the
      service.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      8. Governing Law
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      These Terms shall be governed and construed in accordance with the laws of
      the European Union, without regard to its conflict of law provisions.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      9. Changes to Terms
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
      We reserve the right, at our sole discretion, to modify or replace these
      Terms at any time. If a revision is material we will try to provide at
      least 30 days' notice prior to any new terms taking effect. What
      constitutes a material change will be determined at our sole discretion.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      10. Contact Us
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 4 }}>
      If you have any questions about these Terms, please contact us at{" "}
      <Link href='mailto:legal@memor-us.com' sx={{ color: "#d0bcfe" }}>
        legal@memor-us.com
      </Link>
    </Typography>
  </Box>
);

// Cookie Policy Content Component
const CookiePolicyContent = () => (
  <Box sx={{ color: "white", textAlign: "left" }}>
    <Typography variant='h5' sx={{ color: "white", mb: 2 }}>
      Cookie Policy
    </Typography>
    <Typography variant='subtitle1' sx={{ color: "#d0bcfe", mb: 2 }}>
      Last Updated: May 20, 2025
    </Typography>
    <Typography variant='body1' sx={{ color: "white", mb: 3 }}>
      This Cookie Policy explains how Memor'us Ltd ("we", "us", or "our") uses
      cookies and similar technologies to recognize you when you visit our
      website and application.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      1. What are cookies?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Cookies are small data files that are placed on your computer or mobile
      device when you visit a website. Cookies are widely used by website owners
      to make their websites work, or to work more efficiently, as well as to
      provide reporting information.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Cookies set by us are called "first-party cookies". Cookies set by parties
      other than us are called "third-party cookies". Third-party cookies enable
      third-party features or functionality to be provided on or through the
      website (e.g., advertising, interactive content, and analytics).
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      2. Why do we use cookies?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      We use first-party and third-party cookies for several reasons. Some
      cookies are required for technical reasons in order for our platform to
      operate, and we refer to these as "essential" or "strictly necessary"
      cookies.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Other cookies also enable us to track and target the interests of our
      users to enhance the experience on our platform. Third parties may serve
      cookies through our platform for analytics and other purposes.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      3. Types of cookies we use
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 1 }}>
      The specific types of cookies served through our platform and the purposes
      they perform include:
    </Typography>
    <Typography sx={{ color: "#e0e0e0", mb: 0.5, fontWeight: "bold" }}>
      3.1 Essential cookies:
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 1, pl: 2 }}>
      These cookies are strictly necessary to provide you with services
      available through our platform and to use some of its features, such as
      access to secure areas. These cookies include session cookies, which are
      temporary cookies that are erased when you close your browser.
    </Typography>

    <Typography sx={{ color: "#e0e0e0", mb: 0.5, fontWeight: "bold" }}>
      3.2 Functional cookies:
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 1, pl: 2 }}>
      These cookies allow us to remember choices you make when you use our
      platform, such as remembering your login details or language preference.
      The purpose of these cookies is to provide you with a more personal
      experience and to avoid you having to re-enter your preferences every time
      you visit our platform.
    </Typography>

    <Typography sx={{ color: "#e0e0e0", mb: 0.5, fontWeight: "bold" }}>
      3.3 Analytics cookies:
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2, pl: 2 }}>
      These cookies collect information that is used either in aggregate form to
      help us understand how our platform is being used or how effective our
      marketing campaigns are, or to help us customize our platform for you.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      4. How can you control cookies?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      You have the right to decide whether to accept or reject cookies. You can
      exercise your cookie rights by setting your preferences in the Cookie
      Consent Manager. The Cookie Consent Manager allows you to select which
      categories of cookies you accept or reject.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Essential cookies cannot be rejected as they are strictly necessary to
      provide you with services. If you choose to reject cookies, you may still
      use our platform though your access to some functionality and areas may be
      restricted.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      You may also set or amend your web browser controls to accept or refuse
      cookies. Most web browsers automatically accept cookies, but you can
      usually modify your browser setting to decline cookies if you prefer.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      5. How often will we update this Cookie Policy?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      We may update this Cookie Policy from time to time in order to reflect,
      for example, changes to the cookies we use or for other operational,
      legal, or regulatory reasons. Please therefore re-visit this Cookie Policy
      regularly to stay informed about our use of cookies and related
      technologies.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      The date at the top of this Cookie Policy indicates when it was last
      updated.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      6. Where can you get further information?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 4 }}>
      If you have any questions about our use of cookies or other technologies,
      please contact us at{" "}
      <Link href='mailto:privacy@memor-us.com' sx={{ color: "#d0bcfe" }}>
        privacy@memor-us.com
      </Link>
    </Typography>
  </Box>
);

TermsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(["terms", "cookies"]),
};

export default TermsModal;
