import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();

  const { cartItems, updateQuantity, removeFromCart, itemLoading } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const validIds = cartItems.map((item) => item._id.toString());

    setSelectedItems((prev) => prev.filter((id) => validIds.includes(id)));
  }, [cartItems]);

  /* ================= EMPTY CART ================= */

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" fontWeight={800}>
          Your Cart is Empty 🛒
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  /* ================= SELECTED ITEMS ================= */

  const selectedCartItems =
    selectedItems.length > 0
      ? cartItems.filter((item) => selectedItems.includes(item._id.toString()))
      : cartItems;

  /* ================= PRICE CALCULATION ================= */

  /* ================= PRICE CALCULATION ================= */

  const itemsTotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const FINAL_TOTAL = itemsTotal;

  /* ================= CHECKBOX HANDLER ================= */

  const toggleItem = (id, checked) => {
    const strId = id.toString();

    if (checked) {
      setSelectedItems((prev) => [...prev, strId]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== strId));
    }
  };

  /* ================= CHECKOUT ================= */

  const handleCartCheckout = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const items =
      selectedItems.length > 0
        ? selectedItems
        : cartItems.map((item) => item._id.toString());

    const cleanIds = items
      .map((id) => id?.toString())
      .filter((id) => id && id !== "null");

    console.log("✅ FINAL IDS SENT:", cleanIds);

    navigate("/payment", {
      state: {
        from: "cart",
        items: cleanIds,
      },
    });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4, background: "#eaeded" }}>
      <Typography variant="h4" fontWeight={800} mb={3}>
        Shopping Cart
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
        }}
      >
        {/* ================= CART ITEMS ================= */}

        <Box>
          {cartItems.map((item) => {
            if (!item?.product) return null;

            const key = item._id;
            const loading = itemLoading[key];

            return (
              <Card key={key} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* IMAGE */}

                  <CardMedia
                    component="img"
                    image={item.product?.images?.[0]?.url || ""}
                    sx={{
                      width: 120,
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/product/${item.product._id}`, {
                        state: { cartItem: item },
                      })
                    }
                  />

                  {/* PRODUCT INFO */}

                  <CardContent sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>
                      {item.product?.name}
                    </Typography>

                    <Typography fontWeight={800}>
                      ₹
                      {item.discount > 0
                        ? Math.round(item.price * (1 - item.discount / 100))
                        : item.price}
                    </Typography>

                    <Typography fontSize={13} color="text.secondary">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </Typography>

                    {/* CHECKBOX */}

                    <Checkbox
                      checked={selectedItems.includes(item._id.toString())}
                      onChange={(e) => toggleItem(item._id, e.target.checked)}
                    />

                    {/* QUANTITY */}

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        disabled={item.quantity <= 1 || loading}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>

                      <Typography sx={{ px: 1 }}>{item.quantity}</Typography>

                      <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>

                  {/* DELETE */}

                  <IconButton
                    color="error"
                    disabled={loading}
                    onClick={() => setDeleteTarget(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* ================= PRICE DETAILS  ================= */}

        <Card sx={{ p: 3, height: "fit-content" }}>
          <Typography fontWeight={800} fontSize={18}>
            Price Details
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 14,
              pb: 1,
            }}
          >
            <Typography sx={{ width: "50%" }}>Product</Typography>
            <Typography sx={{ width: "20%", textAlign: "center" }}>
              Qty
            </Typography>
            <Typography sx={{ width: "30%", textAlign: "right" }}>
              Price
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Items */}
          {selectedCartItems.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,
                py: 1,
                borderBottom: "1px dashed #ddd",
              }}
            >
              {/* Product Name */}
              <Typography noWrap sx={{ width: "50%" }}>
                {item.product?.name}
              </Typography>

              {/* Quantity */}
              <Typography sx={{ width: "20%", textAlign: "center" }}>
                {item.quantity}
              </Typography>

              {/* Price */}
              <Typography
                sx={{ width: "30%", textAlign: "right", fontWeight: 600 }}
              >
                ₹{item.price * item.quantity}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Delivery */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Delivery</Typography>
            <Typography color="text.secondary">
              Calculated at checkout
            </Typography>
          </Box>

          {/* Total */}
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={800}>Total</Typography>

            <Typography fontWeight={800}>₹{itemsTotal}</Typography>
          </Box>

          {/* Checkout Button */}
          <Button
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "#FFD814",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#F7CA00" },
            }}
            onClick={handleCartCheckout}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </Box>

      {/* ================= DELETE CONFIRM ================= */}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Remove Item?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to remove this item from your cart?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await removeFromCart(deleteTarget);

              // ✅ REMOVE from selectedItems also
              setSelectedItems((prev) =>
                prev.filter((id) => id !== deleteTarget),
              );

              setDeleteTarget(null);
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage;
