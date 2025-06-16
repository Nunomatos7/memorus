import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeSection, setActiveSection] = useState("agreement");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  const termsOfServiceSections = [
    { id: "agreement", title: "Agreement to Our Legal Terms", number: "" },
    { id: "our-services", title: "Our Services", number: "1" },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      number: "2",
    },
    { id: "user-representations", title: "User Representations", number: "3" },
    { id: "user-registration", title: "User Registration", number: "4" },
    { id: "subscriptions", title: "Subscriptions", number: "5" },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      number: "6",
    },
    {
      id: "user-contributions",
      title: "User Generated Contributions",
      number: "7",
    },
    { id: "contribution-license", title: "Contribution License", number: "8" },
    { id: "services-management", title: "Services Management", number: "9" },
    { id: "privacy-policy-ref", title: "Privacy Policy", number: "10" },
    {
      id: "copyright-infringements",
      title: "Copyright Infringements",
      number: "11",
    },
    { id: "term-termination", title: "Term and Termination", number: "12" },
    {
      id: "modifications-interruptions",
      title: "Modifications and Interruptions",
      number: "13",
    },
    { id: "governing-law", title: "Governing Law", number: "14" },
    { id: "dispute-resolution", title: "Dispute Resolution", number: "15" },
    { id: "corrections", title: "Corrections", number: "16" },
    { id: "disclaimer", title: "Disclaimer", number: "17" },
    {
      id: "limitations-liability",
      title: "Limitations of Liability",
      number: "18",
    },
    { id: "indemnification", title: "Indemnification", number: "19" },
    { id: "user-data", title: "User Data", number: "20" },
    {
      id: "electronic-communications",
      title: "Electronic Communications",
      number: "21",
    },
    { id: "miscellaneous", title: "Miscellaneous", number: "22" },
    { id: "contact-us", title: "Contact Us", number: "23" },
  ];

  const detectActiveSection = (scrollTop) => {
    const sections = termsOfServiceSections;
    let currentSection = sections[0].id;
    const offset = 150;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const element = sectionRefs.current[section.id];

      if (element) {
        const elementTop = element.offsetTop - offset;
        if (scrollTop >= elementTop) {
          currentSection = section.id;
          break;
        }
      }
    }

    setActiveSection(currentSection);
  };

  // Navigate to specific section
  const navigateToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      setActiveSection(sectionId);

      const offset = 100;
      const elementTop = element.offsetTop - offset;

      contentRef.current.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });

      // Close mobile drawer after navigation
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  // Handle scroll and section detection
  const handleScroll = (e) => {
    const { scrollTop } = e.target;

    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      detectActiveSection(scrollTop);
    }, 50);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Table of Contents Component
  const TableOfContents = () => (
    <Box
      sx={{
        width: isMobile ? 280 : "100%",
        height: isMobile ? "100%" : "calc(87vh)",
        backgroundColor: "#232627",
        overflow: "auto",
        position: "sticky",
        maxHeight: "calc(100vh - 64px)",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#1e1e1e",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#444",
          borderRadius: "3px",
        },
      }}
    >
      <Typography
        variant='subtitle2'
        sx={{
          color: "#d0bcfe",
          p: 2,
          fontWeight: "bold",
          borderBottom: "1px solid #333738",
        }}
      >
        Table of Contents
      </Typography>
      <List dense sx={{ p: 0 }}>
        {termsOfServiceSections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              onClick={() => navigateToSection(section.id)}
              sx={{
                py: 1,
                px: 2,
                backgroundColor:
                  activeSection === section.id
                    ? "rgba(208, 188, 254, 0.1)"
                    : "transparent",
                borderLeft:
                  activeSection === section.id
                    ? "3px solid #d0bcfe"
                    : "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(208, 188, 254, 0.05)",
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant='body2'
                    sx={{
                      color:
                        activeSection === section.id ? "#d0bcfe" : "#CAC4D0",
                      fontSize: "13px",
                      fontWeight:
                        activeSection === section.id ? "bold" : "normal",
                    }}
                  >
                    {section.number && `${section.number}. `}
                    {section.title}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ height: "90vh", backgroundColor: "#1E1F20" }}>
      {/* Header */}
      <AppBar position='sticky' sx={{ backgroundColor: "#232627" }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' sx={{ flexGrow: 1, color: "white" }}>
            Terms and Conditions
          </Typography>
          {isMobile && (
            <IconButton
              color='inherit'
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Paper
            sx={{
              width: 300,
              backgroundColor: "#232627",
              borderRadius: 0,
              borderRight: "1px solid #333738",
            }}
            elevation={0}
          >
            <TableOfContents />
          </Paper>
        )}

        {/* Mobile Drawer */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              backgroundColor: "#232627",
              borderRight: "1px solid #333738",
            },
          }}
        >
          <TableOfContents />
        </Drawer>

        {/* Main Content */}
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            backgroundColor: "#1E1F20",
          }}
        >
          <Container
            maxWidth='lg'
            sx={{
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              ref={contentRef}
              sx={{
                maxHeight: "calc(95vh - 120px)",
                overflowY: "auto",
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
            >
              <TermsOfServiceContent sectionRefs={sectionRefs} />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

// Terms and Conditions Content Component - ESTRUTURA BASE
const TermsOfServiceContent = ({ sectionRefs }) => (
  <Box sx={{ color: "white", textAlign: "left" }}>
    {/* Agreement Section */}
    <Box ref={(el) => (sectionRefs.current["agreement"] = el)} sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{ color: "white", mb: 3, fontWeight: "bold" }}
      >
        TERMS AND CONDITIONS
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: "#e0e0e0", mb: 3, fontStyle: "italic" }}
      >
        Last updated June 3, 2025
      </Typography>

      <Typography variant='h5' sx={{ color: "#d0bcfe", mb: 2 }}>
        AGREEMENT TO OUR LEGAL TERMS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We are Memor&apos;us (&quot;<strong>Company</strong>,&quot; &quot;
        <strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; &quot;
        <strong>our</strong>&quot;), a company registered in Portugal at
        Universidade de Aveiro, Aveiro 3810-193.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We operate the website{" "}
        <Link href='http://www.memor-us.com/' sx={{ color: "#d0bcfe" }}>
          http://www.memor-us.com/
        </Link>{" "}
        (the &quot;<strong>Site</strong>&quot;), as well as any other related
        products and services that refer or link to these legal terms (the
        &quot;<strong>Legal Terms</strong>&quot;) (collectively, the &quot;
        <strong>Services</strong>&quot;).
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Memor&apos;us is an online platform that helps companies and
        organizations strengthen team culture by recording and sharing
        meaningful moments, promoting engagement and collaboration among team
        members. It will be available for computers, allowing users to access
        their teams, create and manage memors – photographic records of events
        or memorable moments – and interact with the content dynamically. The
        platform includes features such as team management, search, and memory
        filtering, ensuring a smooth and engaging experience for users. One of
        the central elements of Memor&apos;us is the Digital Memory Board, an
        interactive board where users can view in an organized way the memories
        created by the team. This space allows members to revisit past moments
        and track the evolution of team experiences over time, reinforcing
        collective identity and a sense of belonging.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You can contact us by email at{" "}
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          geral@memor-us.com
        </Link>{" "}
        or by mail to Universidade de Aveiro, Aveiro 3810-193, Portugal.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        These Legal Terms constitute a legally binding agreement made between
        you, whether personally or on behalf of an entity (&quot;
        <strong>you</strong>&quot;), and Memor&apos;us, concerning your access
        to and use of the Services. You agree that by accessing the Services,
        you have read, understood, and agreed to be bound by all of these Legal
        Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE
        EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE
        USE IMMEDIATELY.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We will provide you with prior notice of any scheduled changes to the
        Services you are using. The modified Legal Terms will become effective
        upon posting or notifying you by{" "}
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          geral@memor-us.com
        </Link>
        , as stated in the email message. By continuing to use the Services
        after the effective date of any changes, you agree to be bound by the
        modified terms.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The Services are intended for users who are at least 18 years old.
        Persons under the age of 18 are not permitted to use or register for the
        Services.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We recommend that you print a copy of these Legal Terms for your
        records.
      </Typography>
    </Box>

    {/* Section 1 - Our Services */}
    <Box
      ref={(el) => (sectionRefs.current["our-services"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        1. OUR SERVICES
      </Typography>
      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
        The information provided when using the Services is not intended for
        distribution to or use by any person or entity in any jurisdiction or
        country where such distribution or use would be contrary to law or
        regulation or which would subject us to any registration requirement
        within such jurisdiction or country. Accordingly, those persons who
        choose to access the Services from other locations do so on their own
        initiative and are solely responsible for compliance with local laws, if
        and to the extent local laws are applicable.
      </Typography>
      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 2 }}>
        The Services are not tailored to comply with industry-specific
        regulations (Health Insurance Portability and Accountability Act
        (HIPAA), Federal Information Security Management Act (FISMA), etc.), so
        if your interactions would be subjected to such laws, you may not use
        the Services. You may not use the Services in a way that would violate
        the Gramm-Leach-Bliley Act (GLBA).
      </Typography>
    </Box>

    {/* Placeholder para outras seções - iremos adicionar aos poucos */}
    <Box
      ref={(el) => (sectionRefs.current["intellectual-property"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        2. INTELLECTUAL PROPERTY RIGHTS
      </Typography>
      {/* Our intellectual property */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Our intellectual property
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We are the owner or the licensee of all intellectual property rights in
        our Services, including all source code, databases, functionality,
        software, website designs, audio, video, text, photographs, and graphics
        in the Services (collectively, the "<strong>Content</strong>"), as well
        as the trademarks, service marks, and logos contained therein (the "
        <strong>Marks</strong>").
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Our Content and Marks are protected by copyright and trademark laws (and
        various other intellectual property rights and unfair competition laws)
        and treaties in the United States and around the world.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The Content and Marks are provided in or through the Services &quot;AS
        IS&quot; for your personal, non-commercial use or internal business
        purpose only.
      </Typography>

      {/* Your use of our Services */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Your use of our Services
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Subject to your compliance with these Legal Terms, including the
        &quot;PROHIBITED ACTIVITIES&quot; section below, we grant you a
        non-exclusive, non-transferable, revocable license to:
      </Typography>

      <Typography component='ul' sx={{ color: "#e0e0e0", mb: 3, pl: 4 }}>
        <li>access the Services; and</li>
        <li>
          download or print a copy of any portion of the Content to which you
          have properly gained access, solely for your personal, non-commercial
          use or internal business purpose.
        </li>
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Except as set out in this section or elsewhere in our Legal Terms, no
        part of the Services and no Content or Marks may be copied, reproduced,
        aggregated, republished, uploaded, posted, publicly displayed, encoded,
        translated, transmitted, distributed, sold, licensed, or otherwise
        exploited for any commercial purpose whatsoever, without our express
        prior written permission.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        If you wish to make any use of the Services, Content, or Marks other
        than as set out in this section or elsewhere in our Legal Terms, please
        address your request to:{" "}
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          geral@memor-us.com
        </Link>
        . If we ever grant you the permission to post, reproduce, or publicly
        display any part of our Services or Content, you must identify us as the
        owners or licensors of the Services, Content, or Marks and ensure that
        any copyright or proprietary notice appears or is visible on posting,
        reproducing, or displaying our Content.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We reserve all rights not expressly granted to you in and to the
        Services, Content, and Marks.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Any breach of these Intellectual Property Rights will constitute a
        material breach of our Legal Terms and your right to use our Services
        will terminate immediately.
      </Typography>

      {/* Your submissions and contributions */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Your submissions and contributions
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Please review this section and the &quot;PROHIBITED ACTIVITIES&quot;
        section carefully prior to using our Services to understand the (a)
        rights you give us and (b) obligations you have when you post or upload
        any content through the Services.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>Submissions:</strong> By directly sending us any question,
        comment, suggestion, idea, feedback, or other information about the
        Services ("<strong>Submissions</strong>"), you agree to assign to us all
        intellectual property rights in such Submission. You agree that we shall
        own this Submission and be entitled to its unrestricted use and
        dissemination for any lawful purpose, commercial or otherwise, without
        acknowledgment or compensation to you.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>Contributions:</strong> The Services may invite you to chat,
        contribute to, or participate in blogs, message boards, online forums,
        and other functionality during which you may create, submit, post,
        display, transmit, publish, distribute, or broadcast content and
        materials to us or through the Services, including but not limited to
        text, writings, video, audio, photographs, music, graphics, comments,
        reviews, rating suggestions, personal information, or other material
        (&quot;<strong>Contributions</strong>&quot;). Any Submission that is
        publicly posted shall also be treated as a Contribution.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You understand that Contributions may be viewable by other users of the
        Services.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>
          When you post Contributions, you grant us a license (including use of
          your name, trademarks, and logos):
        </strong>
        By posting any Contributions, you grant us an unrestricted, unlimited,
        irrevocable, perpetual, non-exclusive, transferable, royalty-free,
        fully-paid, worldwide right, and license to: use, copy, reproduce,
        distribute, sell, resell, publish, broadcast, retitle, store, publicly
        perform, publicly display, reformat, translate, excerpt (in whole or in
        part), and exploit your Contributions (including, without limitation,
        your image, name, and voice) for any purpose, commercial, advertising,
        or otherwise, to prepare derivative works of, or incorporate into other
        works, your Contributions, and to sublicense the licenses granted in
        this section. Our use and distribution may occur in any media formats
        and through any media channels.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        This license includes our use of your name, company name, and franchise
        name, as applicable, and any of the trademarks, service marks, trade
        names, logos, and personal and commercial images you provide.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>You are responsible for what you post or upload:</strong> By
        sending us Submissions and/or posting Contributions through any part of
        the Services or making Contributions accessible through the Services by
        linking your account through the Services to any of your social
        networking accounts, you:
      </Typography>

      <Typography component='ul' sx={{ color: "#e0e0e0", mb: 3, pl: 4 }}>
        <li>
          confirm that you have read and agree with our "PROHIBITED ACTIVITIES"
          and will not post, send, publish, upload, or transmit through the
          Services any Submission nor post any Contribution that is illegal,
          harassing, hateful, harmful, defamatory, obscene, bullying, abusive,
          discriminatory, threatening to any person or group, sexually explicit,
          false, inaccurate, deceitful, or misleading;
        </li>
        <li>
          to the extent permissible by applicable law, waive any and all moral
          rights to any such Submission and/or Contribution;
        </li>
        <li>
          warrant that any such Submission and/or Contributions are original to
          you or that you have the necessary rights and licenses to submit such
          Submissions and/or Contributions and that you have full authority to
          grant us the above-mentioned rights in relation to your Submissions
          and/or Contributions; and
        </li>
        <li>
          warrant and represent that your Submissions and/or Contributions do
          not constitute confidential information.
        </li>
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You are solely responsible for your Submissions and/or Contributions and
        you expressly agree to reimburse us for any and all losses that we may
        suffer because of your breach of (a) this section, (b) any third party's
        intellectual property rights, or (c) applicable law.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>We may remove or edit your Content:</strong> Although we have no
        obligation to monitor any Contributions, we shall have the right to
        remove or edit any Contributions at any time without notice if in our
        reasonable opinion we consider such Contributions harmful or in breach
        of these Legal Terms. If we remove or edit any such Contributions, we
        may also suspend or disable your account and report you to the
        authorities.
      </Typography>

      {/* Copyright infringement */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Copyright infringement
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We respect the intellectual property rights of others. If you believe
        that any material available on or through the Services infringes upon
        any copyright you own or control, please immediately refer to us by
        contacting{" "}
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          geral@memor-us.com
        </Link>
        .
      </Typography>
    </Box>

    {/* Section 3 - User Representations */}
    <Box
      ref={(el) => (sectionRefs.current["user-representations"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        3. USER REPRESENTATIONS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        By using the Services, you represent and warrant that: (1) all
        registration information you submit will be true, accurate, current, and
        complete; (2) you will maintain the accuracy of such information and
        promptly update such registration information as necessary; (3) you have
        the legal capacity and you agree to comply with these Legal Terms; (4)
        you are not a minor in the jurisdiction in which you reside; (5) you
        will not access the Services through automated or non-human means,
        whether through a bot, script or otherwise; (6) you will not use the
        Services for any illegal or unauthorized purpose; and (7) your use of
        the Services will not violate any applicable law or regulation.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        If you provide any information that is untrue, inaccurate, not current,
        or incomplete, we have the right to suspend or terminate your account
        and refuse any and all current or future use of the Services (or any
        portion thereof).
      </Typography>
    </Box>

    {/* Section 4 - User Registration */}
    <Box
      ref={(el) => (sectionRefs.current["user-registration"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        4. USER REGISTRATION
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You may be required to register to use the Services. You agree to keep
        your password confidential and will be responsible for all use of your
        account and password. We reserve the right to remove, reclaim, or change
        a username you select if we determine, in our sole discretion, that such
        username is inappropriate, obscene, or otherwise objectionable.
      </Typography>
    </Box>

    {/* Section 5 - Subscriptions */}
    <Box
      ref={(el) => (sectionRefs.current["subscriptions"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        5. SUBSCRIPTIONS
      </Typography>

      {/* Billing and Renewal */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Billing and Renewal
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Your subscription will continue and automatically renew unless canceled.
        You consent to our charging your payment method on a recurring basis
        without requiring your prior approval for each recurring charge, until
        such time as you cancel the applicable order. The length of your billing
        cycle is annual.
      </Typography>

      {/* Free Trial */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Free Trial
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We offer a 30-day free trial to new users who register with the
        Services. The account will not be charged and the subscription will be
        suspended until upgraded to a paid version at the end of the free trial.
      </Typography>

      {/* Cancellation */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Cancellation
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You can cancel your subscription at any time by contacting us using the
        contact information provided below. Your cancellation will take effect
        at the end of the current paid term. If you have any questions or are
        unsatisfied with our Services, please email us at{" "}
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          geral@memor-us.com
        </Link>
        .
      </Typography>

      {/* Fee Changes */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Fee Changes
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We may, from time to time, make changes to the subscription fee and will
        communicate any price changes to you in accordance with applicable law.
      </Typography>
    </Box>

    {/* Section 6 - Prohibited Activities */}
    <Box
      ref={(el) => (sectionRefs.current["prohibited-activities"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        6. PROHIBITED ACTIVITIES
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You may not access or use the Services for any purpose other than that
        for which we make the Services available. The Services may not be used
        in connection with any commercial endeavors except those that are
        specifically endorsed or approved by us.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        As a user of the Services, you agree not to:
      </Typography>

      <Typography component='ul' sx={{ color: "#e0e0e0", mb: 3, pl: 4 }}>
        <li>
          Systematically retrieve data or other content from the Services to
          create or compile, directly or indirectly, a collection, compilation,
          database, or directory without written permission from us.
        </li>
        <li>
          Trick, defraud, or mislead us and other users, especially in any
          attempt to learn sensitive account information such as user passwords.
        </li>
        <li>
          Circumvent, disable, or otherwise interfere with security-related
          features of the Services, including features that prevent or restrict
          the use or copying of any Content or enforce limitations on the use of
          the Services and/or the Content contained therein.
        </li>
        <li>
          Disparage, tarnish, or otherwise harm, in our opinion, us and/or the
          Services.
        </li>
        <li>
          Use any information obtained from the Services in order to harass,
          abuse, or harm another person.
        </li>
        <li>
          Make improper use of our support services or submit false reports of
          abuse or misconduct.
        </li>
        <li>
          Use the Services in a manner inconsistent with any applicable laws or
          regulations.
        </li>
        <li>Engage in unauthorized framing of or linking to the Services.</li>
        <li>
          Upload or transmit (or attempt to upload or to transmit) viruses,
          Trojan horses, or other material, including excessive use of capital
          letters and spamming (continuous posting of repetitive text), that
          interferes with any party's uninterrupted use and enjoyment of the
          Services or modifies, impairs, disrupts, alters, or interferes with
          the use, features, functions, operation, or maintenance of the
          Services.
        </li>
        <li>
          Engage in any automated use of the system, such as using scripts to
          send comments or messages, or using any data mining, robots, or
          similar data gathering and extraction tools.
        </li>
        <li>
          Delete the copyright or other proprietary rights notice from any
          Content.
        </li>
        <li>
          Attempt to impersonate another user or person or use the username of
          another user.
        </li>
        <li>
          Upload or transmit (or attempt to upload or to transmit) any material
          that acts as a passive or active information collection or
          transmission mechanism, including without limitation, clear graphics
          interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other
          similar devices (sometimes referred to as "spyware" or "passive
          collection mechanisms" or "pcms").
        </li>
        <li>
          Interfere with, disrupt, or create an undue burden on the Services or
          the networks or services connected to the Services.
        </li>
        <li>
          Harass, annoy, intimidate, or threaten any of our employees or agents
          engaged in providing any portion of the Services to you.
        </li>
        <li>
          Attempt to bypass any measures of the Services designed to prevent or
          restrict access to the Services, or any portion of the Services.
        </li>
        <li>
          Copy or adapt the Services' software, including but not limited to
          Flash, PHP, HTML, JavaScript, or other code.
        </li>
        <li>
          Except as permitted by applicable law, decipher, decompile,
          disassemble, or reverse engineer any of the software comprising or in
          any way making up a part of the Services.
        </li>
        <li>
          Except as may be the result of standard search engine or Internet
          browser usage, use, launch, develop, or distribute any automated
          system, including without limitation, any spider, robot, cheat
          utility, scraper, or offline reader that accesses the Services, or use
          or launch any unauthorized script or other software.
        </li>
        <li>
          Use a buying agent or purchasing agent to make purchases on the
          Services.
        </li>
        <li>
          Make any unauthorized use of the Services, including collecting
          usernames and/or email addresses of users by electronic or other means
          for the purpose of sending unsolicited email, or creating user
          accounts by automated means or under false pretenses.
        </li>
        <li>
          Use the Services as part of any effort to compete with us or otherwise
          use the Services and/or the Content for any revenue-generating
          endeavor or commercial enterprise.
        </li>
        <li>
          Use the Services to advertise or offer to sell goods and services.
        </li>
        <li>Sell or otherwise transfer your profile.</li>
        <li>
          Posting or sharing content that is abusive, discriminatory,
          threatening, pornographic, or offensive.
        </li>
        <li>Advocating or promoting violence, terrorism, or hate speech.</li>
        <li>
          Images may only be used, edited or adapted within the platform and for
          purposes directly related to the objectives of the platform.
        </li>
      </Typography>
    </Box>

    {/* Section 7 - User Generated Contributions */}
    <Box
      ref={(el) => (sectionRefs.current["user-contributions"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        7. USER GENERATED CONTRIBUTIONS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The Services may invite you to chat, contribute to, or participate in
        blogs, message boards, online forums, and other functionality, and may
        provide you with the opportunity to create, submit, post, display,
        transmit, perform, publish, distribute, or broadcast content and
        materials to us or on the Services, including but not limited to text,
        writings, video, audio, photographs, graphics, comments, suggestions, or
        personal information or other material (collectively, "
        <strong>Contributions</strong>"). Contributions may be viewable by other
        users of the Services and through third-party websites. As such, any
        Contributions you transmit may be treated as non-confidential and
        non-proprietary. When you create or make available any Contributions,
        you thereby represent and warrant that:
      </Typography>

      <Typography component='ul' sx={{ color: "#e0e0e0", mb: 3, pl: 4 }}>
        <li>
          The creation, distribution, transmission, public display, or
          performance, and the accessing, downloading, or copying of your
          Contributions do not and will not infringe the proprietary rights,
          including but not limited to the copyright, patent, trademark, trade
          secret, or moral rights of any third party.
        </li>
        <li>
          You are the creator and owner of or have the necessary licenses,
          rights, consents, releases, and permissions to use and to authorize
          us, the Services, and other users of the Services to use your
          Contributions in any manner contemplated by the Services and these
          Legal Terms.
        </li>
        <li>
          You have the written consent, release, and/or permission of each and
          every identifiable individual person in your Contributions to use the
          name or likeness of each and every such identifiable individual person
          to enable inclusion and use of your Contributions in any manner
          contemplated by the Services and these Legal Terms.
        </li>
        <li>Your Contributions are not false, inaccurate, or misleading.</li>
        <li>
          Your Contributions are not unsolicited or unauthorized advertising,
          promotional materials, pyramid schemes, chain letters, spam, mass
          mailings, or other forms of solicitation.
        </li>
        <li>
          Your Contributions are not obscene, lewd, lascivious, filthy, violent,
          harassing, libelous, slanderous, or otherwise objectionable (as
          determined by us).
        </li>
        <li>
          Your Contributions do not ridicule, mock, disparage, intimidate, or
          abuse anyone.
        </li>
        <li>
          Your Contributions are not used to harass or threaten (in the legal
          sense of those terms) any other person and to promote violence against
          a specific person or class of people.
        </li>
        <li>
          Your Contributions do not violate any applicable law, regulation, or
          rule.
        </li>
        <li>
          Your Contributions do not violate the privacy or publicity rights of
          any third party.
        </li>
        <li>
          Your Contributions do not violate any applicable law concerning child
          pornography, or otherwise intended to protect the health or well-being
          of minors.
        </li>
        <li>
          Your Contributions do not include any offensive comments that are
          connected to race, national origin, gender, sexual preference, or
          physical handicap.
        </li>
        <li>
          Your Contributions do not otherwise violate, or link to material that
          violates, any provision of these Legal Terms, or any applicable law or
          regulation.
        </li>
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Any use of the Services in violation of the foregoing violates these
        Legal Terms and may result in, among other things, termination or
        suspension of your rights to use the Services.
      </Typography>
    </Box>

    {/* Section 8 - Contribution License */}
    <Box
      ref={(el) => (sectionRefs.current["contribution-license"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        8. CONTRIBUTION LICENSE
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        By posting your Contributions to any part of the Services, you
        automatically grant, and you represent and warrant that you have the
        right to grant, to us an unrestricted, unlimited, irrevocable,
        perpetual, non-exclusive, transferable, royalty-free, fully-paid,
        worldwide right, and license to host, use, copy, reproduce, disclose,
        sell, resell, publish, broadcast, retitle, archive, store, cache,
        publicly perform, publicly display, reformat, translate, transmit,
        excerpt (in whole or in part), and distribute such Contributions
        (including, without limitation, your image and voice) for any purpose,
        commercial, advertising, or otherwise, and to prepare derivative works
        of, or incorporate into other works, such Contributions, and grant and
        authorize sublicenses of the foregoing. The use and distribution may
        occur in any media formats and through any media channels.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        This license will apply to any form, media, or technology now known or
        hereafter developed, and includes our use of your name, company name,
        and franchise name, as applicable, and any of the trademarks, service
        marks, trade names, logos, and personal and commercial images you
        provide. You waive all moral rights in your Contributions, and you
        warrant that moral rights have not otherwise been asserted in your
        Contributions.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We do not assert any ownership over your Contributions. You retain full
        ownership of all of your Contributions and any intellectual property
        rights or other proprietary rights associated with your Contributions.
        We are not liable for any statements or representations in your
        Contributions provided by you in any area on the Services. You are
        solely responsible for your Contributions to the Services and you
        expressly agree to exonerate us from any and all responsibility and to
        refrain from any legal action against us regarding your Contributions.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We have the right, in our sole and absolute discretion, (1) to edit,
        redact, or otherwise change any Contributions; (2) to re-categorize any
        Contributions to place them in more appropriate locations on the
        Services; and (3) to pre-screen or delete any Contributions at any time
        and for any reason, without notice. We have no obligation to monitor
        your Contributions.
      </Typography>
    </Box>

    {/* Section 9 - Services Management */}
    <Box
      ref={(el) => (sectionRefs.current["services-management"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        9. SERVICES MANAGEMENT
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We reserve the right, but not the obligation, to: (1) monitor the
        Services for violations of these Legal Terms; (2) take appropriate legal
        action against anyone who, in our sole discretion, violates the law or
        these Legal Terms, including without limitation, reporting such user to
        law enforcement authorities; (3) in our sole discretion and without
        limitation, refuse, restrict access to, limit the availability of, or
        disable (to the extent technologically feasible) any of your
        Contributions or any portion thereof; (4) in our sole discretion and
        without limitation, notice, or liability, to remove from the Services or
        otherwise disable all files and content that are excessive in size or
        are in any way burdensome to our systems; and (5) otherwise manage the
        Services in a manner designed to protect our rights and property and to
        facilitate the proper functioning of the Services.
      </Typography>
    </Box>

    {/* Section 10 - Privacy Policy */}
    <Box
      ref={(el) => (sectionRefs.current["privacy-policy-ref"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        10. PRIVACY POLICY
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We care about data privacy and security. Please review our Privacy
        Policy:{" "}
        <Link
          href='http://www.memor-us.com/privacy-policy'
          sx={{ color: "#d0bcfe" }}
        >
          http://www.memor-us.com/privacy-policy
        </Link>
        . By using the Services, you agree to be bound by our Privacy Policy,
        which is incorporated into these Legal Terms. Please be advised the
        Services are hosted in Portugal. If you access the Services from any
        other region of the world with laws or other requirements governing
        personal data collection, use, or disclosure that differ from applicable
        laws in Portugal, then through your continued use of the Services, you
        are transferring your data to Portugal, and you expressly consent to
        have your data transferred to and processed in Portugal.
      </Typography>
    </Box>

    {/* Section 11 - Copyright Infringements */}
    <Box
      ref={(el) => (sectionRefs.current["copyright-infringements"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        11. COPYRIGHT INFRINGEMENTS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We respect the intellectual property rights of others. If you believe
        that any material available on or through the Services infringes upon
        any copyright you own or control, please immediately notify us using the
        contact information provided below (a "<strong>Notification</strong>").
        A copy of your Notification will be sent to the person who posted or
        stored the material addressed in the Notification. Please be advised
        that pursuant to applicable law you may be held liable for damages if
        you make material misrepresentations in a Notification. Thus, if you are
        not sure that material located on or linked to by the Services infringes
        your copyright, you should consider first contacting an attorney.
      </Typography>
    </Box>

    {/* Section 12 - Term and Termination */}
    <Box
      ref={(el) => (sectionRefs.current["term-termination"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        12. TERM AND TERMINATION
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        These Legal Terms shall remain in full force and effect while you use
        the Services.{" "}
        <strong>
          WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE
          THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY,
          DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP
          ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING
          WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR
          COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR
          REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES
          OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED
          AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
        </strong>
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        If we terminate or suspend your account for any reason, you are
        prohibited from registering and creating a new account under your name,
        a fake or borrowed name, or the name of any third party, even if you may
        be acting on behalf of the third party. In addition to terminating or
        suspending your account, we reserve the right to take appropriate legal
        action, including without limitation pursuing civil, criminal, and
        injunctive redress.
      </Typography>
    </Box>

    {/* Section 13 - Modifications and Interruptions */}
    <Box
      ref={(el) => (sectionRefs.current["modifications-interruptions"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        13. MODIFICATIONS AND INTERRUPTIONS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We reserve the right to change, modify, or remove the contents of the
        Services at any time or for any reason at our sole discretion without
        notice. However, we have no obligation to update any information on our
        Services. We will not be liable to you or any third party for any
        modification, price change, suspension, or discontinuance of the
        Services.
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We cannot guarantee the Services will be available at all times. We may
        experience hardware, software, or other problems or need to perform
        maintenance related to the Services, resulting in interruptions, delays,
        or errors. We reserve the right to change, revise, update, suspend,
        discontinue, or otherwise modify the Services at any time or for any
        reason without notice to you. You agree that we have no liability
        whatsoever for any loss, damage, or inconvenience caused by your
        inability to access or use the Services during any downtime or
        discontinuance of the Services. Nothing in these Legal Terms will be
        construed to obligate us to maintain and support the Services or to
        supply any corrections, updates, or releases in connection therewith.
      </Typography>
    </Box>

    {/* Section 14 - Governing Law */}
    <Box
      ref={(el) => (sectionRefs.current["governing-law"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        14. GOVERNING LAW
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        These Legal Terms are governed by and interpreted following the laws of{" "}
        <strong>Portugal</strong>, and the use of the United Nations Convention
        of Contracts for the International Sales of Goods is expressly excluded.
        If your habitual residence is in the EU, and you are a consumer, you
        additionally possess the protection provided to you by obligatory
        provisions of the law in your country to residence.{" "}
        <strong>Memor'us</strong> and yourself both agree to submit to the
        non-exclusive jurisdiction of the courts of <strong>Aveiro</strong>,
        which means that you may make a claim to defend your consumer protection
        rights in regards to these Legal Terms in Portugal, or in the EU country
        in which you reside.
      </Typography>
    </Box>

    {/* Section 15 - Dispute Resolution */}
    <Box
      ref={(el) => (sectionRefs.current["dispute-resolution"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        15. DISPUTE RESOLUTION
      </Typography>

      {/* Informal Negotiations */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Informal Negotiations
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        To expedite resolution and control the cost of any dispute, controversy,
        or claim related to these Legal Terms (each a "<strong>Dispute</strong>"
        and collectively, the "<strong>Disputes</strong>") brought by either you
        or us (individually, a "<strong>Party</strong>" and collectively, the "
        <strong>Parties</strong>"), the Parties agree to first attempt to
        negotiate any Dispute (except those Disputes expressly provided below)
        informally for at least thirty (30) days before initiating arbitration.
        Such informal negotiations commence upon written notice from one Party
        to the other Party.
      </Typography>

      {/* Binding Arbitration */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Binding Arbitration
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Any dispute arising from the relationships between the Parties to these
        Legal Terms shall be determined by one arbitrator who will be chosen in
        accordance with the Arbitration and Internal Rules of the European Court
        of Arbitration being part of the European Centre of Arbitration having
        its seat in Strasbourg, and which are in force at the time the
        application for arbitration is filed, and of which adoption of this
        clause constitutes acceptance. The seat of arbitration shall be
        <strong>Aveiro, Portugal</strong>. The language of the proceedings shall
        be <strong>English, Portuguese</strong>. Applicable rules of substantive
        law shall be the law of <strong>Portugal</strong>.
      </Typography>

      {/* Restrictions */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Restrictions
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The Parties agree that any arbitration shall be limited to the Dispute
        between the Parties individually. To the full extent permitted by law,
        (a) no arbitration shall be joined with any other proceeding; (b) there
        is no right or authority for any Dispute to be arbitrated on a
        class-action basis or to utilize class action procedures; and (c) there
        is no right or authority for any Dispute to be brought in a purported
        representative capacity on behalf of the general public or any other
        persons.
      </Typography>

      {/* Exceptions to Informal Negotiations and Arbitration */}
      <Typography
        variant='h6'
        sx={{ color: "#e0e0e0", mt: 3, mb: 2, fontWeight: "bold" }}
      >
        Exceptions to Informal Negotiations and Arbitration
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The Parties agree that the following Disputes are not subject to the
        above provisions concerning informal negotiations binding arbitration:
        (a) any Disputes seeking to enforce or protect, or concerning the
        validity of, any of the intellectual property rights of a Party; (b) any
        Dispute related to, or arising from, allegations of theft, piracy,
        invasion of privacy, or unauthorized use; and (c) any claim for
        injunctive relief. If this provision is found to be illegal or
        unenforceable, then neither Party will elect to arbitrate any Dispute
        falling within that portion of this provision found to be illegal or
        unenforceable and such Dispute shall be decided by a court of competent
        jurisdiction within the courts listed for jurisdiction above, and the
        Parties agree to submit to the personal jurisdiction of that court.
      </Typography>
    </Box>

    {/* Section 16 - Corrections */}
    <Box ref={(el) => (sectionRefs.current["corrections"] = el)} sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        16. CORRECTIONS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        There may be information on the Services that contains typographical
        errors, inaccuracies, or omissions, including descriptions, pricing,
        availability, and various other information. We reserve the right to
        correct any errors, inaccuracies, or omissions and to change or update
        the information on the Services at any time, without prior notice.
      </Typography>
    </Box>

    {/* Section 17 - Disclaimer */}
    <Box ref={(el) => (sectionRefs.current["disclaimer"] = el)} sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        17. DISCLAIMER
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        The services are provided on an as-is and as-available basis. You agree
        that your use of the services will be at your sole risk. To the fullest
        extent permitted by law, we disclaim all warranties, express or implied,
        in connection with the services and your use thereof, including, without
        limitation, the implied warranties of merchantability, fitness for a
        particular purpose, and non-infringement. We make no warranties or
        representations about the accuracy or completeness of the services'
        content or the content of any websites or mobile applications linked to
        the services and we will assume no liability or responsibility for any
        (1) errors, mistakes, or inaccuracies of content and materials, (2)
        personal injury or property damage, of any nature whatsoever, resulting
        from your access to and use of the services, (3) any unauthorized access
        to or use of our secure servers and/or any and all personal information
        and/or financial information stored therein, (4) any interruption or
        cessation of transmission to or from the services, (5) any bugs,
        viruses, trojan horses, or the like which may be transmitted to or
        through the services by any third party, and/or (6) any errors or
        omissions in any content and materials or for any loss or damage of any
        kind incurred as a result of the use of any content posted, transmitted,
        or otherwise made available via the services. We do not warrant,
        endorse, guarantee, or assume responsibility for any product or service
        advertised or offered by a third party through the services, any
        hyperlinked website, or any website or mobile application featured in
        any banner or other advertising, and we will not be a party to or in any
        way be responsible for monitoring any transaction between you and any
        third-party providers of products or services. As with the purchase of a
        product or service through any medium or in any environment, you should
        use your best judgment and exercise caution where appropriate.
      </Typography>
    </Box>

    {/* Section 18 - Limitations of Liability */}
    <Box
      ref={(el) => (sectionRefs.current["limitations-liability"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        18. LIMITATIONS OF LIABILITY
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        In no event will we or our directors, employees, or agents be liable to
        you or any third party for any direct, indirect, consequential,
        exemplary, incidental, special, or punitive damages, including lost
        profit, lost revenue, loss of data, or other damages arising from your
        use of the services, even if we have been advised of the possibility of
        such damages. Notwithstanding anything to the contrary contained herein,
        our liability to you for any cause whatsoever and regardless of the form
        of the action, will at all times be limited to the amount paid, if any,
        by you to us during the six (6) month period prior to any cause of
        action arising. Certain US state laws and international laws do not
        allow limitations on implied warranties or the exclusion or limitation
        of certain damages. If these laws apply to you, some or all of the above
        disclaimers or limitations may not apply to you, and you may have
        additional rights.
      </Typography>
    </Box>

    {/* Section 19 - Indemnification */}
    <Box
      ref={(el) => (sectionRefs.current["indemnification"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        19. INDEMNIFICATION
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        You agree to defend, indemnify, and hold us harmless, including our
        subsidiaries, affiliates, and all of our respective officers, agents,
        partners, and employees, from and against any loss, damage, liability,
        claim, or demand, including reasonable attorneys' fees and expenses,
        made by any third party due to or arising out of: (1) your
        Contributions; (2) use of the Services; (3) breach of these Legal Terms;
        (4) any breach of your representations and warranties set forth in these
        Legal Terms; (5) your violation of the rights of a third party,
        including but not limited to intellectual property rights; or (6) any
        overt harmful act toward any other user of the Services with whom you
        connected via the Services. Notwithstanding the foregoing, we reserve
        the right, at your expense, to assume the exclusive defense and control
        of any matter for which you are required to indemnify us, and you agree
        to cooperate, at your expense, with our defense of such claims. We will
        use reasonable efforts to notify you of any such claim, action, or
        proceeding which is subject to this indemnification upon becoming aware
        of it.
      </Typography>
    </Box>

    {/* Section 20 - User Data */}
    <Box ref={(el) => (sectionRefs.current["user-data"] = el)} sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        20. USER DATA
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        We will maintain certain data that you transmit to the Services for the
        purpose of managing the performance of the Services, as well as data
        relating to your use of the Services. Although we perform regular
        routine backups of data, you are solely responsible for all data that
        you transmit or that relates to any activity you have undertaken using
        the Services. You agree that we shall have no liability to you for any
        loss or corruption of any such data, and you hereby waive any right of
        action against us arising from any such loss or corruption of such data.
      </Typography>
    </Box>

    {/* Section 21 - Electronic Communications, Transactions, and Signatures */}
    <Box
      ref={(el) => (sectionRefs.current["electronic-communications"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        21. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        Visiting the Services, sending us emails, and completing online forms
        constitute electronic communications. You consent to receive electronic
        communications, and you agree that all agreements, notices, disclosures,
        and other communications we provide to you electronically, via email and
        on the Services, satisfy any legal requirement that such communication
        be in writing.{" "}
        <strong>
          YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS,
          ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES,
          POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR
          VIA THE SERVICES.
        </strong>
        You hereby waive any rights or requirements under any statutes,
        regulations, rules, ordinances, or other laws in any jurisdiction which
        require an original signature or delivery or retention of non-electronic
        records, or to payments or the granting of credits by any means other
        than electronic means.
      </Typography>
    </Box>

    {/* Section 22 - Miscellaneous */}
    <Box
      ref={(el) => (sectionRefs.current["miscellaneous"] = el)}
      sx={{ mb: 4 }}
    >
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        22. MISCELLANEOUS
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        These Legal Terms and any policies or operating rules posted by us on
        the Services or in respect to the Services constitute the entire
        agreement and understanding between you and us. Our failure to exercise
        or enforce any right or provision of these Legal Terms shall not operate
        as a waiver of such right or provision. These Legal Terms operate to the
        fullest extent permissible by law. We may assign any or all of our
        rights and obligations to others at any time. We shall not be
        responsible or liable for any loss, damage, delay, or failure to act
        caused by any cause beyond our reasonable control. If any provision or
        part of a provision of these Legal Terms is determined to be unlawful,
        void, or unenforceable, that provision or part of the provision is
        deemed severable from these Legal Terms and does not affect the validity
        and enforceability of any remaining provisions. There is no joint
        venture, partnership, employment or agency relationship created between
        you and us as a result of these Legal Terms or use of the Services. You
        agree that these Legal Terms will not be construed against us by virtue
        of having drafted them. You hereby waive any and all defenses you may
        have based on the electronic form of these Legal Terms and the lack of
        signing by the parties hereto to execute these Legal Terms.
      </Typography>
    </Box>

    {/* Section 23 - Contact Us */}
    <Box ref={(el) => (sectionRefs.current["contact-us"] = el)} sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ color: "#d0bcfe", mt: 3, mb: 2 }}>
        23. CONTACT US
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        In order to resolve a complaint regarding the Services or to receive
        further information regarding use of the Services, please contact us at:
      </Typography>

      <Typography variant='body2' sx={{ color: "#e0e0e0", mb: 3 }}>
        <strong>Memor'us</strong>
        <br />
        <strong>Universidade de Aveiro</strong>
        <br />
        <strong>Aveiro 3810-193</strong>
        <br />
        <strong>Portugal</strong>
        <br />
        <Link href='mailto:geral@memor-us.com' sx={{ color: "#d0bcfe" }}>
          <strong>geral@memor-us.com</strong>
        </Link>
      </Typography>
    </Box>
  </Box>
);

export default Terms;
