import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(`/user/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      alert("Password reset successful ✅");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Reset link is invalid or expired"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Reset Password
        </Typography>

        <Typography fontSize={14} color="text.secondary" mb={3}>
          Enter your new password below
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          disabled={loading}
          onClick={handleResetPassword}
          sx={{
            py: 1.3,
            fontWeight: 700,
            backgroundColor: "#ff7a18",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#e86912",
            },
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <Typography
          align="center"
          fontSize={13}
          color="text.secondary"
          mt={3}
        >
          You will be redirected to login after reset
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResetPassword;