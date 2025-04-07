const API_URL = "http://localhost:3000/change-order-status";

export async function changeOrderStatus(
  orderId,
  prepTime,
  status = "preparation",
) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: orderId,
        preparationTime: prepTime,
        status: status,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update order.");
    }

    return result;
  } catch (error) {
    console.log("Order update error:", error);
    throw error;
  }
}
