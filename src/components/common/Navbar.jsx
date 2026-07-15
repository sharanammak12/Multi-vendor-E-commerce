import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  SwipeableDrawer,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

/* ===================== CATEGORIES ===================== */
const categories = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Kids", slug: "kids" },
  { label: "Festival Offers", slug: "festival" },
  { label: "New Arrivals", slug: "new" },
  { label: "Trending", slug: "trending" },
  { label: "Topwear", slug: "topwear" },
  { label: "Bottomwear", slug: "bottomwear" },
  { label: "Ethnic Wear", slug: "ethnic" },
  { label: "Western Wear", slug: "western" },
  { label: "School Uniforms", slug: "schooluniform" },
  { label: "Nightwear", slug: "nightwear" },
  { label: "Brands", slug: "brands" },
  { label: "Sale", slug: "sale" },
];
const mobileItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
  cursor: "pointer",
  color: "#fff",
  opacity: 0.9,
  "&:hover": {
    opacity: 1,
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  /* ✅ FIXED CONTEXT USAGE */
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleNavigate = (slug) => {
    navigate(`/category/${slug}`);
    setOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: { xs: 56, md: 70 }, // EXACT header height
          height: 52,
          backgroundColor: "#232f3e",
          zIndex: (theme) => theme.zIndex.appBar,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <Toolbar
          sx={{
            height: 56,

            px: { xs: 1.5, md: 4 },
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* LEFT : MENU */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              fontWeight={700}
              fontSize={14}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              All
            </Typography>
          </Box>

          {/* CENTER : CATEGORIES (DESKTOP ONLY) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              gap: 3.5,
              ml: 4,
              alignItems: "center",
            }}
          >
            {categories.map((item) => {
              const isActive = location.pathname === `/category/${item.slug}`;

              return (
                <Typography
                  key={item.slug}
                  onClick={() => handleNavigate(item.slug)}
                  sx={{
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color:
                      item.slug === "festival"
                        ? "#ff9800"
                        : item.slug === "sale"
                          ? "#f3a847"
                          : "#fff",
                    "&:hover": {
                      color: "#f3a847",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Box>

          {/* RIGHT : ICONS */}
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            {isLoggedIn && (
              <>
                <IconButton
                  onClick={() => navigate("/wishlist")}
                  sx={{
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Badge badgeContent={wishlist.length} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={() => navigate("/cart")}
                  sx={{
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Badge badgeContent={cartItems.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* ===================== MOBILE BOTTOM NAV ===================== */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64, // slightly taller for 5 items
          display: { xs: "flex", md: "none" },
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#232f3e",
          color: "#fff",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          zIndex: 1200,
          pb: "env(safe-area-inset-bottom)",
        }}
      >
        {/* HOME */}
        <Box onClick={() => navigate("/")} sx={mobileItem}>
          <HomeOutlinedIcon />
          <Typography fontSize={10}>Home</Typography>
        </Box>

        {/* CATEGORIES */}
        <Box onClick={() => setOpen(true)} sx={mobileItem}>
          <CategoryOutlinedIcon />
          <Typography fontSize={10}>Categories</Typography>
        </Box>
        {isLoggedIn && (
          <>
            <Box onClick={() => navigate("/wishlist")} sx={mobileItem}>
              <Badge badgeContent={wishlist.length} color="error">
                <FavoriteBorderIcon />
              </Badge>
              <Typography fontSize={10}>Wishlist</Typography>
            </Box>

            <Box onClick={() => navigate("/cart")} sx={mobileItem}>
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
              <Typography fontSize={10}>Cart</Typography>
            </Box>
          </>
        )}

        {/* ACCOUNT */}
        <Box onClick={() => navigate("/account")} sx={mobileItem}>
          <PersonOutlineOutlinedIcon />
          <Typography fontSize={10}>Account</Typography>
        </Box>
      </Box>

      {/* ===================== DRAWER ===================== */}
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: 1300,
          "& .MuiDrawer-paper": {
            width: 320,

            /* ✅ CORRECT WAY */
            top: {
              xs: 112, // mobile header + search bar
              md: 120, // desktop header + navbar
            },

            height: {
              xs: "calc(100% - 112px)",
              md: "calc(100% - 120px)",
            },

            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          },
        }}
      >
        <Divider />

        {categories.map((item) => (
          <Box
            key={item.slug}
            onClick={() => handleNavigate(item.slug)}
            sx={{
              px: 3,
              py: 2.2,
              cursor: "pointer",
              fontSize: 15,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            {item.label}
          </Box>
        ))}
      </SwipeableDrawer>
    </>
  );
};

export default Navbar;
