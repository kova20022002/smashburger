const API_URL = "http://localhost:3000";

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
