import { useCart } from "../../services/CartContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../services/AuthContext";
import { placeOrder } from "../../services/orderService";
import { fetchOrderHistory } from "../../services/fetchOrderHistory";
import { cancelingOrder } from "../../services/cancelingOrder";
import { Link } from "react-router-dom";
import openSocket from "socket.io-client";

function Cart() {
  const { cart, removeFromCart, clearCart, products, updateCartItemQuantity } =
    useCart();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [missingProfileInfo] = useState(false);

  useEffect(() => {
    // Map cart items to include product details
    const cartWithDetails = cart.map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.size?.find((s) => s.id === item.variantId);

      return {
        ...item,
        // Add a unique id for each item if one doesn't exist
        id: item.id || `cart-item-${index}-${Date.now()}`,
        name: product?.name || "Product",
        size: variant?.size || "Regular",
        totalPrice: item.price * (item.quantity || 1),
      };
    });

    setCartItems(cartWithDetails);
  }, [cart, products]);

  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchOrderHistory();
      setOrders(data);
    };
    getOrders();
  }, [cart]);

  /* useEffect(() => {
    if (user) {
      const { adress, number, floor, phone } = user;
      if (!adress || !number || !floor || !phone) {
        setMissingProfileInfo(true);
      }else(setMissingProfileInfo(false))
    }
  }, [user]); */

  const handleCancelOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await cancelingOrder(orderId);

      setMessage(response.message || "Order canceled successfully!");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderToCancel.id
            ? { ...order, status: "Canceled" }
            : order
        )
      );
    } catch (error) {
      setMessage("Failed to cancel order.");
    } finally {
      setLoading(false);
      setShowModal(false);
      setOrderToCancel(null);
    }
  };

  const socket = openSocket("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Socket connected");
  });
  socket.on("orderUpdatedToCanceled", (data) => {
    console.log("Order canceled:", data);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === data.id ? { ...order, status: data.status } : order
      )
    );
  });

  if (cart.length === 0) {
    return (
      <>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-custom p-8">
            <h2 className="text-2xl font-bold text-smash-black mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items from our menu to get started!
            </p>
            <Link
              to="/menu"
              className="inline-block bg-smash-yellow text-smash-black font-medium px-6 py-3 rounded-lg shadow-custom hover:shadow-hover transition-all"
            >
              Browse Menu
            </Link>
          </div>
        </div>

        <p className="text-2xl font-bold text-smash-black text-center">
          Your Order History
        </p>

        <div className="py-16 text-center">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-custom p-8">
            <div>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order.id} className="bg-white p-4 shadow rounded">
                      <p>
                        <strong>Order ID:</strong> {order.id}
                      </p>

                      <ul className="mt-2">
                        {order.OrderItems.map((item) => (
                          <li key={item.id}>
                            {item.product.name}{" "}
                            {item.variant?.size ? `${item.variant.size}` : ""} -
                            x{item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p>
                        <strong>Total:</strong> ${order.totalAmount}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      {["pending", "preparing"].includes(
                        order.status.toLowerCase()
                      ) && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(true);
                            setOrderToCancel(order);
                          }}
                          disabled={loading}
                          className={`w-full md:w-auto px-8 py-3 rounded-lg shadow-custom text-lg font-medium ${
                            loading
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-red-500 text-white hover:shadow-hover transition-all"
                          }`}
                        >
                          {loading ? "Canceling Order..." : "Cancel Order"}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-smash-black mb-4">
                Confirm Cancellation
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to cancel this order?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => setShowModal(false)}
                >
                  No, Go Back
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  onClick={async () => {
                    setLoading(true);
                    await handleCancelOrder(orderToCancel.id);
                  }}
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      setMessage("Please log in to place an order.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await placeOrder(cart);
      setMessage(response.message || "Order placed successfully!");
      clearCart();
    } catch (error) {
      setMessage("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <>
      {missingProfileInfo && (
        <div className="py-8 max-w-6xl mx-auto px-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg shadow-custom text-center">
          <p className="font-semibold">
            ⚠️ Please complete your profile information before placing an order.
          </p>
          <Link
            to="/profile"
            className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Go to Profile
          </Link>
        </div>
      )}

      <div className="py-8 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-smash-black">
          Your Cart
        </h1>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-smash-yellow text-smash-black font-medium text-center shadow-custom">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-custom overflow-hidden mb-8">
          <div className="divide-y">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-smash-black">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">Size: {item.size}</p>
                  {item.pan && (
                    <p className="text-gray-600">With Smashburger Pan</p>
                  )}
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center mr-4">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, -1)}
                        className="bg-gray-200 text-smash-black w-8 h-8 rounded-l-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="bg-gray-100 text-smash-black w-10 h-8 inline-flex items-center justify-center text-sm font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, 1)}
                        className="bg-gray-200 text-smash-black w-8 h-8 rounded-r-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                    <span className="text-smash-black font-medium">
                      ${item.price} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-lg font-bold text-smash-black mr-6">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-custom"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-custom p-6 mb-8">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <span className="text-gray-700 font-medium">Subtotal:</span>
            <span className="text-lg font-bold text-smash-black">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || missingProfileInfo}
              className={`w-full md:w-auto px-8 py-3 rounded-lg shadow-custom text-lg font-medium ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-smash-yellow text-smash-black hover:shadow-hover transition-all"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/menu"
            className="inline-block text-smash-black font-medium hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <div className="py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-custom p-8">
          <p className="text-2xl font-bold text-smash-black">Your orders</p>
          <div>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="bg-white p-4 shadow rounded">
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.totalAmount}
                    </p>
                    <ul className="mt-2">
                      {order.OrderItems.map((item) => (
                        <li key={item.id}>
                          {item.product.name} - {item.quantity} pcs
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
