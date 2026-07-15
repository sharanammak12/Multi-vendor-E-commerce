import { Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OfferCard from "./OfferCard";

const OfferGrid = ({ offers }) => {
  const navigate = useNavigate();

  const handleExplore = (category, tag) => {
    if (category && tag) {
      navigate(`/category/${category}/${tag}`);
    } else if (category) {
      navigate(`/category/${category}`);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        mt: 6,
      }}
    >
      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid
            key={offer.id}
            size={{ xs: 12, sm: 6, md: 4 }} // ✅ 3 cards per row on desktop
          >
            <OfferCard
              title={offer.title}
              images={offer.images}
              onExplore={() =>
                handleExplore(offer.category, offer.tag || "all")
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OfferGrid;
