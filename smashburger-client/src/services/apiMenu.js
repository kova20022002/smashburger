const API_URL = "http://localhost:3000";

export async function getMenu() {
  const res = await fetch(`${API_URL}/menu`);
  if (!res) throw Error("Failed to load menu!");
  const data = await res.json();
  return data;
}
