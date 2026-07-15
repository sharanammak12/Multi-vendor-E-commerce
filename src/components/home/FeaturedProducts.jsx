import { Box, Typography, Grid, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import ProductCard from "../product/ProductCard";

const FeaturedProducts = ({ products }) => {
  const scrollRef = useRef(null);

  if (!products?.length) return null;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        mt: { xs: 3, md: 6 },
        px: { xs: 1, sm: 2, md: 3 }, // ✅ mobile edge fix
      }}
    >
      <Typography fontWeight={800} fontSize={{ xs: 18, md: 22 }} mb={2}>
        Featured Products
      </Typography>

      {/* ================= MOBILE SLIDER ================= */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "relative",
        }}
      >
        {/* LEFT */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: -4,
            top: "40%",
            zIndex: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* SLIDER */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {products.map((product) => (
            <Box
              key={product._id} // ✅ FIXED
              sx={{
                minWidth: 180,
                flexShrink: 0,
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        {/* RIGHT */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: -4,
            top: "40%",
            zIndex: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ================= DESKTOP GRID ================= */}
      <Grid container spacing={3} sx={{ display: { xs: "none", sm: "flex" } }}>
        {products.map((product) => (
          <Grid item sm={4} md={3} key={product._id}>
            {" "}
            {/* ✅ FIXED */}
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
