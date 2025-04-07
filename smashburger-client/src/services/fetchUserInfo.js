const API_URL = "http://localhost:3000";

export const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/getUserInfo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error posting form data:", error);
      throw error;
    }
  };