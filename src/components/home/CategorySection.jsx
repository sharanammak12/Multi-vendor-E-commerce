import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CategorySection = ({ categories }) => {
  const navigate = useNavigate();

  const handleExplore = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#eaeded",
        px: { xs: 1.5, md: 3 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* SECTION TITLE */}
      <Typography variant="h5" fontWeight={800} sx={{ mb: { xs: 2, md: 3 } }}>
        Shop by Category
      </Typography>

      {/* RESPONSIVE GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile
            sm: "repeat(2, 1fr)", // small tablets
            md: "repeat(3, 1fr)", // laptop
            lg: "repeat(5, 1fr)", // desktop
          },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {categories.map((cat) => (
          <Card
            key={cat.id}
            sx={{
              height: { xs: 230, md: 280 },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.22)",
              },
            }}
          >
            {/* FULL CARD CLICKABLE */}
            <CardActionArea
              sx={{ height: "100%" }}
              onClick={() => handleExplore(cat.slug)}
            >
              {/* IMAGE */}
              <Box
                sx={{
                  height: { xs: 140, md: 180 },
                  backgroundColor: "#f6f6f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardMedia
                  component="img"
                  image={cat.image || cat.image?.url}
                  alt={cat.name}
                  sx={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* TEXT */}
              <Box sx={{ px: 1.5, py: 1.2 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {cat.name}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.4,
                    display: "inline-block",
                    color: "#007185",
                    fontWeight: 700,
                  }}
                >
                  Explore →
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySection;
