// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";

// import {
//   Box,
//   Typography,
//   Paper,
//   CircularProgress,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Chip,
//   Divider,
//   Stack,
// } from "@mui/material";

// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import LogoutIcon from "@mui/icons-material/Logout";

// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";

// const Account = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart } = useCart();
//   const { wishlist, resetWishlist } = useWishlist();

//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [ordersCount, setOrdersCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [logoutDialog, setLogoutDialog] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       const token = localStorage.getItem("token");

//       // wait until token exists
//       if (!token || token === "undefined") {
//         return;
//       }

//       try {
//         const profile = await axiosInstance.get("/user/profile");

//         const orderRes = await axiosInstance.get("/user/recent-orders");

//         setUser(profile?.data?.data);

//         setOrders(orderRes?.data?.orders || []);

//         setOrdersCount(orderRes?.data?.totalOrders || 0);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");

//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [navigate]);
//   const handleLogout = async () => {
//     try {
//       // CLEAR REFRESH TOKEN COOKIE
//       await axiosInstance.post("/user/logout");
//     } catch (err) {
//       console.error("Logout failed", err);
//     }

//     // REMOVE ACCESS TOKEN
//     localStorage.removeItem("token");

//     // CLEAR FRONTEND STATES
//     clearCart();

//     resetWishlist();

//     // UPDATE HEADER/NAVBAR LOGIN STATE
//     window.dispatchEvent(new Event("storage"));

//     navigate("/login", { replace: true });
//   };
//   /* ================= BIG CARD ================= */
//   const AccountCard = ({ title, subtitle, icon, count, onClick, danger }) => (
//     <Paper
//       onClick={onClick}
//       sx={{
//         p: 4,
//         borderRadius: 4,
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         cursor: "pointer",
//         border: "1px solid #e3e8f0",
//         minHeight: 130,
//         transition: "0.3s",
//         "&:hover": {
//           transform: "translateY(-6px)",
//           boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
//         },
//       }}
//     >
//       <Stack direction="row" spacing={3} alignItems="center">
//         <Avatar
//           sx={{
//             width: 60,
//             height: 60,
//             bgcolor: danger ? "#ffe5e5" : "#e8f0fe",
//             color: danger ? "#d32f2f" : "#2563eb",
//           }}
//         >
//           {icon}
//         </Avatar>

//         <Box>
//           <Typography fontWeight={700} fontSize={18}>
//             {title}
//           </Typography>
//           <Typography fontSize={14} color="text.secondary">
//             {subtitle}
//           </Typography>
//         </Box>
//       </Stack>

//       {count !== undefined && (
//         <Chip
//           label={count}
//           sx={{
//             fontWeight: 700,
//             fontSize: 14,
//             px: 1.5,
//             bgcolor: "#e8f0fe",
//             color: "#2563eb",
//           }}
//         />
//       )}
//     </Paper>
//   );

//   if (loading) {
//     return (
//       <Box
//         minHeight="70vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
//   const recentOrders = orders;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#f4f7fb",
//         px: { xs: 2, md: 5 },
//         py: 5,
//       }}
//     >
//       <Box maxWidth="1350px" mx="auto">
//         {/* ================= TOP ================= */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
//             gap: 4,
//             mb: 5,
//           }}
//         >
//           {/* PROFILE */}
//           <Paper
//             sx={{
//               p: 5,
//               borderRadius: 4,
//               textAlign: "center",
//               border: "1px solid #e3e8f0",
//             }}
//           >
//             <Avatar
//               sx={{
//                 width: 100,
//                 height: 100,
//                 mx: "auto",
//                 mb: 2,
//                 fontSize: 36,
//                 bgcolor: "#2563eb",
//               }}
//             >
//               {userInitial}
//             </Avatar>

//             <Typography fontWeight={700} fontSize={20}>
//               {user?.name}
//             </Typography>

//             <Typography fontSize={15} color="text.secondary">
//               {user?.email}
//             </Typography>

//             <Button
//               variant="outlined"
//               size="medium"
//               sx={{ mt: 2, borderRadius: 2 }}
//               onClick={() => navigate("/profile")}
//             >
//               Edit Profile
//             </Button>
//           </Paper>

//           {/* CARDS */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "repeat(2,1fr)",
//                 md: "repeat(3,1fr)",
//               },
//               gap: 3,
//             }}
//           >
//             <AccountCard
//               title="Orders"
//               subtitle="Track & manage orders"
//               icon={<ShoppingBagIcon />}
//               count={ordersCount}
//               onClick={() => navigate("/orders")}
//             />

//             <AccountCard
//               title="Cart"
//               subtitle="Items ready to checkout"
//               icon={<ShoppingCartIcon />}
//               count={cartItems.length}
//               onClick={() => navigate("/cart")}
//             />

//             <AccountCard
//               title="Wishlist"
//               subtitle="Saved items"
//               icon={<FavoriteBorderIcon />}
//               count={wishlist?.length || 0}
//               onClick={() => navigate("/wishlist")}
//             />

//             <AccountCard
//               title="Addresses"
//               subtitle="Manage delivery locations"
//               icon={<LocationOnIcon />}
//               onClick={() => navigate("/addresses")}
//             />

//             <AccountCard
//               title="Support"
//               subtitle="Help & contact"
//               icon={<SupportAgentIcon />}
//               onClick={() => navigate("/support")}
//             />

//             <AccountCard
//               title="Logout"
//               subtitle="Sign out securely"
//               icon={<LogoutIcon />}
//               danger
//               onClick={() => setLogoutDialog(true)}
//             />
//           </Box>
//         </Box>

//         {/* ================= RECENT ORDERS ================= */}
//         <Paper
//           sx={{
//             p: 4,
//             borderRadius: 4,
//             border: "1px solid #e3e8f0",
//           }}
//         >
//           <Typography fontWeight={700} fontSize={20} mb={3}>
//             Recent Orders
//           </Typography>

//           {recentOrders.length === 0 ? (
//             <Typography color="text.secondary">No recent orders</Typography>
//           ) : (
//             recentOrders.map((order, i) => {
//               const firstItem = order.orders?.[0]?.items?.[0];

//               return (
//                 <Box key={i} mb={3}>
//                   <Stack direction="row" spacing={3} alignItems="center">
//                     <Avatar
//                       variant="rounded"
//                       src={
//                         firstItem?.product?.images?.[0]?.url ||
//                         "https://via.placeholder.com/80"
//                       }
//                       sx={{ width: 70, height: 70 }}
//                     />

//                     <Box flex={1}>
//                       <Typography fontWeight={600} fontSize={16}>
//                         {firstItem?.product?.name || "Product"}
//                       </Typography>

//                       <Typography fontSize={13} color="text.secondary">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </Typography>
//                     </Box>

//                     <Typography fontWeight={700} fontSize={16}>
//                       ₹{order.totalAmount}
//                     </Typography>

//                     <Chip
//                       label={order.paymentStatus || "PLACED"}
//                       color="primary"
//                     />
//                   </Stack>

//                   {i !== recentOrders.length - 1 && <Divider sx={{ mt: 2 }} />}
//                 </Box>
//               );
//             })
//           )}

//           <Button sx={{ mt: 2 }} onClick={() => navigate("/orders")}>
//             View All Orders
//           </Button>
//         </Paper>
//       </Box>

//       {/* LOGOUT */}
//       <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
//         <DialogTitle>Logout?</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to logout?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
//           <Button color="error" variant="contained" onClick={handleLogout}>
//             Logout
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Account;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Account = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();
  const { wishlist, resetWishlist } = useWishlist();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      // wait until token exists
      if (!token || token === "undefined") {
        return;
      }

      try {
        const profile = await axiosInstance.get("/user/profile");

        const orderRes = await axiosInstance.get("/user/recent-orders");

        setUser(profile?.data?.data);

        setOrders(orderRes?.data?.orders || []);

        setOrdersCount(orderRes?.data?.totalOrders || 0);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // CLEAR REFRESH TOKEN COOKIE
      await axiosInstance.post("/user/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }

    // REMOVE ACCESS TOKEN
    localStorage.removeItem("token");

    // CLEAR FRONTEND STATES
    clearCart();

    resetWishlist();

    // UPDATE HEADER/NAVBAR LOGIN STATE
    window.dispatchEvent(new Event("storage"));

    navigate("/login", { replace: true });
  };

  /* ================= ACCOUNT CARD ================= */

  const AccountCard = ({ title, subtitle, icon, count, onClick, danger }) => (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: { xs: 2.2, sm: 3 },
        borderRadius: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        minHeight: { xs: 100, sm: 120 },
        transition: "all 0.25s ease",
        background: "#fff",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: { xs: 48, sm: 58 },
            height: { xs: 48, sm: 58 },
            bgcolor: danger ? "#ffe5e5" : "#eff6ff",
            color: danger ? "#d32f2f" : "#2563eb",
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography fontWeight={700} fontSize={{ xs: 15, sm: 17 }}>
            {title}
          </Typography>

          <Typography fontSize={{ xs: 12, sm: 13 }} color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {count !== undefined && (
          <Chip
            label={count}
            sx={{
              fontWeight: 700,
              bgcolor: "#eff6ff",
              color: "#2563eb",
            }}
          />
        )}

        <ArrowForwardIosIcon
          sx={{
            fontSize: 14,
            color: "#9ca3af",
          }}
        />
      </Stack>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        minHeight="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const recentOrders = orders;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        px: { xs: 1.5, sm: 3, md: 5 },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box maxWidth="1400px" mx="auto">
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "320px 1fr",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* ================= PROFILE ================= */}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 5,
              border: "1px solid #e5e7eb",
              textAlign: "center",
              background: "linear-gradient(180deg,#ffffff 0%, #f8fbff 100%)",
            }}
          >
            <Avatar
              sx={{
                width: { xs: 90, sm: 110 },
                height: { xs: 90, sm: 110 },
                mx: "auto",
                mb: 2,
                fontSize: { xs: 32, sm: 40 },
                bgcolor: "#2563eb",
                boxShadow: "0 10px 25px rgba(37,99,235,0.3)",
              }}
            >
              {userInitial}
            </Avatar>

            <Typography fontWeight={700} fontSize={{ xs: 20, sm: 24 }}>
              {user?.name}
            </Typography>

            <Typography
              fontSize={{ xs: 13, sm: 14 }}
              color="text.secondary"
              sx={{
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {user?.email}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </Button>
          </Paper>

          {/* ================= ACTION CARDS ================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                xl: "repeat(3,1fr)",
              },
              gap: 2.5,
            }}
          >
            <AccountCard
              title="Orders"
              subtitle="Track & manage orders"
              icon={<ShoppingBagIcon />}
              count={ordersCount}
              onClick={() => navigate("/orders")}
            />

            <AccountCard
              title="Cart"
              subtitle="Items ready to checkout"
              icon={<ShoppingCartIcon />}
              count={cartItems.length}
              onClick={() => navigate("/cart")}
            />

            <AccountCard
              title="Wishlist"
              subtitle="Saved items"
              icon={<FavoriteBorderIcon />}
              count={wishlist?.length || 0}
              onClick={() => navigate("/wishlist")}
            />

            <AccountCard
              title="Addresses"
              subtitle="Manage delivery locations"
              icon={<LocationOnIcon />}
              onClick={() => navigate("/addresses")}
            />

            <AccountCard
              title="Support"
              subtitle="Help & contact"
              icon={<SupportAgentIcon />}
              onClick={() => navigate("/support")}
            />

            <AccountCard
              title="Logout"
              subtitle="Sign out securely"
              icon={<LogoutIcon />}
              danger
              onClick={() => setLogoutDialog(true)}
            />
          </Box>
        </Box>

        {/* ================= RECENT ORDERS ================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2.5,
              borderBottom: "1px solid #eef2f7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography fontWeight={700} fontSize={{ xs: 18, sm: 22 }}>
              Recent Orders
            </Typography>

            <Button
              size="small"
              onClick={() => navigate("/orders")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              View All
            </Button>
          </Box>

          {/* EMPTY */}

          {recentOrders.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <ShoppingBagIcon
                sx={{
                  fontSize: 60,
                  color: "#cbd5e1",
                  mb: 1,
                }}
              />

              <Typography fontWeight={600} fontSize={18} mb={1}>
                No Recent Orders
              </Typography>

              <Typography color="text.secondary">
                Your recent purchases will appear here
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  textTransform: "none",
                }}
                onClick={() => navigate("/")}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <Box>
              {recentOrders.map((order, i) => {
                const firstItem = order.orders?.[0]?.items?.[0];

                return (
                  <Box
                    key={i}
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: { xs: 2, sm: 2.5 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 2,
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                      }}
                    >
                      {/* IMAGE */}

                      <Avatar
                        variant="rounded"
                        src={
                          firstItem?.product?.images?.[0]?.url ||
                          "https://via.placeholder.com/100"
                        }
                        sx={{
                          width: { xs: 80, sm: 90 },
                          height: { xs: 80, sm: 90 },
                          borderRadius: 3,
                        }}
                      />

                      {/* DETAILS */}

                      <Box flex={1} width="100%">
                        <Typography
                          fontWeight={700}
                          fontSize={{ xs: 15, sm: 17 }}
                          sx={{
                            mb: 0.5,
                            lineHeight: 1.4,
                          }}
                        >
                          {firstItem?.product?.name || "Product"}
                        </Typography>

                        <Typography fontSize={13} color="text.secondary" mb={1}>
                          Ordered on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1.5}
                          alignItems={{
                            xs: "flex-start",
                            sm: "center",
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            fontSize={{ xs: 17, sm: 18 }}
                          >
                            ₹{order.totalAmount}
                          </Typography>

                          <Chip
                            label={order.paymentStatus || "PLACED"}
                            color={
                              order.paymentStatus === "PAID"
                                ? "success"
                                : "primary"
                            }
                            size="small"
                          />
                        </Stack>
                      </Box>

                      {/* ACTION */}

                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          minWidth: {
                            xs: "100%",
                            sm: "auto",
                          },
                        }}
                        onClick={() => navigate(`/orders`)}
                      >
                        View Order
                      </Button>
                    </Box>

                    {i !== recentOrders.length - 1 && (
                      <Divider sx={{ mt: 3 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>

      {/* ================= LOGOUT DIALOG ================= */}

      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Logout?</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to logout from your account?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setLogoutDialog(false)}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Account;
