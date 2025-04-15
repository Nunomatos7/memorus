import { Box, Typography, Link, Container } from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../assets/images/logoAdmin.svg";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#111315",
  color: "#ffffff",
  padding: "20px 0",
  borderTop: "1px solid #444444",
  width: "100%",
  marginTop: "auto",
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
  color: "#82d5c7",
  textDecoration: "none",
  fontSize: "14px",
  "&:hover": {
    color: "#ffffff",
    textDecoration: "underline",
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer component="footer">
      <FooterContent maxWidth="lg">
        <FooterSection>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="Memor'us Logo"
              sx={{
                height: "20px",
                display: "block",
                marginBottom: "0.4rem",
              }}
            />
          </Box>

          <Typography
            variant="body2"
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
          <StyledLink href="#">Privacy Policy</StyledLink>
          <StyledLink href="#">Terms of Service</StyledLink>
          <StyledLink href="#">Contact Us</StyledLink>
          <StyledLink href="#">Support</StyledLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
