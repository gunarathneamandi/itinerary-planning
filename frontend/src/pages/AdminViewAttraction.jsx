import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminViewAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attractions");
        setAttractions(response.data.data);
      } catch (error) {
        setError("Error fetching attractions.");
      }
    };

    fetchAttractions();
  }, []);

  const handleAddAttraction = () => {
    navigate("/admin/addattraction");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Attractions</h2>
      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handleAddAttraction}
        className="bg-green-600 text-white p-2 rounded-full mb-4 hover:bg-green-700"
      >
        <span className="text-lg font-bold">+</span> Add Attraction
      </button>

      <div className="space-y-4">
        {attractions.map((attraction) => (
          <div key={attraction._id} className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold">{attraction.name}</h3>
            <p className="text-sm text-gray-600">{attraction.category}</p>
            <p>{attraction.description}</p>
            <p className="text-sm text-gray-500">{attraction.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminViewAttractions;
