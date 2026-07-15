import {
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const {
    id,
    name = "Unnamed Product",
    image,
    price = 0,
    discount = 0,
    rating = 4,
    category,
    tags = [],
  } = product;

  const isWishlisted = wishlist.some((p) => p.id === id);

  const originalPrice =
    discount > 0
      ? Math.round(price / (1 - discount / 100))
      : null;

  return (
    <Box
      onClick={() => navigate(`/product/${id}`)}
      sx={{
        backgroundColor: "#fff",
        p: 2,
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          height: 200,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
          backgroundColor: "#fafafa",
          borderRadius: 1.5,
        }}
      >
        {/* CATEGORY */}
        {category && (
          <Chip
            label={category}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              backgroundColor: "#111",
              color: "#fff",
            }}
          />
        )}

        {/* WISHLIST */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: "#fff",
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        <img
          src={image || "https://via.placeholder.com/200"}
          alt={name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200";
          }}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* NAME */}
      <Typography
        fontWeight={600}
        fontSize={14}
        sx={{ mb: 0.5, lineHeight: 1.3 }}
        noWrap
        title={name}
      >
        {name}
      </Typography>

      {/* RATING */}
      <Rating
        value={rating}
        precision={0.5}
        readOnly
        size="small"
        sx={{ mb: 0.5 }}
      />

      {/* PRICE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography fontWeight={700} fontSize={16}>
          ₹{price}
        </Typography>

        {originalPrice && (
          <Typography
            fontSize={13}
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            ₹{originalPrice}
          </Typography>
        )}
      </Box>

      {/* DISCOUNT */}
      {discount > 0 && (
        <Typography
          variant="caption"
          sx={{ color: "green", fontWeight: 600 }}
        >
          {discount}% OFF
        </Typography>
      )}

      {/* TAGS */}
      <Box sx={{ mt: 0.5 }}>
        {tags.slice(0, 2).map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{ mr: 0.5, fontSize: 11 }}
          />
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* ADD TO CART */}
      <Button
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          mt: 1,
          fontWeight: 600,
          textTransform: "none",
          borderRadius: 1.5,
        }}
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
      >
        Add to Cart
      </Button>
    </Box>
  );
};

export default ProductCard;
