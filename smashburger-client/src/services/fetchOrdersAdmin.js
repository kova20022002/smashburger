const API_URL = "http://localhost:3000";

export async function fetchOrdersAdmin() {
  try {
    const response = await fetch(`${API_URL}/orders`);

    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
