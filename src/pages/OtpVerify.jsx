import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const OtpVerify = () => {
  const navigate = useNavigate();
  
  const email = localStorage.getItem("verifyEmail");
  const [successMessage, setSuccessMessage] = useState("");

  if (!email) {
  navigate("/login");
}

  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);
    setError("");

    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/user/verify-email", { email, otp: otpValue });
      localStorage.removeItem("verifyEmail");

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
  try {
    setResendLoading(true);
    setError("");
    setSuccessMessage("");

    await axiosInstance.post("/user/resend-otp", {
      email,
      type: "VERIFY_EMAIL",
    });

    setSuccessMessage("OTP resent successfully. Please check your email.");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to resend OTP");
  } finally {
    setResendLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
        }}
      >
        {/* LEFT PANEL */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            px: 7,
            background: "linear-gradient(135deg, #ffb26b, #ff7a18)",
            color: "#4a260f",
          }}
        >
          <Typography variant="h4" fontWeight={800} mb={1}>
            Verify OTP
          </Typography>
          <Typography fontSize={15}>
            We’ve sent a 6-digit verification code to your email.
          </Typography>

          <Box mt={5}>
            <Typography fontWeight={900} fontSize={22}>
              Vastraa
            </Typography>
            <Typography fontSize={13}>Fashion you’ll love</Typography>
          </Box>
        </Box>

        {/* RIGHT PANEL */}
        <Box
          component="form"
          onSubmit={handleVerifyOtp}
          sx={{
            flex: 1,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={1}>
            Enter OTP
          </Typography>

          <Typography color="text.secondary" fontSize={14} mb={3}>
            Please enter the 6-digit code sent to your email
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
         <Alert severity="success" sx={{ mb: 2 }}>
         {successMessage}
         </Alert>
         )}

          {/* OTP INPUTS */}
          <Box display="flex" justifyContent="space-between" mb={4}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                maxLength={1}
                style={{
                  width: "48px",
                  height: "56px",
                  fontSize: "20px",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: "1.5px solid #ddd",
                  outline: "none",
                  fontWeight: 700,
                }}
              />
            ))}
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.4,
              fontWeight: 700,
              backgroundColor: "#ff7a18",
              "&:hover": { backgroundColor: "#e86912" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "VERIFY OTP"
            )}
          </Button>

          <Typography
            fontSize={14}
            align="center"
            mt={3}
            sx={{ cursor: "pointer", color: "#ff7a18", fontWeight: 600 }}
            onClick={handleResendOtp}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default OtpVerify;
