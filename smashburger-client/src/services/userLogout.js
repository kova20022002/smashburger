const API_URL = "http://localhost:3000/logout";

export async function userLogout() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout.");
    }
  } catch (error) {
    console.log("Logout error", error);
    throw error;
  }
}
