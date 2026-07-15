import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  /* ================= FETCH ================= */
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      return;
    }

    try {
      const res = await axios.get("/user/wishlist");

      setWishlist(res.data.wishlist?.products || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Fetch wishlist failed", err);
      }

      setWishlist([]);
    }
  };

  /* ================= ADD ================= */
  const addToWishlist = async (productId) => {
    try {
      await axios.post("/user/wishlist", { productId });
      await fetchWishlist();
    } catch (err) {
      console.error("Add wishlist failed", err);
    }
  };

  /* ================= REMOVE (OPTIMISTIC) ================= */
  const removeFromWishlist = async (productId) => {
    // ✅ instant UI removal
    setWishlist((prev) => prev.filter((item) => item._id !== productId));

    try {
      await axios.delete(`/user/wishlist/${productId}`);
    } catch (err) {
      console.error("Remove wishlist failed", err);
      await fetchWishlist(); // rollback if needed
    }
  };

  /* ================= TOGGLE ================= */
  const toggleWishlist = async (productId) => {
    const exists = wishlist.some((item) => item._id === productId);

    if (exists) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);

  const resetWishlist = () => setWishlist([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      fetchWishlist();
    } else {
      setWishlist([]); // ✅ CLEAR WISHLIST
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        resetWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
