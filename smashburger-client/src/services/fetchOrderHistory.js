export async function fetchOrderHistory() {
  try {
    const response = await fetch("http://localhost:3000/order-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensures cookies are sent with the request
    });

    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
