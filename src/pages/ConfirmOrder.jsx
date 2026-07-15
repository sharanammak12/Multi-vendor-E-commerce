import {
  Box,
  Typography,
  Card,
  Button,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { fetchCart } = useCart();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnack = (message, severity = "error") => {
    setSnack({
      open: true,
      message,
      severity,
    });
  };
  if (!state) {
    navigate("/");
    return null;
  }

  const { from, address, items, total, deliveryCharge } = state;

  const itemsTotal = total - deliveryCharge;

  const confirmOrder = async () => {
    try {
      const itemsPayload =
        from === "cart"
          ? items
          : items.map((i) => ({
              product:
                typeof i.product === "object" ? i.product._id : i.product,
              quantity: i.quantity,
              selectedSize: i.selectedSize || null,
              selectedColor: i.selectedColor || null,
            }));

      const res = await axiosInstance.post("/user/checkout/verify-payment", {
        addressId: address._id,
        from,
        items: itemsPayload,
        paymentMethod: "COD",
      });

      const data = res.data;

      if (from === "cart") {
        await fetchCart();
      }

      navigate("/order-success", {
        state: {
          orders: data.orders,
          total: data.total,
          deliveryCharge: data.deliveryCharge,
        },
      });
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Order failed";

      showSnack(message, "error");
    }
  };
  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: 5,
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
      }}
    >
      <Box maxWidth="1250px" mx="auto">
        {/* 🔥 BIGGER TITLE */}
        <Typography fontSize={28} fontWeight={800} mb={4}>
          Review & Confirm Order
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
            gap: 4,
          }}
        >
          {/* ================= LEFT ================= */}
          <Box>
            {/* ADDRESS */}
            <Card
              sx={{
                p: 3.5,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <LocationOnIcon color="primary" />
                <Typography fontWeight={700} fontSize={20}>
                  Delivery Address
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={700} fontSize={17}>
                    {address.fullName}
                  </Typography>

                  <Typography fontSize={15} color="text.secondary">
                    {address.addressLine}
                  </Typography>

                  <Typography fontSize={15} color="text.secondary">
                    {address.city}, {address.state}
                  </Typography>

                  <Typography fontSize={15} color="text.secondary">
                    {address.pincode}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontSize={15}>📞 {address.phoneNo}</Typography>

                  <Typography fontSize={15}>✉ {address.email}</Typography>
                </Box>
              </Box>
            </Card>

            {/* PAYMENT */}
            <Card
              sx={{
                p: 3.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <PaymentsIcon color="primary" />
                <Typography fontWeight={700} fontSize={20}>
                  Payment Method
                </Typography>
              </Stack>

              <Typography fontWeight={600} fontSize={16}>
                Cash on Delivery
              </Typography>
            </Card>
          </Box>

          {/* ================= RIGHT ================= */}
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              height: "fit-content",
              position: { md: "sticky" },
              top: 100,
            }}
          >
            <Typography fontWeight={800} fontSize={22} mb={3}>
              Order Summary
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontSize={15} color="text.secondary">
                Items Total
              </Typography>
              <Typography fontWeight={600} fontSize={16}>
                ₹{itemsTotal}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontSize={15} color="text.secondary">
                Delivery
              </Typography>
              <Typography fontWeight={600} fontSize={16}>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography fontWeight={800} fontSize={17}>
                Total Amount
              </Typography>
              <Typography fontWeight={800} fontSize={20} color="primary">
                ₹{total}
              </Typography>
            </Box>

            <Button
              fullWidth
              size="large"
              startIcon={<CheckCircleIcon />}
              sx={{
                bgcolor: "#FFD814",
                color: "#000",
                fontWeight: 800,
                py: 1.5,
                fontSize: 16,
                borderRadius: 2,
                "&:hover": { bgcolor: "#F7CA00" },
              }}
              onClick={confirmOrder}
            >
              Confirm & Place Order
            </Button>

            <Typography
              fontSize={13}
              color="text.secondary"
              mt={2}
              textAlign="center"
            >
              By placing your order, you agree to our terms & conditions.
            </Typography>
          </Card>
        </Box>
      </Box>
      {/* ✅ Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmOrder;
