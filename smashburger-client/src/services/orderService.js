export const placeOrder = async (cart) => {
  try {
    const res = await fetch("http://localhost:3000/place-order", {
      method: "POST",
      credentials: "include", // This ensures that the cookies are sent with the request
      headers: {
        "Content-Type": "application/json",
        // No need to manually add the token in Authorization header, it's already in the cookie
      },
      body: JSON.stringify({ cart }), // Send the cart only
    });

    if (!res.ok) {
      throw new Error("Failed to place order");
    }

    return await res.json();
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};
