import { useState, useEffect, useContext } from "react";
import { postFormData } from "../services/formData";
import { fetchUserInfo } from "../services/fetchUserInfo";
import { AuthContext } from "../services/AuthContext";

function User() {
  const [formData, setFormData] = useState({
    adress: "",
    number: "",
    floor: "",
    phone: "",
    note: "",
  });
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle between form and display mode

  // Example: Simulating fetching user info from an API or global state
  useEffect(() => {
    // You would replace this with an actual API call to get the user's data
    const fetchUserData = async () => {
      try {
        // Example of user info fetched from API (replace this with actual fetch)
        const userInfo = await fetchUserInfo(); // Implement this function
        if (userInfo) {
          setFormData({
            adress: userInfo.adress || "",
            number: userInfo.number || "",
            floor: userInfo.floor || "",
            phone: userInfo.phone || "",
            note: userInfo.note || ""
          });
          setIsEditing(false); // Set editing mode to false, so it shows the info
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserData();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!formData.adress.trim()) newErrors.adress = "Address is required";
    if (!formData.number.trim()) newErrors.number = "Number is required";
    if (!/^[0-9]+$/.test(formData.floor))
      newErrors.floor = "Floor must be a number";
    if (!/^\+?[0-9]{7,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(user)

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (validate()) {
        const result = await postFormData(formData);
        console.log("Success:", result);
        setIsEditing(false);
      }
    } catch (error) {
      setErrors(error.message || "Failed to submit information.");
    } finally {
      setIsLoading(false);
    }
  };

  // Button click to switch to form edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded shadow">
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="adress"
              value={formData.adress}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.adress && <p className="text-red-500">{errors.address}</p>}
          </div>

          <div>
            <label>Number:</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.number && <p className="text-red-500">{errors.number}</p>}
          </div>

          <div>
            <label>Floor:</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.floor && <p className="text-red-500">{errors.floor}</p>}
          </div>

          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label>Note:</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="border p-2 w-full"
            ></textarea>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <div className="p-4 max-w-md mx-auto border rounded shadow">
          <p><strong>Address:</strong> {formData.adress }</p>
          <p><strong>Number:</strong> {formData.number }</p>
          <p><strong>Floor:</strong> {formData.floor }</p>
          <p><strong>Phone Number:</strong> {formData.phone }</p>
          <p><strong>Note:</strong> {formData.note }</p>
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-4 py-2 mt-2"
          >
            Edit Information
          </button>
        </div>
      )}
    </div>
  );
}

export default User;
