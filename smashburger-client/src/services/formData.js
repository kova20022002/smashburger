const API_URL = "http://localhost:3000";

export const postFormData = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
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