import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Divider,
  Paper,
  Rating,
  Pagination,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const SIMILAR_PER_PAGE = 4;

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarPage, setSimilarPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/reviews/${productId}`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [productId]);
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/user/products/${productId}`);
        setProduct(res?.data || null);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  /* ================= LOAD CART ITEM STATE ================= */

  useEffect(() => {
    if (location.state?.cartItem) {
      setSelectedSize(location.state.cartItem.selectedSize || null);
      setSelectedColor(location.state.cartItem.selectedColor || null);
    }
  }, [location.state]);

  /* ================= FETCH SIMILAR PRODUCTS ================= */

  useEffect(() => {
    if (!product) return;

    const fetchSimilar = async () => {
      try {
        const res = await axios.get("/user/products", {
          params: { category: product.category, limit: 20 },
        });

        const list = res?.data?.products || [];

        setSimilarProducts(list.filter((p) => p._id !== product._id));
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      }
    };

    fetchSimilar();
  }, [product]);

  useEffect(() => {
    setSimilarPage(1);
  }, [productId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Typography sx={{ p: 3 }} variant="h6">
        Product not found
      </Typography>
    );
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const isSizeRequired = sizes.length > 0;

  const originalPrice = product.price;

  const discountedPrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  const savings = originalPrice - discountedPrice;

  const outOfStock = product.stock <= 0;

  /* ================= ACTIONS ================= */

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (outOfStock) return;

    await addToCart({
      productId: product._id,
      quantity: 1,
      selectedSize,
      selectedColor,
    });

    navigate("/cart");
  };

  /* ================= BUY NOW ================= */

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (outOfStock) return;

    navigate("/payment", {
      state: {
        from: "buyNow",
        items: [
          {
            product: product._id,
            price: discountedPrice,
            quantity: 1,
            selectedSize,
            selectedColor,
          },
        ],
      },
    });
  };
  /* ================= SIMILAR PAGINATION ================= */

  const totalSimilarPages = Math.ceil(
    similarProducts.length / SIMILAR_PER_PAGE,
  );

  const paginatedSimilar = similarProducts.slice(
    (similarPage - 1) * SIMILAR_PER_PAGE,
    similarPage * SIMILAR_PER_PAGE,
  );

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 3, md: 5 },
        backgroundColor: "#eaeded",
        minHeight: "100vh",
      }}
    >
      {/* ================= PRODUCT GRID ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.2fr 1.6fr 1fr",
          },
          gap: 4,
        }}
      >
        {/* IMAGE */}

        <Paper sx={{ p: 2, position: "relative" }}>
          <IconButton
            disabled={outOfStock}
            onClick={() => {
              if (outOfStock) return;

              if (!isLoggedIn()) {
                navigate("/login");
                return;
              }

              toggleWishlist(product._id);
            }}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "#fff",
              boxShadow: 2,

              "&.Mui-disabled": {
                bgcolor: "#f3f4f6",
                opacity: 0.6,
              },
            }}
          >
            {isInWishlist(product._id) ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>

          <CardMedia
            component="img"
            loading="lazy"
            image={product.images?.[0]?.url || ""}
            sx={{
              height: { xs: 300, md: 420 },
              objectFit: "contain",
              opacity: outOfStock ? 0.5 : 1,
            }}
          />
          {outOfStock && (
            <Chip
              label="OUT OF STOCK"
              color="error"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                fontWeight: 700,
                zIndex: 2,
              }}
            />
          )}
        </Paper>

        {/* DETAILS */}

        <Box>
          <Typography fontWeight={800} variant="h6">
            {product.name}
          </Typography>

          <Box display="flex" gap={1} mt={1}>
            <Rating value={product.rating || 0} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.numReviews || 0} reviews
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box mt={1}>
            {product.discount > 0 && (
              <Typography
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  fontSize: 15,
                }}
              >
                MRP ₹{originalPrice}
              </Typography>
            )}

            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Typography variant="h5" fontWeight={800} color="error">
                ₹{discountedPrice}
              </Typography>

              {product.discount > 0 && (
                <Chip
                  label={`${product.discount}% OFF`}
                  color="success"
                  size="small"
                />
              )}
            </Box>

            {product.discount > 0 && (
              <Typography
                color="success.main"
                fontWeight={600}
                fontSize={14}
                mt={0.5}
              >
                You Save ₹{savings}
              </Typography>
            )}
          </Box>
          {/* SIZE */}

          {sizes.length > 0 && (
            <>
              <Typography fontWeight={700} mt={3}>
                Select Size
              </Typography>

              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {sizes.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    clickable
                    color={selectedSize === s ? "primary" : "default"}
                    variant={selectedSize === s ? "filled" : "outlined"}
                    onClick={() => setSelectedSize(s)}
                  />
                ))}
              </Box>
            </>
          )}

          {/* COLOR */}

          {colors.length > 0 && (
            <>
              <Typography fontWeight={700} mt={3}>
                Colour
              </Typography>

              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {colors.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    clickable
                    color={selectedColor === c ? "primary" : "default"}
                    variant={selectedColor === c ? "filled" : "outlined"}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* BUY BOX */}

        <Box sx={{ maxWidth: 320 }}>
          <Paper
            sx={{
              p: 2,
              position: { md: "sticky" },
              top: 100,
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={800} variant="h6">
              ₹{discountedPrice}
            </Typography>

            {outOfStock ? (
              <Typography color="error.main" fontWeight={600}>
                Out of Stock
              </Typography>
            ) : (
              <Typography color="success.main" fontSize={14}>
                In Stock ({product.stock})
              </Typography>
            )}

            <Divider sx={{ my: 1.5 }} />

            <Button
              fullWidth
              size="small"
              disabled={outOfStock || (isSizeRequired && !selectedSize)}
              onClick={handleAddToCart}
              sx={{
                bgcolor: "#FFD814",
                color: "#000",
                fontWeight: 700,
                mb: 1,
                py: 0.8,
              }}
            >
              Add to Cart
            </Button>

            <Button
              fullWidth
              size="small"
              disabled={outOfStock || (isSizeRequired && !selectedSize)}
              onClick={handleBuyNow}
              sx={{
                bgcolor: "#FFA41C",
                color: "#000",
                fontWeight: 700,
                py: 0.8,
              }}
            >
              Buy Now
            </Button>

            {isSizeRequired && !selectedSize && (
              <Typography variant="caption" color="error">
                Please select a size
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* ================= SIMILAR PRODUCTS ================= */}
      {similarProducts.length > 0 && (
        <Box mt={8}>
          <Typography fontWeight={800} variant="h6" mb={3}>
            Similar Products
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {paginatedSimilar.map((item) => (
              <Card
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                sx={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  loading="lazy"
                  image={item.images?.[0]?.url}
                  sx={{ height: 220, objectFit: "contain" }}
                />

                <CardContent>
                  <Typography fontWeight={600} noWrap>
                    {item.name}
                  </Typography>

                  {item.discount > 0 ? (
                    <>
                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          fontSize: 13,
                        }}
                      >
                        ₹{item.price}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Typography fontWeight={800}>
                          ₹{Math.round(item.price * (1 - item.discount / 100))}
                        </Typography>

                        <Chip
                          label={`${item.discount}% OFF`}
                          size="small"
                          color="success"
                        />
                      </Box>
                    </>
                  ) : (
                    <Typography fontWeight={800}>₹{item.price}</Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {totalSimilarPages > 1 && (
            <Stack alignItems="center" mt={4}>
              <Pagination
                count={totalSimilarPages}
                page={similarPage}
                onChange={(e, v) => setSimilarPage(v)}
              />
            </Stack>
          )}
        </Box>
      )}
      {reviews.length > 0 && (
        <Box mt={8}>
          <Typography fontWeight={800} variant="h6" mb={3}>
            Customer Reviews
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)", // ✅ 4 per row
              },
              gap: 3,
            }}
          >
            {reviews.map((r) => (
              <Card
                key={r._id}
                sx={{
                  p: 2,
                  height: 180, // ✅ fixed height (square feel)
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Rating value={r.rating} readOnly size="small" />

                  <Typography fontWeight={600} fontSize={14}>
                    {r.user?.name || "User"}
                  </Typography>

                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // ✅ limit lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {r.comment}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductView;
