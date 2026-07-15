import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CARD_HEIGHT = 320;

const Addresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnack = (message, severity = "info") => {
    setSnack({ open: true, message, severity });
  };

  /* ================= FETCH ================= */
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/address");

      const sorted = [...(res.data.addresses || [])].sort(
        (a, b) => b.isDefault - a.isDefault,
      );

      setAddresses(sorted);
    } catch (err) {
      console.error(err);
      showSnack("Failed to load addresses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id, isDefault) => {
    if (!isDefault) {
      const ok = window.confirm("Delete this address?");
      if (!ok) return;
    }

    try {
      const res = await axiosInstance.delete(`/user/address/${id}`);

      if (res.data?.addresses) {
        const sorted = [...res.data.addresses].sort(
          (a, b) => b.isDefault - a.isDefault,
        );
        setAddresses(sorted);
        showSnack(res.data.message || "Address deleted", "success");
      } else {
        showSnack(res.data.message || "Action not allowed", "warning");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to delete address";
      showSnack(msg, "error");
    }
  };

  /* ================= MAKE DEFAULT ================= */
  const handleMakeDefault = async (id) => {
    try {
      await axiosInstance.put(`/user/address/${id}`, { isDefault: true });
      showSnack("Address set as default", "success");
      fetchAddresses();
    } catch (err) {
      showSnack("Failed to set default address", "error");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f6f8", py: 6, px: 2 }}>
      <Box maxWidth="1350px" mx="auto">
        <Typography variant="h4" fontWeight={700}>
          Your Addresses
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Manage your saved delivery addresses
        </Typography>

        <Divider sx={{ my: 4 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} alignItems="stretch">
            {/* ================= ADDRESS CARDS ================= */}
            {addresses.map((addr) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={addr._id}
                sx={{ display: "flex" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: 320,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={700}>{addr.fullName}</Typography>

                      {addr.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Box>

                    <Typography
                      mt={1.5}
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: 48,
                      }}
                    >
                      {addr.addressLine}
                    </Typography>

                    <Typography color="text.secondary">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </Typography>

                    <Typography mt={2}>📞 {addr.phoneNo}</Typography>
                    <Typography>✉ {addr.email}</Typography>
                  </Box>

                  <Stack direction="row" spacing={1} mt={3} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate("/add-address", {
                          state: { address: addr, from: "addresses" },
                        })
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(addr._id, addr.isDefault)}
                    >
                      Delete
                    </Button>

                    {!addr.isDefault && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleMakeDefault(addr._id)}
                      >
                        Make Default
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            ))}

            {/* ================= ADD NEW ================= */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                onClick={() =>
                  navigate("/add-address", { state: { from: "addresses" } })
                }
                sx={{
                  height: CARD_HEIGHT,
                  borderRadius: 3,
                  border: "2px dashed #b0bec5",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "0.25s",
                  "&:hover": {
                    backgroundColor: "#f0f7ff",
                    borderColor: "#1976d2",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  <AddLocationAltIcon sx={{ fontSize: 56, color: "#1976d2" }} />
                  <Typography fontWeight={700}>Add New Address</Typography>
                  <Typography
                    fontSize={13}
                    color="text.secondary"
                    align="center"
                  >
                    Save a new delivery location
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
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

export default Addresses;
