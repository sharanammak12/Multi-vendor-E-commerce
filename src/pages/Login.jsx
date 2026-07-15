// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Divider,
//   InputAdornment,
//   Link,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import HomeIcon from "@mui/icons-material/Home";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import axiosInstance from "../api/axiosInstance";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const { fetchCart } = useCart();
//   const { fetchWishlist } = useWishlist();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
//   const [otpSent, setOtpSent] = useState(false);
//   const [loginWithPassword, setLoginWithPassword] = useState(true);
//   const [timer, setTimer] = useState(60);
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ Separate loading states
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [verifyLoading, setVerifyLoading] = useState(false);
//   const [forgotLoading, setForgotLoading] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showMessage = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   useEffect(() => {
//     setLoginWithPassword(true);
//     setOtpSent(false);
//     setOtpValues(["", "", "", "", "", ""]);
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (otpSent && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpSent, timer]);

//   const handleGetOtp = async () => {
//     if (!email) return showMessage("Enter Email", "warning");
//     try {
//       setOtpLoading(true);
//       const res = await axiosInstance.post("/user/login", { email });
//       setOtpSent(true);
//       setTimer(30);
//       showMessage(res.data.message || "OTP Sent Successfully ✅", "success");
//     } catch (error) {
//       showMessage(
//         error.response?.data?.message || "Failed to send OTP ❌",
//         "error",
//       );
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       setOtpLoading(true);
//       const res = await axiosInstance.post("/user/login", { email });
//       setTimer(30);
//       showMessage(res.data.message || "OTP Resent ✅", "success");
//     } catch (error) {
//       showMessage(
//         error.response?.data?.message || "Failed to resend OTP ❌",
//         "error",
//       );
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const newOtp = [...otpValues];
//     newOtp[index] = value;
//     setOtpValues(newOtp);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const finalOtp = otpValues.join("");
//     if (finalOtp.length !== 6)
//       return showMessage("Enter 6 Digit OTP", "warning");

//     try {
//       setVerifyLoading(true);
//       const res = await axiosInstance.post("/user/login/verify-otp", {
//         email,
//         otp: finalOtp,
//       });
//       const token = res.data.data.token;

//       localStorage.setItem("token", token);
//       window.dispatchEvent(new Event("storage"));
//       showMessage("Login Successful ✅", "success");
//       setTimeout(() => navigate("/"), 1000);
//     } catch (error) {
//       showMessage(error.response?.data?.message || "Invalid OTP ❌", "error");
//     } finally {
//       setVerifyLoading(false);
//     }
//   };

//   const handlePasswordLogin = async () => {
//     if (!email || !password)
//       return showMessage("Enter Email & Password", "warning");
//     try {
//       setPasswordLoading(true);
//       const res = await axiosInstance.post("/user/login/password", {
//         email,
//         password,
//       });
//       const token = res.data.data.token;

//       localStorage.setItem("token", token);
//       window.dispatchEvent(new Event("storage"));

//       showMessage("Login Successful ✅", "success");
//       await fetchCart();
//       await fetchWishlist();
//       setTimeout(() => navigate("/"), 1000);
//     } catch (error) {
//       showMessage(
//         error.response?.data?.message || "Invalid Credentials ❌",
//         "error",
//       );
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) return showMessage("Enter Email First", "warning");
//     try {
//       setForgotLoading(true);
//       const res = await axiosInstance.post("/user/forgot-password", {
//         email,
//       });
//       showMessage(
//         res.data.message || "Reset link sent to your Email 📩",
//         "success",
//       );
//     } catch (error) {
//       showMessage(
//         error.response?.data?.message || "Failed to send reset link ❌",
//         "error",
//       );
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#fafafa",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         px: { xs: 1.5, sm: 2 },
//       }}
//     >
//       <Paper
//         sx={{
//           width: "100%",
//           maxWidth: { xs: 420, md: 1050 },
//           minHeight: { xs: "auto", md: 560 },
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           borderRadius: 4,
//           overflow: "hidden",
//           boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
//         }}
//       >
//         {/* LEFT SIDE */}
//         <Box
//           sx={{
//             width: "45%",
//             background: "linear-gradient(135deg, #ffb26b, #ff7a18)",
//             px: 7,
//             display: { xs: "none", md: "flex" },
//             flexDirection: "column",
//             justifyContent: "center",
//             color: "#4a260f",
//           }}
//         >
//           {/* <Box mb={2}>
//             <Button
//               startIcon={<HomeIcon />}
//               onClick={() => navigate("/")}
//               sx={{
//                 textTransform: "none",
//                 color: "#ff7a18",
//                 fontWeight: 600,
//                 px: 0,
//               }}
//             >
//               Back to Home
//             </Button>
//           </Box> */}
//           <Typography variant="h4" fontWeight={800} mb={2}>
//             Welcome Back!
//           </Typography>
//           <Typography fontSize={15} mb={4}>
//             Login to continue shopping on Vastraa.
//           </Typography>
//           <Typography fontWeight={900} fontSize={22}>
//             Vastraa
//           </Typography>
//           <Typography fontSize={13}>Fashion you’ll love</Typography>
//         </Box>

//         {/* RIGHT SIDE */}
//         <Box
//           component="form"
//           autoComplete="off"
//           onSubmit={(e) => e.preventDefault()}
//           sx={{
//             width: { xs: "100%", md: "55%" },
//             px: { xs: 2.5, sm: 4, md: 7 },
//             py: { xs: 4, md: 6 },
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h5" fontWeight={700} mb={0.5}>
//             Login Account
//           </Typography>

//           <Typography color="text.secondary" mb={3}>
//             Login using Email & OTP or Password
//           </Typography>
//           <TextField
//             fullWidth
//             label="Email"
//             name="login-email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             autoComplete="new-email"
//             inputProps={{
//               autoComplete: "new-email",
//             }}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <EmailIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {loginWithPassword ? (
//             <>
//               <TextField
//                 fullWidth
//                 label="Password"
//                 name="login-password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="new-password"
//                 inputProps={{
//                   autoComplete: "new-password",
//                 }}
//                 sx={{ mb: 1 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LockOutlinedIcon sx={{ color: "#ff7a18" }} />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Link component="button" onClick={handleForgotPassword}>
//                   {forgotLoading ? "Sending..." : "Forgot Password?"}
//                 </Link>
//                 <Link
//                   component="button"
//                   onClick={() => setLoginWithPassword(false)}
//                 >
//                   Login with OTP
//                 </Link>
//               </Box>

//               <Button
//                 fullWidth
//                 onClick={handlePasswordLogin}
//                 disabled={passwordLoading}
//                 sx={{
//                   py: 1.4,
//                   fontWeight: 700,
//                   background: "linear-gradient(135deg, #ff7a18, #ffb26b)",
//                   color: "#fff",
//                 }}
//               >
//                 {passwordLoading ? "Logging..." : "LOGIN"}
//               </Button>
//             </>
//           ) : (
//             <>
//               {!otpSent ? (
//                 <>
//                   <Button
//                     fullWidth
//                     onClick={handleGetOtp}
//                     disabled={otpLoading}
//                     sx={{
//                       py: 1.4,
//                       fontWeight: 700,
//                       backgroundColor: "#ff7a18",
//                       color: "#fff",
//                       mb: 2,
//                     }}
//                   >
//                     {otpLoading ? "Sending OTP..." : "GET OTP"}
//                   </Button>

//                   <Link
//                     component="button"
//                     onClick={() => setLoginWithPassword(true)}
//                   >
//                     Login with Password
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                     {otpValues.map((digit, index) => (
//                       <TextField
//                         key={index}
//                         id={`otp-${index}`}
//                         name={`otp-${index}`}
//                         value={digit}
//                         autoComplete="one-time-code"
//                         inputProps={{
//                           maxLength: 1,
//                           autoComplete: "one-time-code",
//                           style: {
//                             textAlign: "center",
//                             fontSize: "20px",
//                             fontWeight: "bold",
//                           },
//                         }}
//                         onChange={(e) => handleOtpChange(e.target.value, index)}
//                         sx={{ width: 48 }}
//                       />
//                     ))}
//                   </Box>

//                   <Box display="flex" justifyContent="space-between" mb={2}>
//                     <Typography fontSize={13}>
//                       {timer > 0 ? `Resend OTP in ${timer}s` : ""}
//                     </Typography>

//                     <Button
//                       size="small"
//                       onClick={handleResendOtp}
//                       disabled={timer > 0 || otpLoading}
//                       sx={{ fontSize: 12, color: "#ff7a18" }}
//                     >
//                       Resend OTP
//                     </Button>
//                   </Box>

//                   <Button
//                     fullWidth
//                     onClick={handleVerifyOtp}
//                     disabled={verifyLoading}
//                     sx={{
//                       py: 1.4,
//                       fontWeight: 700,
//                       backgroundColor: "#ff7a18",
//                       color: "#fff",
//                     }}
//                   >
//                     {verifyLoading ? "Verifying..." : "VERIFY & CONTINUE"}
//                   </Button>
//                 </>
//               )}
//             </>
//           )}

//           <Divider sx={{ my: 3 }} />

//           <Typography align="center" fontSize={14}>
//             New to Vastraa?{" "}
//             <Typography
//               component="span"
//               sx={{
//                 color: "#ff7a18",
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//               onClick={() => navigate("/register")}
//             >
//               Create account
//             </Typography>
//           </Typography>
//           <Typography
//             align="center"
//             fontSize={13}
//             sx={{
//               mt: 2,
//               color: "#ff7a18",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//             onClick={() => navigate("/")}
//           >
//             ← Back to Home
//           </Typography>
//         </Box>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           severity={snackbar.severity}
//           variant="filled"
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };
// export default Login;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  Link,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Login = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loginWithPassword, setLoginWithPassword] = useState(true);
  const [timer, setTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Separate loading states
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    setLoginWithPassword(true);
    setOtpSent(false);
    setOtpValues(["", "", "", "", "", ""]);
  }, []);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleGetOtp = async () => {
    if (!email) return showMessage("Enter Email", "warning");
    try {
      setOtpLoading(true);
      const res = await axiosInstance.post("/user/login", { email });
      setOtpSent(true);
      setTimer(30);
      showMessage(res.data.message || "OTP Sent Successfully ✅", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to send OTP ❌",
        "error",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpLoading(true);
      const res = await axiosInstance.post("/user/login", { email });
      setTimer(30);
      showMessage(res.data.message || "OTP Resent ✅", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to resend OTP ❌",
        "error",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  const handleVerifyOtp = async () => {
    const finalOtp = otpValues.join("");

    if (finalOtp.length !== 6)
      return showMessage("Enter 6 Digit OTP", "warning");

    try {
      setVerifyLoading(true);

      const res = await axiosInstance.post("/user/login/verify-otp", {
        email,
        otp: finalOtp,
      });

      const accessToken = res.data.data.accessToken;

      localStorage.setItem("token", accessToken);

      window.dispatchEvent(new Event("storage"));

      showMessage("Login Successful ✅", "success");

      await fetchCart();
      await fetchWishlist();

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      showMessage(error.response?.data?.message || "Invalid OTP ❌", "error");
    } finally {
      setVerifyLoading(false);
    }
  };
  const handlePasswordLogin = async () => {
    if (!email || !password)
      return showMessage("Enter Email & Password", "warning");

    try {
      setPasswordLoading(true);

      const res = await axiosInstance.post("/user/login/password", {
        email,
        password,
      });

      const accessToken = res.data.data.accessToken;

      localStorage.setItem("token", accessToken);

      window.dispatchEvent(new Event("storage"));

      showMessage("Login Successful ✅", "success");

      await fetchCart();
      await fetchWishlist();

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Invalid Credentials ❌",
        "error",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return showMessage("Enter Email First", "warning");
    try {
      setForgotLoading(true);
      const res = await axiosInstance.post("/user/forgot-password", {
        email,
      });
      showMessage(
        res.data.message || "Reset link sent to your Email 📩",
        "success",
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to send reset link ❌",
        "error",
      );
    } finally {
      setForgotLoading(false);
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
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: { xs: 420, md: 1050 },
          minHeight: { xs: "auto", md: 560 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            width: "45%",
            background: "linear-gradient(135deg, #ffb26b, #ff7a18)",
            px: 7,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            color: "#4a260f",
          }}
        >
          {/* <Box mb={2}>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                color: "#ff7a18",
                fontWeight: 600,
                px: 0,
              }}
            >
              Back to Home
            </Button>
          </Box> */}
          <Typography variant="h4" fontWeight={800} mb={2}>
            Welcome Back!
          </Typography>
          <Typography fontSize={15} mb={4}>
            Login to continue shopping on Vastraa.
          </Typography>
          <Typography fontWeight={900} fontSize={22}>
            Vastraa
          </Typography>
          <Typography fontSize={13}>Fashion you’ll love</Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          component="form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            width: { xs: "100%", md: "55%" },
            px: { xs: 2.5, sm: 4, md: 7 },
            py: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Login Account
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Login using Email & OTP or Password
          </Typography>
          <TextField
            fullWidth
            label="Email"
            name="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-email"
            inputProps={{
              autoComplete: "new-email",
            }}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          {loginWithPassword ? (
            <>
              <TextField
                fullWidth
                label="Password"
                name="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                inputProps={{
                  autoComplete: "new-password",
                }}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#ff7a18" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Link component="button" onClick={handleForgotPassword}>
                  {forgotLoading ? "Sending..." : "Forgot Password?"}
                </Link>
                <Link
                  component="button"
                  onClick={() => setLoginWithPassword(false)}
                >
                  Login with OTP
                </Link>
              </Box>

              <Button
                fullWidth
                onClick={handlePasswordLogin}
                disabled={passwordLoading}
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ff7a18, #ffb26b)",
                  color: "#fff",
                }}
              >
                {passwordLoading ? "Logging..." : "LOGIN"}
              </Button>
            </>
          ) : (
            <>
              {!otpSent ? (
                <>
                  <Button
                    fullWidth
                    onClick={handleGetOtp}
                    disabled={otpLoading}
                    sx={{
                      py: 1.4,
                      fontWeight: 700,
                      backgroundColor: "#ff7a18",
                      color: "#fff",
                      mb: 2,
                    }}
                  >
                    {otpLoading ? "Sending OTP..." : "GET OTP"}
                  </Button>

                  <Link
                    component="button"
                    onClick={() => setLoginWithPassword(true)}
                  >
                    Login with Password
                  </Link>
                </>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    {otpValues.map((digit, index) => (
                      <TextField
                        key={index}
                        id={`otp-${index}`}
                        name={`otp-${index}`}
                        value={digit}
                        autoComplete="one-time-code"
                        inputProps={{
                          maxLength: 1,
                          autoComplete: "one-time-code",
                          style: {
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "bold",
                          },
                        }}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        sx={{ width: 48 }}
                      />
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography fontSize={13}>
                      {timer > 0 ? `Resend OTP in ${timer}s` : ""}
                    </Typography>

                    <Button
                      size="small"
                      onClick={handleResendOtp}
                      disabled={timer > 0 || otpLoading}
                      sx={{ fontSize: 12, color: "#ff7a18" }}
                    >
                      Resend OTP
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading}
                    sx={{
                      py: 1.4,
                      fontWeight: 700,
                      backgroundColor: "#ff7a18",
                      color: "#fff",
                    }}
                  >
                    {verifyLoading ? "Verifying..." : "VERIFY & CONTINUE"}
                  </Button>
                </>
              )}
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography align="center" fontSize={14}>
            New to Vastraa?{" "}
            <Typography
              component="span"
              sx={{
                color: "#ff7a18",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => navigate("/register")}
            >
              Create account
            </Typography>
          </Typography>
          <Typography
            align="center"
            fontSize={13}
            sx={{
              mt: 2,
              color: "#ff7a18",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
