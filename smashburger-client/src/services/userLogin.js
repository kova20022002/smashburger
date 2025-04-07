const API_URL = "http://localhost:3000/login";

export async function userLogin(userData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to login.");
    }
    return result;
  } catch (error) {
    console.log("Login error", error);
    throw error;
  }
}
