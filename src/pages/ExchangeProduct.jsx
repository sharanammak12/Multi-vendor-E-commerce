import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  Chip,
  Button,
  Divider,
  TextField,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const ExchangeProduct = () => {
  const navigate = useNavigate();
  const { productId, orderId, itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [newSize, setNewSize] = useState(null);
  const [newColor, setNewColor] = useState(null);
  const [reason, setReason] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const exchangeReasons = [
    "Size too small",
    "Size too large",
    "Color looks different than expected",
    "Product fitting issue",
    "Ordered wrong variant",
    "Want a different color",
    "Received damaged product",
    "Quality not as expected",
  ];
  /* ================= SAFETY ================= */
  if (!productId || !orderId || !itemId) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Invalid exchange request</Typography>
      </Box>
    );
  }

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);

        // ✅ PRODUCT
        const productRes = await axiosInstance.get(
          `/user/products/${productId}`,
        );
        setProduct(productRes.data);

        // ✅ ORDER ITEM
        const orderRes = await axiosInstance.get(`/user/orders`);
        const orders = orderRes.data?.orders || [];

        let foundItem = null;

        for (const group of orders) {
          for (const order of group.orders || []) {
            const item = order.items.find((i) => i._id.toString() === itemId);
            if (item) {
              foundItem = item;
              break;
            }
          }
        }

        setCurrentItem(foundItem);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [productId, itemId]);

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product || !currentItem) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography>Item not found or unavailable</Typography>
      </Box>
    );
  }

  /* ================= DATA ================= */
  const sizes = product?.sizes || [];
  const colors = product?.colors || [];

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (reason.length === 0) {
      alert("Please select at least one reason");
      return;
    }

    if (!newSize && !newColor) {
      alert("Please select size or color");
      return;
    }

    if (
      (newSize || currentItem.selectedSize) === currentItem.selectedSize &&
      (newColor || currentItem.selectedColor) === currentItem.selectedColor
    ) {
      alert("Please select a different variant");
      return;
    }

    try {
      setLoading(true);

      console.log({
        newSize,
        newColor,
        currentSize: currentItem.selectedSize,
        currentColor: currentItem.selectedColor,
      });

      await axiosInstance.patch(
        `/user/orders/${orderId}/items/${itemId}/exchange`,
        {
          reason: reason.join(", "),
          newSize,
          newColor,
        },
      );

      alert("Exchange request submitted successfully");
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f7fa",
        px: { xs: 1.5, sm: 3, md: 5 },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        fontWeight={800}
        mb={3}
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "2.3rem",
          },
        }}
      >
        Exchange Product
      </Typography>

      <Card
        sx={{
          width: {
            xs: "100%",
            sm: "95%",
            md: "90%",
            lg: "80%",
            xl: "70%",
          },
          mx: "auto",
          p: { xs: 2, sm: 3, md: 5 },
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        {/* PRODUCT INFO */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Avatar
            src={product?.images?.[0]?.url || "https://via.placeholder.com/100"}
            variant="rounded"
            sx={{
              width: {
                xs: 70,
                sm: 90,
              },
              height: {
                xs: 70,
                sm: 90,
              },
            }}
          />

          <Box>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                },
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current: {currentItem.selectedSize} / {currentItem.selectedColor}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* SIZE */}
        <Box>
          <Typography fontWeight={700}>Select Size</Typography>
          <Stack direction="row" spacing={1} mt={1} useFlexGap flexWrap="wrap">
            {sizes.map((size) => (
              <Chip
                size="small"
                key={size}
                label={size}
                clickable
                color={newSize === size ? "primary" : "default"}
                disabled={size === currentItem.selectedSize}
                onClick={() => setNewSize(size)}
              />
            ))}
          </Stack>
        </Box>

        {/* COLOR */}
        <Box mt={3}>
          <Typography fontWeight={700}>Select Color</Typography>
          <Stack direction="row" spacing={1} mt={1} useFlexGap flexWrap="wrap">
            {colors.map((color) => (
              <Chip
                size="small"
                key={color}
                label={color}
                clickable
                color={newColor === color ? "secondary" : "default"}
                disabled={color === currentItem.selectedColor}
                onClick={() => setNewColor(color)}
              />
            ))}
          </Stack>
        </Box>
        {/* REASONS */}
        <Box mt={3}>
          <Typography fontWeight={700} mb={1}>
            Select Reason for Exchange
          </Typography>

          <FormGroup>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr",
                  md: "1fr 1fr",
                },
                gap: 1,
              }}
            >
              {exchangeReasons.map((item) => (
                <FormControlLabel
                  sx={{
                    m: 0,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    alignItems: "flex-start",

                    "&:hover": {
                      background: "#f0f0f0",
                    },
                  }}
                  key={item}
                  control={
                    <Checkbox
                      checked={reason.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReason([...reason, item]);
                        } else {
                          setReason(reason.filter((r) => r !== item));
                        }
                      }}
                    />
                  }
                  label={item}
                />
              ))}
            </Box>
          </FormGroup>
        </Box>

        {/* BUTTON */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            py: 1.4,
            fontWeight: 700,
            borderRadius: 2,
            whiteSpace: "nowrap",
          }}
          onClick={handleSubmit}
          disabled={loading || (!newSize && !newColor)}
        >
          {loading ? "Processing..." : "Confirm Exchange"}
        </Button>
      </Card>
    </Box>
  );
};

export default ExchangeProduct;
