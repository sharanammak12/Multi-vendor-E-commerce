import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Button,
  Radio,
  IconButton,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosInstance from "../api/axiosInstance";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromPage = state?.fromPage || state?.from || "cart";
  const checkoutItems =
    fromPage === "buyNow"
      ? state?.items || []
      : Array.isArray(state?.items)
        ? cartItems.filter((item) => state.items.includes(item._id))
        : cartItems;
  const isBuyNow = fromPage === "buyNow";

  const selectedCartIds = !isBuyNow
    ? Array.isArray(state?.items)
      ? state.items.map((i) => (typeof i === "object" ? i._id : i))
      : cartItems.map((i) => i._id)
    : [];
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    itemsTotal: 0,
    deliveryTotal: 0,
    finalAmount: 0,
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnack = (message, severity = "info") =>
    setSnack({ open: true, message, severity });

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/address");

      const mapped = (res.data.addresses || [])
        .map((a) => ({ id: a._id, ...a }))
        .sort((a, b) => b.isDefault - a.isDefault);

      setAddresses(mapped);

      // ✅ Auto-select default address
      const defaultIndex = mapped.findIndex((a) => a.isDefault);
      if (defaultIndex !== -1) {
        setSelectedIndex(defaultIndex);
        fetchCheckoutSummary(mapped[defaultIndex].id);
      } else {
        setSelectedIndex(null);
      }
    } catch {
      showSnack("Failed to load addresses", "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchCheckoutSummary = async (addressId) => {
    try {
      const payload = {
        addressId,
        from: isBuyNow ? "buyNow" : "cart",

        items: isBuyNow
          ? checkoutItems.map((i) => ({
              product: i.product?._id || i.product,
              quantity: i.quantity,
              selectedSize: i.selectedSize || null,
              selectedColor: i.selectedColor || null,
            }))
          : selectedCartIds,
      };

      const res = await axiosInstance.post("/user/checkout/summary", payload);

      setSummary(res.data.data);
    } catch (err) {
      console.log(err);
      showSnack("Failed to load checkout summary", "error");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= EMPTY CART ================= */
  if (
    (isBuyNow && checkoutItems.length === 0) ||
    (!isBuyNow && selectedCartIds.length === 0)
  ) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography fontWeight={700}>Your cart is empty 🛒</Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  /* ================= DELETE ADDRESS ================= */
  const deleteAddress = async (index) => {
    const addr = addresses[index];

    if (addr.isDefault) {
      showSnack("Default address cannot be deleted", "warning");
      return;
    }

    try {
      await axiosInstance.delete(`/user/address/${addr.id}`);
      showSnack("Address deleted", "success");
      fetchAddresses();
    } catch {
      showSnack("Unable to delete address", "error");
    }
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    if (selectedIndex === null) {
      showSnack("Please select a delivery address", "warning");
      return;
    }

    const selectedAddress = addresses[selectedIndex];

    // ✅ CASE 1: Coming from PaymentPage (Change button)
    if (state?.from === "payment") {
      navigate("/payment", {
        state: {
          from: isBuyNow ? "buyNow" : "cart",
          address: selectedAddress,
          items: isBuyNow ? checkoutItems : selectedCartIds,

          total: summary.finalAmount,
          deliveryCharge: summary.deliveryTotal,
          itemsTotal: summary.itemsTotal,
        },
      });
      return;
    }

    navigate("/payment", {
      state: {
        from: isBuyNow ? "buyNow" : "cart",
        address: selectedAddress,
        items: isBuyNow ? checkoutItems : selectedCartIds,

        total: summary.finalAmount,
        deliveryCharge: summary.deliveryTotal,
        itemsTotal: summary.itemsTotal,
      },
    });
  };

  return (
    <Box sx={{ px: { xs: 1.5, md: 5 }, py: 4, bgcolor: "#f1f3f6" }}>
      <Typography variant="h5" fontWeight={800} mb={3}>
        Checkout
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "2.4fr 1fr" },
          gap: 3,
        }}
      >
        {/* ================= LEFT ================= */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon color="primary" />
              <Typography fontWeight={700}>Delivery Address</Typography>
            </Stack>

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() =>
                navigate("/add-address", {
                  state: {
                    from: "checkout",
                    fromPage,
                    items: isBuyNow ? checkoutItems : selectedCartIds,
                  },
                })
              }
            >
              Add New
            </Button>
          </Stack>

          {/* ================= SKELETON LOADER ================= */}
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} sx={{ p: 2, mb: 2 }}>
                  <Skeleton width="40%" height={25} />
                  <Skeleton width="90%" />
                  <Skeleton width="70%" />
                </Card>
              ))
            : addresses.map((addr, index) => (
                <Card
                  key={addr.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border:
                      selectedIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                    fetchCheckoutSummary(addr.id);
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Radio checked={selectedIndex === index} />

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700}>
                        {addr.fullName}
                        {addr.isDefault && (
                          <Chip label="Default" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {addr.addressLine}, {addr.city}, {addr.state} –{" "}
                        {addr.pincode}
                      </Typography>

                      <Typography variant="body2">📞 {addr.phoneNo}</Typography>
                    </Box>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/add-address", {
                          state: {
                            address: addr,
                            from: "checkout",
                            fromPage,
                            items: isBuyNow ? checkoutItems : selectedCartIds,
                          },
                        });
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      disabled={addr.isDefault}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
        </Card>

        {/* ================= RIGHT ================= */}
        <Card sx={{ p: 3, height: "fit-content", position: "sticky", top: 90 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <ShoppingBagIcon color="primary" />
            <Typography fontWeight={800}>Order Summary</Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />
          <Box>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Items Total</Typography>
                <Typography>₹{summary.itemsTotal}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Delivery Charges</Typography>

                {summary.deliveryTotal === 0 ? (
                  <Typography color="green">FREE</Typography>
                ) : (
                  <Typography>₹{summary.deliveryTotal}</Typography>
                )}
              </Box>

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={800}>Total</Typography>

                <Typography fontWeight={800} color="error">
                  ₹{summary.finalAmount}
                </Typography>
              </Box>
            </Stack>
          </Box>
          {/* ✅ Disabled until address selected */}
          <Button
            fullWidth
            disabled={selectedIndex === null}
            sx={{
              bgcolor: "#FFD814",
              color: "#000",
              fontWeight: 800,
              opacity: selectedIndex === null ? 0.6 : 1,
              "&:hover": { bgcolor: "#F7CA00" },
            }}
            onClick={placeOrder}
          >
            Continue to Payment
          </Button>
        </Card>
      </Box>

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;
