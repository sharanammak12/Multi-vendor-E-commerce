import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  /* ================= EMPTY ================= */
  if (!wishlist || wishlist.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Your Wishlist is Empty 💔
        </Typography>

        <Typography color="text.secondary" mt={1} mb={2}>
          Save items you like
        </Typography>

        <Button variant="contained" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        backgroundColor: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <Typography fontSize={20} fontWeight={700} mb={2}>
        My Wishlist ({wishlist.length})
      </Typography>

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(3,1fr)",
            md: "repeat(5,1fr)",
          },
          gap: 2,
        }}
      >
        {wishlist.map((item) => (
          <Card
            key={item._id}
            sx={{
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              height: 270,
              display: "flex",
              flexDirection: "column",
              transition: "0.25s",
              "&:hover": {
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* IMAGE */}
            <Box
              sx={{
                height: 140,
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <CardMedia
                component="img"
                image={
                  item.images?.[0]?.url || "https://via.placeholder.com/150"
                }
                sx={{
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* CONTENT */}
            <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
              {/* NAME */}
              <Typography
                fontSize={13}
                fontWeight={600}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 34,
                }}
              >
                {item.name}
              </Typography>

              {/* 🔥 PRICE BLACK */}
              <Typography
                fontSize={15}
                fontWeight={700}
                mt={0.5}
                sx={{ color: "#111" }}
              >
                ₹{item.price}
              </Typography>
            </Box>

            {/* 🔥 ACTION ROW */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                px: 1,
                pb: 1,
              }}
            >
              <Button
                fullWidth
                size="small"
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                sx={{
                  fontSize: 12,
                  py: 0.6,
                  borderRadius: 1.5,
                }}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                Select Options
              </Button>

              {/* DELETE */}
              <IconButton
                color="error"
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 1.5,
                  px: 1,
                }}
                onClick={() => removeFromWishlist(item._id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default WishlistPage;
