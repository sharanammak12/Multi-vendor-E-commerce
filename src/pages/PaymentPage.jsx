import { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Button,
  Radio,
  Stack,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";

/* ================= LOAD RAZORPAY ================= */

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const isProcessing = useRef(false);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  const showSnack = (message, severity = "warning") => {
    setSnack({
      open: true,
      message,
      severity,
    });
  };
  const [itemsTotal, setItemsTotal] = useState(0);
  const [deliveryTotal, setDeliveryTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [razorpayOrder, setRazorpayOrder] = useState(null);

  const state = location.state;
  const from = state?.from === "buyNow" ? "buyNow" : "cart";

  /* ================= SELECT ITEMS ================= */

  const buyNowItems = state?.items || [];

  const selectedCartIds = (state?.items || []).filter(Boolean);
  useEffect(() => {
    if (from === "cart" && selectedCartIds.length === 0) {
      navigate("/cart");
    }
  }, [from, selectedCartIds, navigate]);
  let displayItems = [];

  if (from === "buyNow") {
    displayItems = buyNowItems;
  } else {
    displayItems = cartItems.filter((item) =>
      selectedCartIds.includes(item._id.toString()),
    );
  }

  /* ================= GUARD ================= */

  useEffect(() => {
    if (!state && cartItems.length === 0) {
      navigate("/");
    }
  }, [state, cartItems, navigate]);

  /* ================= LOAD ADDRESS ================= */

  useEffect(() => {
    const loadAddress = async () => {
      try {
        if (state?.address) {
          setAddress(state.address);
          return;
        }

        const res = await axiosInstance.get("/user/address");
        const def = res?.data?.addresses?.find((a) => a.isDefault);

        if (!def) {
          navigate("/checkout", {
            state: {
              from,
              fromPage: from,
              items: from === "cart" ? selectedCartIds : buyNowItems,
            },
          });

          return;
        }

        setAddress(def);
      } catch {
        navigate("/checkout", {
          state: {
            from,
            fromPage: from,
            items: from === "cart" ? selectedCartIds : buyNowItems,
          },
        });
      }
    };

    loadAddress();
  }, [state, navigate]);

  /* ================= CALCULATE ITEMS TOTAL ================= */

  useEffect(() => {
    const total = displayItems.reduce((sum, item) => {
      const price = item.price ?? item.product?.price ?? 0;
      const qty = item.quantity ?? 1;
      return sum + price * qty;
    }, 0);

    setItemsTotal(total);
  }, [displayItems]);

  useEffect(() => {
    if (!address) return;

    const fetchSummary = async () => {
      try {
        const itemsPayload =
          from === "cart"
            ? selectedCartIds
            : buyNowItems.map((item) => ({
                product:
                  typeof item.product === "object"
                    ? item.product._id
                    : item.product,
                quantity: item.quantity || 1,
              }));

        const res = await axiosInstance.post("/user/checkout/summary", {
          addressId: address._id,
          from,
          items: itemsPayload,
        });

        const data = res?.data?.data;

        // ✅ CORRECT VALUES
        setItemsTotal(data.itemsTotal);
        setDeliveryTotal(data.deliveryTotal);
        setFinalTotal(data.finalAmount);
      } catch (err) {
        console.error("Summary error:", err);
      }
    };

    fetchSummary();
  }, [address, from, selectedCartIds, buyNowItems, cartItems]);
  /* ================= LOADING ================= */

  if (!address) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography mt={2}>Loading delivery address...</Typography>
      </Box>
    );
  }

  const handlePayment = async () => {
    if (isProcessing.current) return; // ✅ prevents double click
    isProcessing.current = true;
    setProcessing(true);
    try {
      const itemsPayload =
        from === "cart"
          ? selectedCartIds.filter(Boolean)
          : buyNowItems.map((item) => ({
              product:
                typeof item.product === "object"
                  ? item.product._id
                  : item.product,
              quantity: item.quantity || 1,
              selectedSize: item.selectedSize || null,
              selectedColor: item.selectedColor || null,
            }));
      /* ================= VALIDATE STOCK ================= */

      try {
        await axiosInstance.post("/user/validate-stock", {
          from,
          items: itemsPayload,
        });
      } catch (err) {
        const message =
          err?.response?.data?.message || "Some products are out of stock";

        showSnack(message, "error");

        if (from === "cart") {
          await fetchCart();
        }

        isProcessing.current = false;
        setProcessing(false);

        return;
      }

      /* ================= CREATE PAYMENT ================= */
      let razorpayOrderData;

      if (paymentMethod === "online") {
        const res = await axiosInstance.post("/user/checkout/create-payment", {
          addressId: address._id,
          from,
          items: itemsPayload,
        });

        razorpayOrderData = res.data.data;
      }
      if (paymentMethod === "cod") {
        const itemsPayload =
          from === "cart"
            ? selectedCartIds // ✅ send ONLY IDs
            : buyNowItems.map((item) => ({
                product:
                  typeof item.product === "object"
                    ? item.product._id
                    : item.product,
                quantity: item.quantity || 1,
                selectedSize: item.selectedSize || null,
                selectedColor: item.selectedColor || null,
              }));

        navigate("/confirm-order", {
          state: {
            from,
            address,
            items: itemsPayload, // ✅ FIXED
            total: finalTotal,
            deliveryCharge: deliveryTotal,
            paymentMethod: "COD",
          },
        });

        return;
      }
      /* ================= LOAD RAZORPAY ================= */

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed");

      const razor = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        order_id: razorpayOrderData.orderId,

        name: "Vastraa",
        description: "Order Payment",
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post(
              "/user/checkout/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                addressId: address._id,
                from,
                items: itemsPayload,
              },
            );

            await fetchCart();

            navigate("/order-success", {
              state: {
                orders: [
                  {
                    items: displayItems,
                    totalAmount: finalTotal,
                    deliveryCharge: deliveryTotal,
                  },
                ],
                total: finalTotal,
                deliveryCharge: deliveryTotal,
              },
            });
          } catch (err) {
            console.error("VERIFY ERROR:", err);

            const message =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Payment verification failed";

            showSnack(message, "error");

            // OPTIONAL
            if (message.toLowerCase().includes("out of stock")) {
              await fetchCart();

              navigate("/cart");
            }
          }
        },

        theme: { color: "#1976d2" },
      });

      razor.on("payment.failed", () => {
        alert("Payment failed");
      });

      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      isProcessing.current = false;
      setProcessing(false);
    }
  };

  /* ================= PAYMENT OPTION ================= */

  const PaymentRow = ({ value, icon, title, subtitle }) => (
    <Box
      onClick={() => setPaymentMethod(value)}
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid",
        borderColor: paymentMethod === value ? "primary.main" : "grey.300",
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: paymentMethod === value ? "primary.light" : "#fff",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Radio checked={paymentMethod === value} />
        {icon}

        <Box>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography fontSize={13} color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4, bgcolor: "#f1f3f6" }}>
      <Typography fontWeight={800} mb={2}>
        Place Your Order
      </Typography>

      <Card sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <LocationOnIcon color="primary" />
            <Typography fontWeight={700}>Delivering To</Typography>
          </Stack>

          {/* ✅ ADD THIS */}
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  from: "payment",
                  fromPage: from,
                  items: from === "buyNow" ? buyNowItems : selectedCartIds,
                },
              })
            }
          >
            Change
          </Button>
        </Stack>

        <Typography fontWeight={700}>{address.fullName}</Typography>

        <Typography fontSize={14}>
          {address.addressLine}, {address.city} – {address.pincode}
        </Typography>

        <Chip
          icon={<LocalShippingIcon />}
          label={
            deliveryTotal === 0 ? "Free Delivery" : `Delivery ₹${deliveryTotal}`
          }
          color="primary"
          size="small"
          sx={{ mt: 1 }}
        />
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} mb={2}>
          <PaymentsIcon color="primary" />
          <Typography fontWeight={700}>Payment Method</Typography>
        </Stack>

        <PaymentRow
          value="cod"
          icon={<MoneyIcon />}
          title="Cash on Delivery"
          subtitle="Pay when the product is delivered"
        />

        <PaymentRow
          value="online"
          icon={<CreditCardIcon />}
          title="Online Payment"
          subtitle="UPI, Cards, Netbanking via Razorpay"
        />

        <Button
          fullWidth
          disabled={processing}
          sx={{
            mt: 3,
            bgcolor: "#FFD814",
            color: "#000",
            fontWeight: 800,
          }}
          onClick={handlePayment}
        >
          {paymentMethod === "cod"
            ? "Confirm Cash on Delivery"
            : "Pay Securely Online"}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography>Items Total: ₹{itemsTotal}</Typography>
        <Typography>Delivery: ₹{deliveryTotal}</Typography>

        <Typography fontWeight={800}>Order Total: ₹{finalTotal}</Typography>
      </Card>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
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

export default PaymentPage;
