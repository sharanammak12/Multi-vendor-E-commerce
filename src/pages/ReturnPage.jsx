import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ReturnPage = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ INITIAL PAYMENT METHOD (FROM NAVIGATION)
  const [paymentMethod, setPaymentMethod] = useState(
    location.state?.paymentMethod || "",
  );

  const [reason, setReason] = useState([]);
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const returnReasons = [
    "Product damaged",
    "Wrong item received",
    "Size does not fit",
    "Color different from expected",
    "Quality not as expected",
    "Received defective product",
    "Changed my mind",
    "Product arrived too late",
  ];
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= FIX: HANDLE REFRESH ================= */
  useEffect(() => {
    if (!paymentMethod) {
      const fetchPaymentMethod = async () => {
        try {
          setFetching(true);

          const res = await axiosInstance.get("/user/orders");

          const foundOrder = res.data.orders
            ?.flatMap((group) => group.orders || [])
            ?.find((order) => order._id === orderId);

          if (foundOrder) {
            setPaymentMethod(foundOrder.paymentMethod);
          }
        } catch (err) {
          console.error("Failed to fetch payment method", err);
        } finally {
          setFetching(false);
        }
      };

      fetchPaymentMethod();
    }
  }, [orderId, paymentMethod]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (reason.length === 0) {
      return setSnackbar({
        open: true,
        message: "Please enter a reason",
        severity: "warning",
      });
    }

    let payload = {
      reason: reason.join(", "),
    };

    // ✅ COD → REQUIRE BANK DETAILS
    if (paymentMethod === "COD") {
      if (!bankAccountNumber || !bankIFSC || !bankName || !accountHolderName) {
        return setSnackbar({
          open: true,
          message: "Please fill all bank details",
          severity: "warning",
        });
      }

      payload.refundDetails = {
        method: "BANK",
        bankAccountNumber,
        bankIFSC,
        bankName,
        accountHolderName,
      };
    }

    try {
      setLoading(true);

      await axiosInstance.patch(
        `/user/orders/${orderId}/items/${itemId}/return`,
        payload,
      );

      setSnackbar({
        open: true,
        message: "Return requested successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING STATE ================= */
  if (fetching) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  /* ================= UI ================= */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f7fa",
        px: { xs: 1.5, sm: 3, md: 5 },
        py: { xs: 2, sm: 4 },
      }}
    >
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
        {/* HEADER */}
        <Typography
          variant="h5"
          fontWeight={800}
          mb={1}
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem" },
          }}
        >
          Return Item
        </Typography>

        <Typography
          color="text.secondary"
          mb={3}
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Select the reason for your return request
        </Typography>

        {/* RETURN REASONS */}
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            background: "#fafafa",
          }}
        >
          <Typography fontWeight={700} mb={2}>
            Return Reasons
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
                gap: 1.5,
              }}
            >
              {returnReasons.map((item) => (
                <FormControlLabel
                  key={item}
                  sx={{
                    m: 0,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
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
                        fontSize: { xs: "0.9rem", sm: "1rem" },
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

        {/* COD BANK DETAILS */}
        {paymentMethod === "COD" && (
          <Box
            mt={4}
            sx={{
              border: "1px solid #ffd6d6",
              background: "#fff5f5",
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              color="error"
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              Refund will be processed manually. Enter bank details.
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Account Number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />

              <TextField
                fullWidth
                label="IFSC Code"
                value={bankIFSC}
                onChange={(e) => setBankIFSC(e.target.value)}
              />

              <TextField
                fullWidth
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />

              <TextField
                fullWidth
                label="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </Stack>
          </Box>
        )}

        {/* BUTTONS */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => navigate("/orders")}
            sx={{
              py: 1.3,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              py: 1.3,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {loading ? "Processing..." : "Submit Return"}
          </Button>
        </Stack>
      </Card>

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

export default ReturnPage;
