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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";

/**
 * Modal component for displaying Terms of Service and Privacy Policy
 *
 * @param {Object} props Component properties
 * @param {boolean} props.open Whether the modal is open
 * @param {Function} props.onClose Function to call when modal is closed
 * @param {string} props.initialTab Which tab should be active on open ('terms' or 'cookies')
 */
const TermsModal = ({ open, onClose, initialTab = "terms" }) => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canAccept, setCanAccept] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAccepted, setHasAccepted] = useState({
    terms: false,
    cookies: false,
  });
  // Additional useEffect to ensure body overflow is restored when component unmounts
  useEffect(() => {
    return () => {
      // Final cleanup - ensure overflow is restored when component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  // Check if user has already accepted terms
  useEffect(() => {
    if (open && token && user) {
      const checkAcceptance = async () => {
        try {
          // Try to fetch from database first
          const acceptanceStatus = await checkTermsAcceptance(
            token,
            user.tenant_subdomain
          );
          setHasAccepted({
            terms: acceptanceStatus.termsAccepted,
            cookies: acceptanceStatus.cookiesAccepted,
          });
        } catch (error) {
          // Fallback to React state if API fails
          setHasAccepted({
            terms: false,
            cookies: false,
          });
        }
      };

      checkAcceptance();
    }
  }, [open, token, user]);

  useEffect(() => {
    // Handle body overflow when modal opens/closes
    if (open) {
      // Store the current overflow style
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Return cleanup function that will run when component unmounts or 'open' changes
      return () => {
        document.body.style.overflow = originalOverflow || "auto";
      };
    }

    // If modal is closed, ensure overflow is restored
    document.body.style.overflow = "auto";

    return () => {};
  }, [open]);

  useEffect(() => {
    // Reset scroll position and acceptance status when tab changes
    setScrollPosition(0);
    setCanAccept(hasAccepted[activeTab] || false);
  }, [activeTab, hasAccepted]);

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

  const handleAccept = async () => {
    if (!token || !user) {
      // Store acceptance in component state since localStorage is not supported
      setHasAccepted((prev) => ({
        ...prev,
        [activeTab]: true,
      }));
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      await saveTermsAcceptance(
        token,
        user.tenant_subdomain,
        activeTab === "terms" ? "terms" : "cookies"
      );

      // Update local state
      setHasAccepted((prev) => ({
        ...prev,
        [activeTab]: true,
      }));

      onClose();
    } catch (error) {
      console.error("Failed to save acceptance:", error);
      // Fallback to component state
      setHasAccepted((prev) => ({
        ...prev,
        [activeTab]: true,
      }));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Tabs for Terms and Privacy Policy */}
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
            label='Privacy Policy'
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
            <PrivacyPolicyContent />
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
              onClick={handleAccept}
              disabled={!canAccept || isSubmitting}
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
                minWidth: "100px",
              }}
              variant='contained'
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "#381e72" }} />
              ) : (
                "I understand"
              )}
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
      Legal Terms
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
      You can contact us by email at{" "}
      <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
        geral@memor-us.com
      </Link>{" "}
      or by mail to Universidade de Aveiro, Aveiro 3810-193, Portugal.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
      These Legal Terms constitute a legally binding agreement made between you,
      whether personally or on behalf of an entity ("you"), and Memor'us,
      concerning your access to and use of the Services. You agree that by
      accessing the Services, you have read, understood, and agreed to be bound
      by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL
      TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU
      MUST DISCONTINUE USE IMMEDIATELY.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
      We will provide you with prior notice of any scheduled changes to the
      Services you are using. The modified Legal Terms will become effective
      upon posting or notifying you by{" "}
      <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
        geral@memor-us.com
      </Link>
      , as stated in the email message. By continuing to use the Services after
      the effective date of any changes, you agree to be bound by the modified
      terms.
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
      The Services are intended for users who are at least 18 years old. Persons
      under the age of 18 are not permitted to use or register for the Services.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      1. OUR SERVICES
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      The information provided when using the Services is not intended for
      distribution to or use by any person or entity in any jurisdiction or
      country where such distribution or use would be contrary to law or
      regulation or which would subject us to any registration requirement
      within such jurisdiction or country.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      2. INTELLECTUAL PROPERTY RIGHTS
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      We are the owner or the licensee of all intellectual property rights in
      our Services, including all source code, databases, functionality,
      software, website designs, audio, video, text, photographs, and graphics
      in the Services (collectively, the "Content"), as well as the trademarks,
      service marks, and logos contained therein (the "Marks").
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      3. USER REPRESENTATIONS
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      By using the Services, you represent and warrant that: (1) all
      registration information you submit will be true, accurate, current, and
      complete; (2) you will maintain the accuracy of such information and
      promptly update such registration information as necessary; (3) you have
      the legal capacity and you agree to comply with these Legal Terms.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      4. PROHIBITED ACTIVITIES
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      You may not access or use the Services for any purpose other than that for
      which we make the Services available. As a user of the Services, you agree
      not to:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>Systematically retrieve data or other content from the Services</li>
      <li>Trick, defraud, or mislead us and other users</li>
      <li>
        Use any information obtained from the Services to harass, abuse, or harm
        another person
      </li>
      <li>
        Use the Services in a manner inconsistent with any applicable laws or
        regulations
      </li>
      <li>
        Post or share content that is abusive, discriminatory, threatening,
        pornographic, or offensive
      </li>
      <li>Advocate or promote violence, terrorism, or hate speech</li>
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      5. SUBSCRIPTIONS
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Your subscription will continue and automatically renew unless canceled.
      We offer a 30-day free trial to new users who register with the Services.
      You can cancel your subscription at any time by contacting us at{" "}
      <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
        geral@memor-us.com
      </Link>
      .
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      6. TERMINATION
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      We may terminate or suspend your account immediately, without prior notice
      or liability, for any reason whatsoever, including without limitation if
      you breach the Terms. Upon termination, your right to use the service will
      immediately cease.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      7. GOVERNING LAW
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      These Legal Terms are governed by and interpreted following the laws of
      Portugal. Memor'us and yourself both agree to submit to the non-exclusive
      jurisdiction of the courts of Aveiro, Portugal.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      8. CONTACT US
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 4 }}>
      In order to resolve a complaint regarding the Services or to receive
      further information regarding use of the Services, please contact us at:
      <br />
      <br />
      Memor'us
      <br />
      Universidade de Aveiro
      <br />
      Aveiro 3810-193
      <br />
      Portugal
      <br />
      <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
        geral@memor-us.com
      </Link>
    </Typography>
  </Box>
);

// Privacy Policy Content Component (replacing Privacy Policy)
const PrivacyPolicyContent = () => (
  <Box sx={{ color: "white", textAlign: "left" }}>
    <Typography variant='h5' sx={{ color: "white", mb: 2 }}>
      Privacy Policy
    </Typography>
    <Typography variant='body1' sx={{ color: "white", mb: 3 }}>
      This privacy policy will explain how our organization uses the personal
      data we collect from you when you use our website.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      What data do we collect?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 1 }}>
      Memor'us collects the following data:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>Personal identification information</li>
      <li>Name</li>
      <li>Email Address</li>
      <li>Password</li>
      <li>Auth Cookies</li>
      <li>Images Shared By Collaborators</li>
      <li>Profile Pictures</li>
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      How do we collect your data?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Users will have to put their First and Last name upon their account
      creation. The user's first and last name are used to identify the account
      owner. Upon registration the email address used for platform access: This
      is the method by which users are able to log in to the platform.
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Authentication Cookies: These are used to keep the user's session active.
      When Images are shared by collaborators: Users need to upload photographs
      to complete challenges, and sometimes individuals can be identified in
      these photos.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      How will we use your data?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Memor'us collects your data so that we can:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>Identify the account owner using first and last name</li>
      <li>Enable users to log in to the platform using their email address</li>
      <li>Keep user sessions active through authentication cookies</li>
      <li>Allow users to upload photographs to complete challenges</li>
      <li>Enable users to personalize their accounts with profile photos</li>
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      How do we store your data?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Memor'us securely stores your personal data at the following locations:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>
        Cookies are stored in the user's browser and are protected by browser
        security mechanisms
      </li>
      <li>
        First and last name and email address are stored in our secure company
        database, which is protected by encryption and access controls
      </li>
      <li>
        Photographs are hosted on AWS S3, a secure cloud storage server with
        restricted access and encrypted transfer protocols
      </li>
      <li>
        Passwords are processed in encrypted form; Memor'us does not have access
        to their content
      </li>
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Memor'us will keep your personal data for as long as your account is
      active or as required to provide you with services. If you choose to
      delete your account, we implement a soft delete process: your account
      becomes inaccessible and is partially deleted, but the data remains stored
      in our database for 30 days in case recovery is needed. After this 30-day
      period, your data will be permanently deleted.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      Marketing
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
      Memor'us does not use your personal data for marketing purposes and will
      not send you information about products or services, nor will we share
      your data with partner companies for marketing. You will not receive
      marketing communications from us, and your data will not be provided to
      any third parties for marketing purposes.
    </Typography>

    <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 1 }}>
      What are your data protection rights?
    </Typography>
    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 1 }}>
      Every user is entitled to the following:
    </Typography>
    <Typography component='ul' sx={{ color: "#e0e0e0", mb: 2, pl: 4 }}>
      <li>
        The right to access – You have the right to request Memor'us for copies
        of your personal data
      </li>
      <li>
        The right to rectification – You have the right to request that Memor'us
        corrects any information you believe is inaccurate
      </li>
      <li>
        The right to erasure – You have the right to request that Memor'us
        erases your personal data, under certain conditions
      </li>
      <li>
        The right to restrict processing – You have the right to request that
        Memor'us restricts the processing of your personal data
      </li>
      <li>
        The right to object to processing – You have the right to object to
        Memor'us' processing of your personal data
      </li>
      <li>
        The right to data portability – You have the right to request that
        Memor'us transfers the data to another organization
      </li>
    </Typography>

    <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 4 }}>
      If you make a request, we have one month to respond to you. If you would
      like to exercise any of these rights, please contact us at our email:{" "}
      <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
        geral@memor-us.com
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
