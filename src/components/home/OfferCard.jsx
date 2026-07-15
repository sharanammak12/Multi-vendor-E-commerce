import { Box, Typography, Grid } from "@mui/material";

const IMAGE_HEIGHT = 160; // ✅ ideal for dresses & ethnic wear
const OfferCard = ({ title, images = [], onExplore }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 3,
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* Title */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        mb={2}
        sx={{ lineHeight: 1.3 }}
      >
        {title}
      </Typography>

      {/* Image Grid */}
      <Grid container spacing={1.5}>
        {images.slice(0, 4).map((img, index) => (
          <Grid key={index} size={{ xs: 6 }}>
            <Box
              sx={{
                width: "100%",
                height: IMAGE_HEIGHT,
                backgroundColor: "#f8f8f8",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={img}
                alt="fashion"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/160x240?text=Fashion")
                }
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain", // ✅ full dress visible
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ---------- SEE MORE ---------- */}
      <Typography
        variant="body2"
        onClick={onExplore}
        sx={{
          mt: 2.5,
          fontWeight: 600,
          color: "#007185",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        See more
      </Typography>
    </Box>
  );
};

export default OfferCard;
