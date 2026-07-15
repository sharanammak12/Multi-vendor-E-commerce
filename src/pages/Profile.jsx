import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUser(res.data.data);
        setFormData(res.data.data);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axiosInstance.put("/user/profile", formData);
      setUser(res.data.data); // update UI immediately
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={45} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        px: { xs: 2, sm: 3, md: 8 },
        py: { xs: 4, md: 6 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 650,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 75,
                height: 75,
                fontSize: 26,
                bgcolor: "#111827",
                color: "white",
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || <AccountCircleIcon />}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {user.email}
              </Typography>
              <Chip
                label="Active Account"
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: "#ecfdf5",
                  color: "#065f46",
                }}
              />
            </Box>
          </Box>

          {!editing ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ textTransform: "none" }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ textTransform: "none" }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => {
                  setEditing(false);
                  setFormData(user);
                }}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>

        <Divider />

        {/* Details Section */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {editing ? (
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phoneNo"
                value={formData.phoneNo || ""}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          ) : (
            <>
              <Typography fontSize={13} color="text.secondary">
                Full Name
              </Typography>
              <Typography fontWeight={600} mb={3}>
                {user.name}
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                Email Address
              </Typography>
              <Typography fontWeight={600} mb={3}>
                {user.email}
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                Phone Number
              </Typography>
              <Typography fontWeight={600}>
                {user.phoneNo || "Not Provided"}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
