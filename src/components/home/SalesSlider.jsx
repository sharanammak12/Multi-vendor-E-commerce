import { Box, Typography, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= CATEGORY RESOLVER ================= */
const resolveCategory = (sale) => {
  if (sale.keyword) return sale.keyword;
  if (sale.tags?.length) return sale.tags[0];
  return "sale";
};

const SalesSlider = ({ sales = [] }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  /* AUTO SLIDE */
  useEffect(() => {
    if (!sales.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sales.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [sales]);

  const sale = sales[index];
  if (!sale) return null;

  const category = resolveCategory(sale);

  const handleNavigate = () => {
    navigate(`/category/${category}`);
  };

  return (
    <Box
      onClick={handleNavigate}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: { xs: "16 / 9", md: "16 / 6" },
        maxHeight: 520,
        overflow: "hidden",
        cursor: "pointer",
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
        }}
      />

      {/* CONTENT */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 8 },
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.15))",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: 20, md: 44 },
              fontWeight: 900,
            }}
          >
            {sale.title}
          </Typography>

          {sale.subtitle && (
            <Typography sx={{ color: "#eee", mt: 1 }}>
              {sale.subtitle}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ mt: 2.5, backgroundColor: "#d32f2f" }}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* ARROWS */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setIndex((index - 1 + sales.length) % sales.length);
        }}
        sx={{ position: "absolute", left: 14, top: "50%" }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setIndex((index + 1) % sales.length);
        }}
        sx={{ position: "absolute", right: 14, top: "50%" }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default SalesSlider;
