// import {
//   Box,
//   Chip,
//   Slider,
//   Typography,
//   Button,
// } from "@mui/material";

// const Filters = ({
//   tags = [],
//   selectedTags,
//   setSelectedTags,
//   price,
//   setPrice,
// }) => {
//   const toggleTag = (tag) => {
//     setSelectedTags((prev) =>
//       prev.includes(tag)
//         ? prev.filter((t) => t !== tag)
//         : [...prev, tag]
//     );
//   };

//   const clearFilters = () => {
//     setSelectedTags([]);
//     setPrice([0, 6000]);
//   };

//   return (
//     <Box
//       sx={{
//         p: 2,
//         mb: 3,
//         borderRadius: 2,
//         backgroundColor: "#fafafa",
//       }}
//     >
//       {/* TAG FILTER */}
//       <Typography fontWeight={700} mb={1}>
//         Filter by Tags
//       </Typography>

//       <Box display="flex" gap={1} flexWrap="wrap">
//         {tags.map((tag) => (
//           <Chip
//             key={tag}
//             label={tag}
//             clickable
//             color={
//               selectedTags.includes(tag)
//                 ? "primary"
//                 : "default"
//             }
//             onClick={() => toggleTag(tag)}
//           />
//         ))}
//       </Box>

//       {/* PRICE FILTER */}
//       <Typography fontWeight={700} mt={3}>
//         Price Range
//       </Typography>

//       <Slider
//         value={price}
//         onChange={(e, v) => setPrice(v)}
//         valueLabelDisplay="auto"
//         min={0}
//         max={6000}
//         sx={{ mt: 1 }}
//       />

//       {/* CLEAR */}
//       <Button
//         size="small"
//         onClick={clearFilters}
//         sx={{ mt: 1, color: "error.main" }}
//       >
//         Clear Filters
//       </Button>
//     </Box>
//   );
// };

// export default Filters;

import {
  Box,
  Chip,
  Slider,
  Typography,
  Button,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Filters = ({
  tags = [],
  selectedTags,
  setSelectedTags,
  price,
  setPrice,
  filteredProducts = [],
}) => {
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setPrice([0, 6000]);
  };

  const hasActiveFilters =
    selectedTags.length > 0 || price[0] !== 0 || price[1] !== 6000;

  const noProductsFound = filteredProducts.length === 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        position: "sticky",
        top: 90,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon
            sx={{
              color: "#111827",
              fontSize: 24,
            }}
          />

          <Typography fontWeight={700} fontSize={20}>
            Filters
          </Typography>
        </Stack>

        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={clearFilters}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#dc2626",
            }}
          >
            Reset
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* TAG FILTER */}
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <SellOutlinedIcon
          sx={{
            fontSize: 20,
            color: "#4b5563",
          }}
        />

        <Typography fontWeight={700} fontSize={16}>
          Categories
        </Typography>
      </Stack>

      {tags.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tags available
        </Typography>
      ) : (
        <Box display="flex" gap={1} flexWrap="wrap">
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag);

            return (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => toggleTag(tag)}
                sx={{
                  borderRadius: "10px",
                  px: 0.5,
                  py: 2.2,
                  fontWeight: 600,
                  fontSize: 13,
                  transition: "0.25s",
                  border: selected ? "1px solid #2563eb" : "1px solid #e5e7eb",
                  bgcolor: selected ? "#2563eb" : "#f9fafb",
                  color: selected ? "#fff" : "#374151",
                  "&:hover": {
                    bgcolor: selected ? "#1d4ed8" : "#f3f4f6",
                    transform: "translateY(-1px)",
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* PRICE FILTER */}
      <Box mt={4}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <CurrencyRupeeIcon
            sx={{
              fontSize: 20,
              color: "#4b5563",
            }}
          />

          <Typography fontWeight={700} fontSize={16}>
            Price Range
          </Typography>
        </Stack>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 3,
            bgcolor: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight={600} fontSize={14}>
              ₹{price[0]}
            </Typography>

            <Typography fontWeight={600} fontSize={14}>
              ₹{price[1]}
            </Typography>
          </Stack>

          <Slider
            value={price}
            onChange={(e, v) => setPrice(v)}
            valueLabelDisplay="auto"
            min={0}
            max={6000}
            step={100}
            sx={{
              color: "#2563eb",
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
              },
            }}
          />
        </Box>
      </Box>

      {/* ACTIVE FILTERS */}
      {hasActiveFilters && (
        <Box mt={4}>
          <Typography fontWeight={700} fontSize={15} mb={1.5}>
            Active Filters
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => toggleTag(tag)}
                color="primary"
              />
            ))}

            {(price[0] !== 0 || price[1] !== 6000) && (
              <Chip
                size="small"
                color="secondary"
                label={`₹${price[0]} - ₹${price[1]}`}
              />
            )}
          </Stack>
        </Box>
      )}

      {/* NO PRODUCT FOUND */}
      {noProductsFound && (
        <Box
          mt={4}
          sx={{
            p: 3,
            borderRadius: 4,
            textAlign: "center",
            background: "linear-gradient(180deg,#fff7ed 0%, #ffffff 100%)",
            border: "1px solid #fed7aa",
          }}
        >
          <Typography fontWeight={700} fontSize={18} color="#ea580c" mb={1}>
            No Products Found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            lineHeight={1.7}
          >
            We couldn't find products matching your selected filters.
            <br />
            Try changing category or increasing the price range.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={clearFilters}
            sx={{
              borderRadius: 3,
              py: 1.1,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Filters;
