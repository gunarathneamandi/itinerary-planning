import { useState } from "react";
import axios from "axios";

const AdminAddAttraction = () => {
  const [attraction, setAttraction] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    
    address: "",
  });

  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const categories = ["Nature", "Historic", "Entertainment", "Cultural", "Other"];

  const handleChange = (e) => {
    setAttraction({ ...attraction, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    Object.keys(attraction).forEach((key) => {
      formData.append(key, attraction[key]);
    });

    for (let i = 0; i < photos.length; i++) {
      formData.append("photos", photos[i]);
    }

    try {
      const response = await axios.post("http://localhost:5555/attractions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setMessage("Attraction added successfully!");
        setAttraction({ name: "", description: "", category: "", location: "", address: "" });
        setPhotos([]);
      } else {
        setError("Failed to add attraction.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Attraction</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={attraction.name} onChange={handleChange} placeholder="Attraction Name" required className="w-full p-2 border rounded" />
        
        <textarea name="description" value={attraction.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"></textarea>

        <select name="category" value={attraction.category} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input type="text" name="location" value={attraction.location} onChange={handleChange} placeholder="City/Location" required className="w-full p-2 border rounded" />

        

        <input type="text" name="address" value={attraction.address} onChange={handleChange} placeholder="Full Address" required className="w-full p-2 border rounded" />

        <label className="block text-sm font-semibold mb-1">Upload Photos</label>
        <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Attraction
        </button>
      </form>
    </div>
  );
};

export default AdminAddAttraction;
