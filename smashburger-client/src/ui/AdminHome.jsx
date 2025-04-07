import { useState, useEffect } from "react";
import { fetchOrdersAdmin } from "../services/fetchOrdersAdmin";
import openSocket from "socket.io-client";
import Orders from "./Orders";

function AdminHome() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrdersAdmin();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch orders on component mount
    getOrders();

    // Socket connection for real-time updates
    const socket = openSocket("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("orders", (order) => {
      console.log("Received order:", order);
      if (order.action === "create") {
        
          setOrders((prevOrders) => [order.order, ...prevOrders]);        
        
      }
    });
    socket.on("orderUpdated", (data) => {
      console.log("Order updated:", data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.id ? { ...order, status: data.status } : order,
        ),
      );
    });
    socket.on("orderUpdatedToDeliveing", (data) => {
      console.log("Order updated:", data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.id ? { ...order, status: data.status } : order,
        ),
      );
    });
    socket.on("orderUpdatedToCanceled", (data) => {
      console.log("Order canceled:", data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.id ? { ...order, status: data.status } : order,
        ),
      );
    });

    // Cleanup socket connection on component unmount
    return () => socket.disconnect();
  }, []);


  // Filter orders based on active tab, handling both "in-progress" and "preparation" statuses
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "preparation") {
      return order.status === "preparation" || order.status === "delivering";
    }
    return order.status === activeTab;
  });

  // Helper to count orders with a specific status, handling the "preparation" transition
  const countOrdersByStatus = (status) => {
    if (status === "preparation") {
      return orders.filter(
        (order) =>
          order.status === "preparation" || order.status === "delivering",
      ).length;
    }
    return orders.filter((order) => order.status === status).length;
  };

  return (
    <div className="bg-smash-gray min-h-screen pb-12">
      <div className="bg-smash-yellow py-4 shadow-lg mb-8 rounded-2xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-smash-black">
            Admin Dashboard
          </h1>
          <p className="text-sm text-smash-black mt-1">
            Manage orders and view customer activity
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-custom">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-smash-black">
              {orders.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-custom">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Orders
            </h3>
            <p className="text-2xl font-bold text-yellow-500">
              {countOrdersByStatus("pending")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-custom">
            <h3 className="text-sm font-medium text-gray-500">Preparation</h3>
            <p className="text-2xl font-bold text-blue-500">
              {countOrdersByStatus("preparation")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-custom">
            <h3 className="text-sm font-medium text-gray-500">
              Canceled Orders
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {countOrdersByStatus("canceled")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-custom">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-500">
              {countOrdersByStatus("completed")}
            </p>
          </div>
        </div>

        {/* Order Tabs */}
        <div className="bg-white rounded-lg shadow-custom mb-6">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-smash-yellow text-smash-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-smash-yellow text-smash-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "preparation"
                  ? "border-b-2 border-smash-yellow text-smash-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("preparation")}
            >
              Preparation
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "canceled"
                  ? "border-b-2 border-smash-yellow text-smash-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("canceled")}
            >
              Canceled
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-smash-yellow text-smash-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-smash-yellow border-r-transparent" />
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-custom p-8 text-center">
              <p className="text-gray-500">
                No orders found for the selected filter.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Orders key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
