import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";

const BoxSlider = ({ items = [], title }) => {
  const scrollRef = useRef(null);

  // ✅ HARD GUARD (prevents crash)
  if (!Array.isArray(items) || items.length === 0) return null;

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = window.innerWidth < 600 ? 260 : 520;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        mt: {
          xs: 0.5, // 🔑 almost attached to hero on mobile
          sm: 1.5,
          md: 4,
        },
        px: {
          xs: 1,
          sm: 2,
          md: 4,
          lg: 6,
        },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {/* ================= TITLE ================= */}
      {title && (
        <Typography
          sx={{
            fontSize: { xs: 18, md: 22 },
            fontWeight: 800,
            mb: 2,
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ position: "relative" }}>
        {/* ================= LEFT ARROW (DESKTOP) ================= */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* ================= SLIDER ================= */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: { xs: 1.5, md: 2.5 },
            overflowX: "auto",
            scrollBehavior: "smooth",
            px: { xs: 0, md: 4 },
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: {
                  xs: 180,
                  sm: 220,
                  md: 280,
                },
                height: {
                  xs: 240,
                  sm: 280,
                  md: 380,
                },
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.25s ease",
                "&:hover": {
                  transform: { md: "translateY(-6px)" },
                  boxShadow: {
                    md: "0 12px 28px rgba(0,0,0,0.25)",
                  },
                },
              }}
            >
              <Box
                component="img"
                src={
                  item?.image ||
                  item?.url ||
                  "https://via.placeholder.com/300x400"
                }
                alt="product"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* ================= RIGHT ARROW (DESKTOP) ================= */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BoxSlider;
