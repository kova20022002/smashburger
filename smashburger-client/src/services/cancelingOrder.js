const API_URL = "http://localhost:3000/canceled";

export async function cancelingOrder(orderId) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: orderId,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel order.");
    }

    return result;
  } catch (error) {
    console.log("Order cancel error:", error);
    throw error;
  }
}
