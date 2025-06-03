import { useState } from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../assets/images/logo.svg";
import TermsModal from "../TermsModal/TermsModal";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#111315",
  color: "#ffffff",
  padding: "20px 0",
  borderTop: "1px solid #444444",
  width: "100%",
  marginTop: "auto",
  zIndex: 1000,
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    gap: "1rem",
  },
}));

const FooterLinks = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  justifyContent: "center",
  textAlign: "center",
  [theme.breakpoints.up("sm")]: {
    justifyContent: "flex-end",
    textAlign: "right",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#d0bcfe",
  textDecoration: "none",
  fontSize: "14px",
  "&:hover": {
    color: "#ffffff",
    textDecoration: "underline",
  },
}));

const Footer = () => {
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("terms");
  const currentYear = new Date().getFullYear();

  const openTermsModal = (tab) => {
    setInitialTab(tab);
    setTermsModalOpen(true);
  };

  return (
    <FooterContainer component='footer'>
      <FooterContent maxWidth='lg'>
        <FooterSection>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component='img'
              src={logo}
              alt="Memor'us Logo"
              sx={{
                height: "30px",
                display: "block",
              }}
            />
            <Typography
              variant='body1'
              sx={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "#5840b4" }}>Memor&apos;</span>
              <span style={{ color: "#d0bcfe" }}>us</span>
            </Typography>
          </Box>

          <Typography
            variant='body2'
            sx={{
              fontSize: "12px",
              color: "white",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
              textAlign: "center",
              marginTop: "0.1rem",
            }}
          >
            © {currentYear} Memor&apos;us Ltd. All rights reserved.
          </Typography>
        </FooterSection>

        <FooterLinks>
          <StyledLink
            component='button'
            onClick={() => openTermsModal("terms")}
            sx={{ cursor: "pointer" }}
          >
            Terms of Service
          </StyledLink>
          <StyledLink
            component='button'
            onClick={() => openTermsModal("cookies")}
            sx={{ cursor: "pointer" }}
          >
            Privacy Policy
          </StyledLink>
          <StyledLink href='mailto:geral@memor-us.com'>Contact Us</StyledLink>
        </FooterLinks>
      </FooterContent>

      {/* Terms Modal */}
      {termsModalOpen && (
        <TermsModal
          open={termsModalOpen}
          onClose={() => {
            setTermsModalOpen(false);
            // Ensure body overflow is restored
            setTimeout(() => {
              document.body.style.overflow = "auto";
            }, 0);
          }}
          initialTab={initialTab}
        />
      )}
    </FooterContainer>
  );
};

export default Footer;
