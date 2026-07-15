import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Card,
  Divider,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
  Rating,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ReplayIcon from "@mui/icons-material/Replay";

import axiosInstance from "../api/axiosInstance";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderPolicy, setOrderPolicy] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState([]);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewItem, setReviewItem] = useState(null);

  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleReviewOpen = (item) => {
    setReviewItem(item);
    setReviewRating(0);
    setReviewComment("");
    setOpenReviewDialog(true);
  };
  const cancelReasons = [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Delivery is too late",
    "Need to change delivery address",
    "Changed my mind",
    "Product no longer needed",
    "Want to modify the order",
    "Other personal reason",
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/user/orders?page=${pageNumber}&limit=5`,
      );

      setOrders(res?.data?.orders || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const loadOrderPolicy = async () => {
    try {
      const res = await axiosInstance.get("/user/order-policy");
      setOrderPolicy(res.data);
    } catch (err) {
      console.error("Failed to load order policy", err);
    }
  };
  useEffect(() => {
    loadOrders(page);
    loadOrderPolicy();
  }, [page]);
  const handleAction = (orderId, item, type, groupPaymentMethod) => {
    // ✅ RETURN → NAVIGATE TO RETURN PAGE
    if (type === "return") {
      navigate(`/return/${item.product?._id}/${orderId}/${item.itemId}`, {
        state: { paymentMethod: groupPaymentMethod },
      });
      return;
    }

    // ✅ EXCHANGE → NAVIGATE
    if (type === "exchange") {
      navigate(`/exchange/${item.product?._id}/${orderId}/${item.itemId}`);
      return;
    }

    // ✅ ONLY CANCEL USES DIALOG
    setSelectedItem({
      orderId,
      itemId: item.itemId,
    });

    setActionType("cancel");
    setReason("");
    setOpenDialog(true);
  };
  const submitReview = async () => {
    if (!reviewRating) {
      return setSnackbar({
        open: true,
        message: "Please select rating",
        severity: "warning",
      });
    }

    try {
      await axiosInstance.post("/user/reviews", {
        productId: reviewItem.product?._id,
        orderId: reviewItem.orderId,
        orderItemId: reviewItem.itemId,
        rating: reviewRating,
        comment: reviewComment,
      });

      setSnackbar({
        open: true,
        message: "Review submitted",
        severity: "success",
      });

      setOpenReviewDialog(false);
      setReviewRating(0);
      setReviewComment("");
      loadOrders();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to submit review",
        severity: "error",
      });
    }
  };
  const submitRequest = async () => {
    if (reason.length === 0) {
      return setSnackbar({
        open: true,
        message: "Please enter a reason",
        severity: "warning",
      });
    }

    try {
      setActionLoading(true);

      const { orderId, itemId } = selectedItem;

      await axiosInstance.patch(
        `/user/orders/${orderId}/items/${itemId}/cancel`,
        {
          reason: reason.join(", "),
        },
      );

      setSnackbar({
        open: true,
        message: "Product cancelled",
        severity: "success",
      });

      setOpenDialog(false);
      loadOrders();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "error";
      case "SHIPPED":
        return "info";
      case "RETURN_REQUESTED":
      case "EXCHANGE_REQUESTED":
        return "secondary";
      default:
        return "warning";
    }
  };

  const getPaymentLabel = (group) => {
    if (group.paymentMethod === "COD") return "Cash on Delivery";
    return group.paymentStatus === "PAID" ? "Prepaid" : "Pending";
  };

  const getPaymentColor = (group) => {
    if (group.paymentMethod === "COD") return "warning";
    return group.paymentStatus === "PAID" ? "success" : "default";
  };

  /* ================= LOADING ================= */
  if (loading) {
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
  if (!orders.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Optional Image */}

        <Avatar
          src="https://via.placeholder.com/80"
          variant="rounded"
          sx={{
            width: 70,
            height: 70,
          }}
        />
        <Typography
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
            },
            fontWeight: 800,
          }}
        >
          No Orders Yet 📦
        </Typography>

        <Typography color="text.secondary">
          Looks like you haven't placed any orders yet.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  /* ================= UI ================= */
  return (
    <Box
      sx={{
        px: {
          xs: 1.5,
          sm: 2,
          md: 5,
        },
        py: {
          xs: 2,
          md: 4,
        },
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "1.6rem",
            sm: "2rem",
            md: "2.3rem",
          },
          fontWeight: 800,
          mb: 4,
        }}
      >
        My Orders
      </Typography>

      {orders.map((group) => {
        const items =
          group.orders
            ?.filter((order) => order.items?.length)
            .flatMap((order) =>
              (order.items || []).map((item) => ({
                ...item,
                orderId: order._id?.toString(),
                itemId: item._id?.toString(),
              })),
            ) || [];

        // ✅ HIDE EMPTY ORDER GROUPS
        if (!items.length) return null;

        return (
          <Card
            key={group._id}
            sx={{
              mb: 4,
              p: {
                xs: 1.5,
                sm: 2,
                md: 3,
              },
              borderRadius: 3,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <Stack
              direction={isMobile ? "column" : "row"}
              justifyContent="space-between"
              spacing={{
                xs: 1,
                sm: 2,
              }}
            >
              <Box>
                <Typography fontWeight={800}>
                  Order #{group._id.slice(-6).toUpperCase()}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Placed on {new Date(group.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Chip
                label={getPaymentLabel(group)}
                color={getPaymentColor(group)}
                sx={{
                  fontWeight: 700,
                  width: "fit-content",
                }}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* TABLE */}
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Table
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: 750,
                  tableLayout: "fixed",
                }}
              >
                <TableHead
                  sx={{
                    background: "#fafafa",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ width: "42%" }}>
                      <b>Product</b>
                    </TableCell>

                    <TableCell sx={{ width: "14%" }}>
                      <b>Price</b>
                    </TableCell>

                    <TableCell sx={{ width: "10%" }}>
                      <b>Qty</b>
                    </TableCell>

                    <TableCell sx={{ width: "14%" }}>
                      <b>Status</b>
                    </TableCell>

                    <TableCell sx={{ width: "20%" }}>
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((item) => {
                    const baseDate =
                      item.status === "DELIVERED" && item.deliveredAt
                        ? new Date(item.deliveredAt)
                        : new Date(group.createdAt);

                    const now = new Date();

                    const diffDays = Math.floor(
                      (now - baseDate) / (1000 * 60 * 60 * 24),
                    );

                    const cancelLimit =
                      orderPolicy?.cancellationWindowDays || 0;

                    const returnLimit = orderPolicy?.returnWindowDays || 0;

                    const exchangeLimit = orderPolicy?.exchangeWindowDays || 0;

                    const isCancelExpired = diffDays > cancelLimit;
                    const isReturnExpired = diffDays > returnLimit;
                    const isExchangeExpired = diffDays > exchangeLimit;

                    return (
                      <TableRow key={item._id} hover>
                        {/* PRODUCT */}
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Avatar
                              src={
                                item.productImage ||
                                item.product?.images?.[0]?.url ||
                                "https://via.placeholder.com/80"
                              }
                              variant="rounded"
                              sx={{
                                width: {
                                  xs: 55,
                                  sm: 65,
                                },
                                height: {
                                  xs: 55,
                                  sm: 65,
                                },
                                flexShrink: 0,
                              }}
                            />

                            <Box
                              sx={{
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <Typography
                                fontWeight={600}
                                onClick={() => {
                                  if (item.product?._id) {
                                    navigate(`/product/${item.product._id}`);
                                  }
                                }}
                                sx={{
                                  cursor: "pointer",
                                  fontSize: {
                                    xs: "0.88rem",
                                    sm: "1rem",
                                  },
                                  lineHeight: 1.4,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  wordBreak: "break-word",
                                }}
                              >
                                {item.product?.name || "Product"}
                              </Typography>

                              {item.exchangeStatus === "REQUESTED" && (
                                <Typography
                                  color="error"
                                  variant="caption"
                                  display="block"
                                >
                                  🔄 Original (Exchange Requested)
                                </Typography>
                              )}

                              {item.isExchangeItem && (
                                <Typography
                                  color="success.main"
                                  variant="caption"
                                  display="block"
                                >
                                  ✅ Replacement Item
                                </Typography>
                              )}

                              <Typography
                                sx={{
                                  fontSize: {
                                    xs: "0.72rem",
                                    sm: "0.8rem",
                                  },
                                  mt: 0.5,
                                }}
                                color="text.secondary"
                              >
                                {item.selectedSize &&
                                  `Size: ${item.selectedSize}`}

                                {item.selectedColor &&
                                  ` | Color: ${item.selectedColor}`}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* PRICE */}
                        <TableCell>
                          <Typography fontWeight={600}>
                            ₹{item.price}
                          </Typography>
                        </TableCell>

                        {/* QTY */}
                        <TableCell>
                          <Typography fontWeight={600}>
                            {item.quantity}
                          </Typography>
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                          <Chip
                            label={
                              item.exchangeStatus === "REQUESTED"
                                ? "EXCHANGE REQUESTED"
                                : item.isExchangeItem
                                  ? "EXCHANGE ITEM"
                                  : item.status
                            }
                            color={getStatusColor(item.status)}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              maxWidth: "100%",
                            }}
                          />
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell>
                          <Stack
                            spacing={1}
                            sx={{
                              minWidth: {
                                xs: 120,
                                sm: 150,
                              },
                            }}
                          >
                            {item.status === "PLACED" && (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                disabled={isCancelExpired}
                                onClick={() =>
                                  handleAction(
                                    item.orderId,
                                    item,
                                    "cancel",
                                    group.paymentMethod,
                                  )
                                }
                              >
                                {isCancelExpired ? "Cancel Closed" : "Cancel"}
                              </Button>
                            )}

                            {item.status === "DELIVERED" &&
                              item.exchangeStatus !== "REQUESTED" && (
                                <>
                                  <Button
                                    size="small"
                                    color="warning"
                                    variant="contained"
                                    disabled={isReturnExpired}
                                    startIcon={<ReplayIcon />}
                                    onClick={() =>
                                      handleAction(
                                        item.orderId,
                                        item,
                                        "return",
                                        group.paymentMethod,
                                      )
                                    }
                                  >
                                    {isReturnExpired
                                      ? "Return Closed"
                                      : "Return"}
                                  </Button>

                                  <Button
                                    size="small"
                                    color="secondary"
                                    variant="contained"
                                    disabled={isExchangeExpired}
                                    startIcon={<AutorenewIcon />}
                                    onClick={() =>
                                      handleAction(
                                        item.orderId,
                                        item,
                                        "exchange",
                                        group.paymentMethod,
                                      )
                                    }
                                  >
                                    {isExchangeExpired
                                      ? "Exchange Closed"
                                      : "Exchange"}
                                  </Button>

                                  {!item.reviewed ? (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleReviewOpen(item)}
                                    >
                                      ⭐ Review
                                    </Button>
                                  ) : (
                                    <Chip
                                      label="Reviewed"
                                      color="success"
                                      size="small"
                                    />
                                  )}
                                </>
                              )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* TOTAL */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: {
                  xs: "flex-start",
                  sm: "flex-end",
                },
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                (Inclusive of all charges)
              </Typography>

              <Typography fontSize={14}>
                Delivery:{" "}
                {group.deliveryCharge === 0
                  ? "FREE"
                  : `₹${group.deliveryCharge || 0}`}
              </Typography>

              <Divider
                sx={{
                  my: 1,
                  width: {
                    xs: "100%",
                    sm: 180,
                  },
                }}
              />

              <Typography
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.2rem",
                  },
                }}
              >
                Total: ₹
                {group.totalAmount ||
                  (group.itemsTotal || 0) + (group.deliveryCharge || 0)}
              </Typography>
            </Box>
          </Card>
        );
      })}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => {
            setPage(value);
          }}
          color="primary"
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: {
              xs: 0,
              sm: 4,
            },
            width: {
              xs: "100%",
              sm: "90%",
              md: "700px",
            },
            m: 0,
          },
        }}
      >
        {/* TITLE */}

        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
            },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReportProblemIcon color="warning" />
          {actionType === "cancel"
            ? "Cancel Please tell us why you want to cancel this item."
            : actionType === "return"
              ? "Return Item"
              : "Exchange Item"}
        </DialogTitle>
        {/* SUBTEXT */}
        <Typography sx={{ px: 3, pb: 1 }} color="text.secondary">
          Please tell us why you want to{" "}
          {actionType === "cancel"
            ? "cancel"
            : actionType === "return"
              ? "return"
              : "exchange"}{" "}
          this item.
        </Typography>

        <DialogContent sx={{ pt: 1 }}>
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              background: "#fafafa",
            }}
          >
            <Typography
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              Select Cancellation Reason
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
                {cancelReasons.map((item) => (
                  <FormControlLabel
                    key={item}
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
                    label={
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.88rem",
                            sm: "0.95rem",
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={submitRequest}
            disabled={actionLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            {actionLoading ? "Processing..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: {
              xs: 0,
              sm: 4,
            },
            width: {
              xs: "100%",
              sm: "90%",
              md: "700px",
            },
            m: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.4rem" },
          }}
        >
          Write Review
        </DialogTitle>

        <DialogContent>
          <Typography mb={1} fontWeight={600}>
            Rating
          </Typography>

          <Rating
            value={reviewRating}
            onChange={(e, newValue) => setReviewRating(newValue)}
            size={isMobile ? "medium" : "large"}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{
              mt: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1.5,
          }}
        >
          <Button
            fullWidth={isMobile}
            onClick={() => setOpenReviewDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              py: 1,
              whiteSpace: "nowrap",
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={submitReview}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default MyOrders;
