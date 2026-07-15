import { Box, Typography, Button, Card, Stack, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useCart();

  /* ================= SAFE DATA ================= */

  const state = location.state || {};

  // 🔥 FIXED: Handle all possible response formats
  const rawOrders = state.orders;

  const orders = Array.isArray(rawOrders)
    ? rawOrders
    : Array.isArray(rawOrders?.data)
      ? rawOrders.data
      : rawOrders
        ? [rawOrders]
        : [];

  const totalAmount =
    Number(state.total) ||
    orders.reduce(
      (sum, g) =>
        sum + (g.totalAmount || (g.itemsTotal || 0) + (g.deliveryCharge || 0)),
      0,
    );
  const deliveryCharge =
    Number(state.deliveryCharge) ||
    orders.reduce((sum, g) => sum + (g.deliveryCharge || 0), 0);
  const itemsTotal = Math.max(totalAmount - deliveryCharge, 0);

  /* ================= TOTAL ITEMS ================= */
  const totalItems = orders.reduce((count, group) => {
    let items = [];

    if (Array.isArray(group.orders) && group.orders.length > 0) {
      items = group.orders.flatMap((o) => o.items || []);
    } else if (Array.isArray(group.items)) {
      items = group.items;
    }

    return count + items.length;
  }, 0);

  const processed = useRef(false);

  /* ================= PROTECT DIRECT ACCESS ================= */

  useEffect(() => {
    if (!orders.length) {
      navigate("/", { replace: true });
      return;
    }

    if (processed.current) return;
    processed.current = true;

    const refreshCart = async () => {
      try {
        await fetchCart();
      } catch (err) {
        console.error("Cart refresh failed", err);
      }
    };

    refreshCart();
  }, [orders, navigate, fetchCart]);

  if (!orders.length) return null;

  /* ================= ORDER INFO ================= */

  const placedAt = orders[0]?.orders?.[0]?.createdAt || orders[0]?.createdAt;
  const orderReference =
    orders[0]?.orders?.[0]?._id?.slice(-8)?.toUpperCase() ||
    orders[0]?._id?.slice(-8)?.toUpperCase() ||
    "UNKNOWN";

  /* ================= UI ================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f1f3f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* SUCCESS ICON */}
        <CheckCircleIcon
          sx={{
            fontSize: 90,
            color: "success.main",
            mb: 2,
          }}
        />

        <Typography variant="h5" fontWeight={800}>
          Order Confirmed 🎉
        </Typography>

        <Typography mt={1} color="text.secondary">
          Your order has been placed successfully.
        </Typography>

        {/* ORDER DATE */}
        {placedAt && (
          <Typography fontSize={13} color="text.secondary" mt={1}>
            Placed on {new Date(placedAt).toLocaleString()}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* ORDER SUMMARY */}
        <Typography fontWeight={700}>Order Summary</Typography>

        <Stack spacing={1} mt={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={14}>Items ({totalItems})</Typography>
            <Typography fontSize={14}>₹{itemsTotal}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={14}>Delivery</Typography>
            <Typography fontSize={14}>
              {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
            </Typography>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={800}>Total Paid</Typography>
            <Typography fontWeight={800}>₹{totalAmount}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* ACTION BUTTONS */}
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingBagIcon />}
            sx={{
              bgcolor: "#FFD814",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#F7CA00" },
            }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<ShoppingBagIcon />}
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default OrderSuccess;
