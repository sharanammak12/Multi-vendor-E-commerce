import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AddAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.address || null;
  const from = location.state?.from;

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  /* ================= REGEX ================= */
  const regex = {
    fullName: /^[A-Za-z ]{3,}$/,
    phoneNo: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    pincode: /^\d{6}$/,
  };

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    let temp = {};

    if (!regex.fullName.test(formData.fullName))
      temp.fullName = "Enter a valid full name";

    if (!regex.phoneNo.test(formData.phoneNo))
      temp.phoneNo = "Enter valid 10-digit mobile number";

    if (!regex.email.test(formData.email))
      temp.email = "Enter a valid email address";

    if (!formData.addressLine || formData.addressLine.length < 10)
      temp.addressLine = "Address must be at least 10 characters";

    if (!regex.pincode.test(formData.pincode))
      temp.pincode = "Enter valid 6-digit pincode";

    if (!formData.city) temp.city = "City is required";
    if (!formData.state) temp.state = "State is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ================= PINCODE LOOKUP ================= */
  const fetchFromPincode = async (pin) => {
    if (!regex.pincode.test(pin)) return;

    try {
      setPincodeLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPincodeLoading(false);
    }
  };

  /* ================= LIVE LOCATION ================= */
  const detectLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await res.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
            addressLine: data.display_name || "",
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (editData?._id) {
        await axiosInstance.put(`/user/address/${editData._id}`, formData);
      } else {
        await axiosInstance.post("/user/address", formData);
      }

      if (from === "checkout") {
        navigate("/checkout", {
          state: location.state,
        });
      } else {
        navigate("/addresses");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#fff", py: 8, px: 3 }}>
      <Box maxWidth="900px" mx="auto">
        <Typography variant="h4" fontWeight={700} mb={4}>
          {editData ? "Update Address" : "Add New Address"}
        </Typography>

        <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Button
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={detectLocation}
              disabled={locating}
            >
              {locating ? "Detecting location..." : "Use Current Location"}
            </Button>

            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />

            <TextField
              label="Mobile Number"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              error={!!errors.phoneNo}
              helperText={errors.phoneNo}
            />

            <TextField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Address Line"
              name="addressLine"
              multiline
              rows={3}
              value={formData.addressLine}
              onChange={handleChange}
              error={!!errors.addressLine}
              helperText={errors.addressLine}
            />

            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={(e) => fetchFromPincode(e.target.value)}
              error={!!errors.pincode}
              helperText={
                errors.pincode || (pincodeLoading && "Fetching city & state...")
              }
            />

            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />

            <TextField
              select
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
            >
              <MenuItem value="Karnataka">Karnataka</MenuItem>
              <MenuItem value="Maharashtra">Maharashtra</MenuItem>
              <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
              }
              label="Make this my default address"
            />
          </Stack>

          <Divider sx={{ my: 5 }} />

          <Box display="flex" gap={3}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editData ? (
                "Save Changes"
              ) : (
                "Add Address"
              )}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                if (from === "checkout") {
                  navigate("/checkout", {
                    state: location.state,
                  });
                } else {
                  navigate("/addresses");
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddAddress;
