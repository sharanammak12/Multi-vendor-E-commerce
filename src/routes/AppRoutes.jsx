import { Routes, Route } from "react-router-dom";

/* LAYOUT */
import Layout from "../components/common/Layout";

/* MAIN PAGES */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductsByCategory from "../pages/ProductsByCategory";
import ProductView from "../pages/ProductView";
import MyOrders from "../pages/MyOrders";
import CartPage from "../pages/CartPage";
import ExchangeProduct from "../pages/ExchangeProduct";
import WishlistPage from "../pages/WishlistPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import ConfirmOrder from "../pages/ConfirmOrder";
import OrderSuccess from "../pages/OrderSuccess";
import SearchResults from "../pages/SearchResults";
import ReturnPage from "../pages/ReturnPage";
import TestApi from "../pages/TestApi";
/* LEGAL PAGES */
import PrivacyPolicy from "../pages/static/PrivacyPolicy";
import TermsConditions from "../pages/static/TermsConditions";
import ShippingPolicy from "../pages/static/ShippingPolicy";
/* AUTH */
import OtpVerify from "../pages/OtpVerify";
import ResetPassword from "../pages/ResetPassword";

/* ACCOUNT */
import Account from "../pages/Account";
import Profile from "../pages/Profile";
import Addresses from "../pages/Addresses";
import AddAddress from "../pages/AddAddress";

/* STATIC FOOTER PAGES */
import About from "../pages/static/About";
import Careers from "../pages/static/Careers";
import StoreLocator from "../pages/static/StoreLocator";
import Blog from "../pages/static/Blog";
import Support from "../pages/static/Support"; // renamed from Contact
import TrackOrder from "../pages/static/TrackOrder";
import Returns from "../pages/static/Returns";
import FAQs from "../pages/static/FAQs";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= HOME ================= */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route path="/test" element={<TestApi />} />

      {/* ================= CATEGORY ================= */}
      <Route
        path="/category/:categoryName"
        element={
          <Layout>
            <ProductsByCategory />
          </Layout>
        }
      />
      <Route
        path="/orders"
        element={
          <Layout>
            <MyOrders />
          </Layout>
        }
      />
      <Route
        path="/category/:categoryName/:tag"
        element={
          <Layout>
            <ProductsByCategory />
          </Layout>
        }
      />

      {/* ================= SEARCH ================= */}
      <Route
        path="/search"
        element={
          <Layout>
            <SearchResults />
          </Layout>
        }
      />

      {/* ================= PRODUCT ================= */}
      <Route
        path="/product/:productId"
        element={
          <Layout>
            <ProductView />
          </Layout>
        }
      />
      <Route
        path="/exchange/:productId/:orderId/:itemId"
        element={
          <Layout>
            <ExchangeProduct />
          </Layout>
        }
      />
      <Route
        path="/return/:productId/:orderId/:itemId"
        element={
          <Layout>
            <ReturnPage />
          </Layout>
        }
      />
      {/* ================= CART & CHECKOUT ================= */}
      <Route
        path="/cart"
        element={
          <Layout>
            <CartPage />
          </Layout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <Layout>
            <WishlistPage />
          </Layout>
        }
      />

      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />

      {/* ================= PAYMENT FLOW ================= */}
      <Route
        path="/payment"
        element={
          <Layout>
            <PaymentPage />
          </Layout>
        }
      />

      <Route
        path="/confirm-order"
        element={
          <Layout>
            <ConfirmOrder />
          </Layout>
        }
      />

      <Route
        path="/order-success"
        element={
          <Layout>
            <OrderSuccess />
          </Layout>
        }
      />

      {/* ================= ACCOUNT ================= */}
      <Route
        path="/account"
        element={
          <Layout>
            <Account />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />

      <Route
        path="/addresses"
        element={
          <Layout>
            <Addresses />
          </Layout>
        }
      />

      <Route
        path="/add-address"
        element={
          <Layout>
            <AddAddress />
          </Layout>
        }
      />

      {/* ================= STATIC FOOTER PAGES ================= */}
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        }
      />

      <Route
        path="/terms-conditions"
        element={
          <Layout>
            <TermsConditions />
          </Layout>
        }
      />

      <Route
        path="/shipping-policy"
        element={
          <Layout>
            <ShippingPolicy />
          </Layout>
        }
      />

      <Route
        path="/careers"
        element={
          <Layout>
            <Careers />
          </Layout>
        }
      />

      <Route
        path="/store-locator"
        element={
          <Layout>
            <StoreLocator />
          </Layout>
        }
      />

      <Route
        path="/blog"
        element={
          <Layout>
            <Blog />
          </Layout>
        }
      />

      <Route
        path="/support"
        element={
          <Layout>
            <Support />
          </Layout>
        }
      />

      <Route
        path="/track-order"
        element={
          <Layout>
            <TrackOrder />
          </Layout>
        }
      />

      <Route
        path="/returns"
        element={
          <Layout>
            <Returns />
          </Layout>
        }
      />

      <Route
        path="/faqs"
        element={
          <Layout>
            <FAQs />
          </Layout>
        }
      />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/OtpVerify" element={<OtpVerify />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <Layout>
            <h2 style={{ padding: 40 }}>404 – Page Not Found</h2>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
