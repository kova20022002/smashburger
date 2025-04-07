const API_URL = "http://localhost:3000/signup";

export async function userSignup(userData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to sign up.");
    }
    return result;
  } catch (error) {
    console.log("Signup error", error);
    throw error;
  }
}
