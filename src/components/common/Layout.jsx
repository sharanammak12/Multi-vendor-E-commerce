// import Header from "./Header";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { Box } from "@mui/material";

// const Layout = ({ children }) => {
//   return (
//     <>
//       <Header />
//       <Navbar />

//       {/* MAIN CONTENT */}
//       <Box
//         component="main"
//         sx={{
//           pt: {
//             xs: "108px", // Header + Navbar
//             md: "122px",
//           },
//           backgroundColor: "#eaeded",
//           minHeight: "calc(100vh - 200px)", // 👈 important
//         }}
//       >
//         {children}
//       </Box>

//       {/* FOOTER
//        */}
//       <Footer />
//     </>
//   );
// };

// export default Layout;
import { useEffect, useState } from "react";

import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { Box, CircularProgress } from "@mui/material";

import axiosInstance from "../../api/axiosInstance";

const Layout = ({ children }) => {
  const [loadingAuth, setLoadingAuth] = useState(true);

  /* ================= RESTORE LOGIN ================= */

  useEffect(() => {
    const restoreLogin = async () => {
      try {
        const token = localStorage.getItem("token");

        // already logged in
        if (token && token !== "undefined") {
          setLoadingAuth(false);
          return;
        }

        // try refresh token
        const res = await axiosInstance.post("/user/refresh-token");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.log("No active session");

        localStorage.removeItem("token");
      } finally {
        setLoadingAuth(false);
      }
    };

    restoreLogin();
  }, []);

  /* ================= LOADING ================= */

  if (loadingAuth) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eaeded",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />

      <Navbar />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          pt: {
            xs: "108px",
            md: "122px",
          },

          backgroundColor: "#eaeded",

          minHeight: "calc(100vh - 200px)",
        }}
      >
        {children}
      </Box>

      <Footer />
    </>
  );
};

export default Layout;
