import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OffersSlider = ({ offers = [] }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!offers.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [offers]);

  const next = () => setIndex((prev) => (prev + 1) % offers.length);

  const prev = () =>
    setIndex((prev) => (prev - 1 + offers.length) % offers.length);

  const offer = offers[index];
  if (!offer) return null;

  return (
    <Box sx={{ width: "100%" }}>
      {/* ================= SLIDER ================= */}
      <Box
        onClick={() => navigate("/category/sale")}
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: 180,
            sm: 260,
            md: 380,
          },
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "#fff",
        }}
      >
        {/* IMAGE ONLY (NO OVERLAY) */}
        <Box
          component="img"
          src={offer.image || offer.image?.url}
          alt=""
          loading="eager"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",

            /* anti-blur */
            imageRendering: "auto",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        />

        {/* LEFT ARROW */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* RIGHT ARROW */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* ================= DOTS ================= */}
      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {offers.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 18 : 10,
              height: 4,
              borderRadius: 2,
              bgcolor: i === index ? "#111" : "#bbb",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OffersSlider;
