import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Helper function to identify identical products
  const areItemsEqual = (item1, item2) => {
    return (
      item1.productId === item2.productId &&
    (item1.variantId ?? null) === (item2.variantId ?? null) &&
    (item1.pan ?? null) === (item2.pan ?? null)
    );
  };

  const addToCartWithNotification = (item, productName) => {
    // Check if the product is already in the cart
    setCart((prevCart) => {
      // Look for an existing item in the cart that matches
      const existingItemIndex = prevCart.findIndex((cartItem) =>
        areItemsEqual(cartItem, item),
      );

      // If the item exists, increase its quantity
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];

        // Add the quantities
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + (item.quantity || 1),
        };

        // Show notification
        setNotification({
          message: `Added ${item.quantity || 1} more ${productName} to cart!`,
          type: "success",
        });

        return updatedCart;
      }

      // Otherwise add as a new item with a unique ID
      const cartItem = {
        ...item,
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Show notification
      setNotification({
        message: `${productName} added to cart!`,
        type: "success",
      });

      return [...prevCart, cartItem];
    });
  };

  const updateCartItemQuantity = (itemId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === itemId) {
          // Calculate new quantity, ensuring it's at least 1
          const newQuantity = Math.max(1, item.quantity + change);

          // Only update if it's different
          if (newQuantity !== item.quantity) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      });

      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);

      if (updatedCart.length < prevCart.length) {
        // Only show notification if an item was actually removed
        setNotification({
          message: "Item removed from cart",
          type: "info",
        });
      }

      return updatedCart;
    });
  };

  // Function to clear the cart (after placing an order)
  const clearCart = () => {
    setCart([]);
  };

  // Function to dismiss the notification
  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        products,
        setProducts,
        removeFromCart,
        clearCart,
        notification,
        dismissNotification,
        addToCartWithNotification,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  return useContext(CartContext);
};
