import { Box, Grid, Typography, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const socialIcon = {
  color: "#fff",
  mr: 1,
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#f3a847", // matches Vastraa accent
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: "translateY(-2px)",
  },
};
const Footer = () => {
  const navigate = useNavigate();

  const goTo = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: "#0f1111",
        color: "#fff",
        /* ✅ IMPORTANT FOR MOBILE */
        pb: { xs: "72px", md: 0 }, // space for bottom nav
      }}
    >
      {/* ================= MAIN FOOTER ================= */}
      <Box
        sx={{
          px: { xs: 3, md: 12 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Grid container spacing={6}>
          {/* BRAND INFO */}
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Vastraa
            </Typography>

            <Typography sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>
              Elevate your everyday fashion with timeless styles and modern
              trends. Designed for fashion lovers across India.
            </Typography>
            {/* Social */}
            <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={socialIcon}
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={socialIcon}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={socialIcon}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* SHOP */}
          <Grid item xs={6} md={2}>
            <FooterTitle title="Shop" />
            <FooterLink onClick={() => goTo("men")}>Men</FooterLink>
            <FooterLink onClick={() => goTo("women")}>Women</FooterLink>
            <FooterLink onClick={() => goTo("kids")}>Kids</FooterLink>
            <FooterLink onClick={() => goTo("new")}>New Arrivals</FooterLink>
          </Grid>

          {/* COMPANY */}
          <Grid item xs={6} md={2}>
            <FooterTitle title="Company" />
            <FooterLink onClick={() => navigate("/about")}>About Us</FooterLink>
            <FooterLink onClick={() => navigate("/careers")}>
              Careers
            </FooterLink>
            <FooterLink onClick={() => navigate("/store-locator")}>
              Store Locator
            </FooterLink>
            <FooterLink onClick={() => navigate("/blog")}>Blog</FooterLink>
          </Grid>

          {/* SUPPORT */}
          <Grid item xs={6} md={2}>
            <FooterTitle title="Support" />
            <FooterLink onClick={() => navigate("/support")}>
              Contact Us
            </FooterLink>
            <FooterLink onClick={() => navigate("/track-order")}>
              Track Order
            </FooterLink>
            <FooterLink onClick={() => navigate("/returns")}>
              Returns
            </FooterLink>
            <FooterLink onClick={() => navigate("/faqs")}>FAQs</FooterLink>
          </Grid>

          {/* LEGAL */}
          <Grid item xs={6} md={2}>
            <FooterTitle title="Legal" />
            <FooterLink onClick={() => navigate("/privacy-policy")}>
              Privacy Policy
            </FooterLink>
            <FooterLink onClick={() => navigate("/terms-conditions")}>
              Terms & Conditions
            </FooterLink>
            <FooterLink onClick={() => navigate("/shipping-policy")}>
              Shipping Policy
            </FooterLink>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ borderColor: "#222" }} />

      {/* ================= BOTTOM BAR ================= */}
      <Box
        sx={{
          px: { xs: 3, md: 12 },
          py: 2.5,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          color: "#888",
          fontSize: 13,
          gap: 1,
        }}
      >
        <Typography variant="caption">
          © {new Date().getFullYear()} Vastraa. All rights reserved.
        </Typography>

        <Typography variant="caption">Made with ❤️ in India</Typography>
      </Box>
    </Box>
  );
};

/* ================= HELPERS ================= */

const FooterTitle = ({ title }) => (
  <Typography
    sx={{
      fontSize: 14,
      fontWeight: 600,
      mb: 2,
      letterSpacing: 0.5,
    }}
  >
    {title}
  </Typography>
);

const FooterLink = ({ children, onClick }) => (
  <Typography
    onClick={onClick}
    sx={{
      fontSize: 13,
      color: "#aaa",
      mb: 1.2,
      cursor: "pointer",
      transition: "0.2s ease",
      "&:hover": {
        color: "#fff",
        transform: "translateX(3px)",
      },
    }}
  >
    {children}
  </Typography>
);

export default Footer;
