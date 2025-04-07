import PropTypes from "prop-types";
import { changeOrderStatus } from "../services/changeOrderStatus";
import { deliveringStatus } from "../services/deliveringStatus";
import { useState } from "react";

function Orders({ order }) {
  const [prepTime, setPrepTime] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await changeOrderStatus(order.id, prepTime);
    } catch (error) {
      alert(error.message || "An error occurred while accepting the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusDelivering = async () => {
    setIsSubmitting(true);
    try {
      await deliveringStatus(order.id);
    } catch (error) {
      alert(error.message || "An error occurred while accepting the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRadioChange = (e) => {
    setPrepTime(Number(e.target.value));
  };

  // Get status style
  const getStatusStyle = () => {
    switch (order.status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparation":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800"; // Keep this for backward compatibility
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-300 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format the status display text
  const formatStatus = (status) => {
    if (status === "in-progress") return "preparation";
    return status;
  };

  return (
    <div className="bg-white rounded-lg shadow-custom overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-smash-black">
                Order #{order.id}
              </h2>
              <span
                className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}
              >
                {formatStatus(order.status)}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Customer: {order.user.email}
            </p>
          </div>
          <div className="font-bold text-smash-black">${order.totalAmount}</div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Order Items
          </h3>
          <div className="space-y-3">
            {order.OrderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-smash-yellow rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-smash-black mr-3">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-medium text-smash-black">
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {item.variant.size}
                      </p>
                    )}
                    {item.smashburgerPanId && (
                      <p className="text-xs text-gray-500">Smashburger Pan</p>
                    )}
                  </div>
                </div>
                <div className="text-sm font-medium text-smash-black">
                  {(item.price * item.quantity).toFixed(2)} KM
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status === "pending" && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Preparation Time
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[5, 10, 15, 20, 25, 30].map((time) => (
                <label
                  key={`${order.id}-prepTime-${time}`}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    prepTime === time
                      ? "bg-smash-yellow text-smash-black font-medium shadow-custom"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`prepTime-${order.id}`}
                    value={time}
                    checked={prepTime === time}
                    onChange={handleRadioChange}
                    className="sr-only"
                  />
                  {time} min
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full md:w-auto px-4 py-2 bg-smash-black text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-custom disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Accept Order"}
            </button>
          </div>
        )}

        {(order.status === "in-progress" || order.status === "preparation") && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Order In Preparation
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The order will be automatically completed when ready
                </p>
              </div>
              <button
                type="button"
                onClick={handleStatusDelivering}
                disabled={isSubmitting}
                className="w-full md:w-auto px-4 py-2 bg-smash-black text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-custom disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Delivering"}
              </button>
            </div>
          </div>
        )}

        {order.status === "delivering" && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Order In Process of Delivering
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The order will be completed when it is delivered
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Orders.propTypes = {
  order: PropTypes.object.isRequired,
};

export default Orders;
