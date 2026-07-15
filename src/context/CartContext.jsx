import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [itemLoading, setItemLoading] = useState({});
  const [buyNowItem, setBuyNowItem] = useState(null);

  /* ================= FETCH CART ================= */

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      return;
    }

    try {
      const res = await axios.get("/user/cart");

      const cartData = res?.data?.cart ?? {
        items: [],
        totalPrice: 0,
      };

      setCart({
        items: cartData.items || [],
        totalPrice: cartData.totalPrice || 0,
      });
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Fetch cart failed", err);
      }

      setCart({
        items: [],
        totalPrice: 0,
      });
    }
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async ({
    productId,
    quantity = 1,
    selectedSize = null,
    selectedColor = null,
    buyNow = false,
  }) => {
    try {
      await axios.post("/user/cart", {
        productId,
        quantity,
        selectedSize,
        selectedColor,
      });

      await fetchCart();

      if (buyNow) {
        setBuyNowItem({
          productId,
          quantity,
          selectedSize,
          selectedColor,
        });
      }
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (cartItemId, quantity) => {
    if (itemLoading[cartItemId]) return;

    if (quantity < 1) return;

    setItemLoading((prev) => ({
      ...prev,
      [cartItemId]: true,
    }));

    try {
      await axios.put(`/user/cart/item/${cartItemId}`, {
        quantity,
      });

      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed", err);
    } finally {
      setItemLoading((prev) => ({
        ...prev,
        [cartItemId]: false,
      }));
    }
  };

  /* ================= REMOVE ITEM ================= */

  const removeFromCart = async (cartItemId) => {
    if (itemLoading[cartItemId]) return;

    setItemLoading((prev) => ({
      ...prev,
      [cartItemId]: true,
    }));

    try {
      await axios.delete(`/user/cart/item/${cartItemId}`);

      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed", err);
    } finally {
      setItemLoading((prev) => ({
        ...prev,
        [cartItemId]: false,
      }));
    }
  };

  /* ================= REMOVE ORDERED ITEMS ================= */

  const removeOrderedItems = (orderedItems = []) => {
    setCart((prev) => {
      if (!prev?.items?.length) return prev;

      const remainingItems = prev.items.filter((cartItem) => {
        return !orderedItems.some((ordered) => {
          return (
            ordered.productId === cartItem?.product?._id &&
            (ordered.selectedSize || null) ===
              (cartItem.selectedSize || null) &&
            (ordered.selectedColor || null) === (cartItem.selectedColor || null)
          );
        });
      });

      const newTotal = remainingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return {
        items: remainingItems,
        totalPrice: newTotal,
      };
    });
  };

  /* ================= CLEAR CART ================= */

  const clearCart = () => {
    setCart({
      items: [],
      totalPrice: 0,
    });

    setBuyNowItem(null);
  };

  /* ================= CLEAR BUY NOW ================= */

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      fetchCart();
    } else {
      // ✅ CLEAR CART if NOT logged in
      setCart({ items: [], totalPrice: 0 });
      setBuyNowItem(null);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems: cart.items,
        totalPrice: cart.totalPrice,
        buyNowItem,
        itemLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeOrderedItems,
        clearCart,
        clearBuyNow,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
