import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/contact", form);
      setOpen(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f5f7ff, #ffffff)",
        px: { xs: 2, md: 6 },
        py: 6,
      }}
    >
      <Box maxWidth="1200px" mx="auto">
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
          Contact Vastraa
        </Typography>

        <Typography textAlign="center" color="text.secondary" mb={5}>
          We’re here to help you with orders, returns, and product queries
        </Typography>

        <Grid container spacing={4}>
          {/* LEFT SIDE - CONTACT INFO */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Vastraa Store Support
              </Typography>

              <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#4f46e5" }}>
                  <LocationOnIcon />
                </Avatar>
                <Typography>
                  Vastraa Fashion House,
                  <br />
                  2nd Floor, City Center Mall,
                  <br />
                  Belagavi, Karnataka – 590014
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#4f46e5" }}>
                  <PhoneIcon />
                </Avatar>
                <Typography>+91 9380639997</Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#4f46e5" }}>
                  <EmailIcon />
                </Avatar>
                <Typography>support@vastraa.in</Typography>
              </Box>

              <Typography mt={4} color="text.secondary">
                Our support team usually responds within{" "}
                <strong>24 hours</strong>. Reach out to us for help with orders,
                sizing, returns, or delivery concerns.
              </Typography>
            </Paper>
          </Grid>

          {/* RIGHT SIDE - FORM */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Send Us a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      multiline
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      endIcon={<SendIcon />}
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        backgroundColor: "#4f46e5",
                        "&:hover": { backgroundColor: "#4338ca" },
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Thanks for contacting Vastraa! We’ll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
