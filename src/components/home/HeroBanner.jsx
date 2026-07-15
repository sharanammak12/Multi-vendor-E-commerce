import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ banner }) => {
  const navigate = useNavigate();

  // safety check
  if (!banner) return null;

  const products = banner.products || [];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f7efe6",

        py: {
          xs: 3,
          sm: 4,
          md: 6,
        },

        mt: {
          xs: 1.7,
          md: 0,
        },
      }}
    >
      {/* ================= CENTER WRAPPER ================= */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 3, md: 6 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* ================= LEFT CONTENT ================= */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 30, md: 42 },
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 520,
            }}
          >
            {banner.title}
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              fontSize: { xs: 13.5, md: 16 },
              color: "text.secondary",
            }}
          >
            {banner.subtitle}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 480,
              fontSize: { xs: 13, md: 14 },
              color: "text.secondary",
            }}
          >
            Discover curated styles, everyday essentials, and exclusive offers
            designed for modern living.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              px: 3,
              py: 1,
              backgroundColor: "#111",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#000" },
            }}
            onClick={() => navigate("/category/all")}
          >
            Explore Collection
          </Button>
        </Box>

        {/* ================= RIGHT IMAGES (DESKTOP) ================= */}
        {products.length > 0 && (
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              gap: 3,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {products.slice(0, 3).map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt="product"
                sx={{
                  width: 180,
                  height: 240,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
                  transition: "transform 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeroBanner;
