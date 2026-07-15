import { Box, Typography, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ sales = [], banner }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  /* ================= SALES SLIDER LOGIC ================= */
  useEffect(() => {
    if (!sales.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sales.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [sales]);

  const next = () =>
    setIndex((prev) => (prev + 1) % sales.length);

  const prev = () =>
    setIndex((prev) => (prev - 1 + sales.length) % sales.length);

  const sale = sales[index];
  const products = banner?.products || [];

  /* ================= SAFETY ================= */
  if (!sale || !banner) return null;

  return (
    <Box sx={{ width: "100%" }}>
      {/* =====================================================
          SALES SLIDER (TOP HERO BANNER)
      ===================================================== */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 6",
          maxHeight: 520,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src={sale.image}
          alt={sale.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 8 },
            background:
              "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: 22, md: 44 },
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              {sale.title}
            </Typography>

            <Typography
              sx={{
                color: "#f1f1f1",
                fontSize: { xs: 13, md: 18 },
                mt: 1,
                maxWidth: 520,
              }}
            >
              {sale.subtitle}
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 2.5,
                backgroundColor: "#d32f2f",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
              onClick={() => navigate(sale.link)}
            >
              Shop Now
            </Button>
          </Box>
        </Box>

        {/* LEFT ARROW */}
        <IconButton
          onClick={prev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.45)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* RIGHT ARROW */}
        <IconButton
          onClick={next}
          sx={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.45)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* =====================================================
          HERO CONTENT SECTION (BELOW SLIDER)
      ===================================================== */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f7efe6",
          py: { xs: 3, sm: 4, md: 6 },
        }}
      >
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
          {/* LEFT CONTENT */}
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

          {/* RIGHT PRODUCT IMAGES (DESKTOP ONLY) */}
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
              {products.slice(0, 3).map((img, i) => (
                <Box
                  key={i}
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
                    "&:hover": { transform: "translateY(-6px)" },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
