// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

// import App from "./App";
// import theme from "./theme/theme";

// import { CartProvider } from "./context/CartContext";
// import { WishlistProvider } from "./context/WishlistContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />

//         {/* 🔥 ADD CONTEXT PROVIDERS HERE */}
//         <CartProvider>
//           <WishlistProvider>
//             <App />
//           </WishlistProvider>
//         </CartProvider>

//       </ThemeProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./theme/theme";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
