import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const initialForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
  };

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, phoneNo } = form;

    if (!name || !email || !password || !confirmPassword || !phoneNo) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone validation
    if (!phoneRegex.test(phoneNo)) {
      return "Invalid phone number";
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/user/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNo: form.phoneNo,
      });

      console.log("Registration success:", response.data);

      setForm(initialForm);
      localStorage.setItem("verifyEmail", form.email);
      navigate("/OtpVerify");
    } catch (err) {
      console.log("FULL ERROR:", err.response);
      console.log("ERROR DATA:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
        backgroundImage:
          "radial-gradient(circle at top, #ffffff 0%, #f6f6f6 60%)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 980,
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
            Join Vastraa
          </Typography>

          <Typography fontSize={15} mb={4}>
            Create an account and enjoy seamless shopping.
          </Typography>

          <Box mt={5}>
            <Typography fontWeight={900} fontSize={22}>
              Vastraa
            </Typography>
            <Typography fontSize={13}>Fashion you’ll love</Typography>
          </Box>
        </Box>

        {/* RIGHT FORM PANEL */}
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            flex: 1,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Create Account
          </Typography>

          <Typography color="text.secondary" fontSize={14} mb={3}>
            Enter your details to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="new email"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new password"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={form.phoneNo}
            onChange={handleChange}
            autoComplete="new phoneNo"
            sx={{ mb: 3 }}
          />

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
              "CREATE ACCOUNT"
            )}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography fontSize={14} align="center">
            Already have an account?{" "}
            <Typography
              component="span"
              sx={{ color: "#ff7a18", fontWeight: 700, cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
