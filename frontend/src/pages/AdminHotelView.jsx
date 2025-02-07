import { useEffect, useState } from "react";

const AdminHotelView = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5555/booking/hotels"); // Update with your actual API URL
        if (!response.ok) throw new Error("Failed to fetch hotels");
        
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading hotels...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center my-6">Hotel Listings</h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-bold">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.address}, {hotel.city}</p>
            <p className="text-gray-700 font-semibold mt-2">Price: ${hotel.price}</p>
            <p className="text-sm text-gray-500">Phone: {hotel.phone || "N/A"}</p>
            <p className="text-sm text-gray-500">Email: {hotel.email || "N/A"}</p>
            <p className="text-sm text-gray-500">Facilities: {hotel.facilities.join(", ") || "N/A"}</p>
            <p className="text-sm text-gray-500">Room Types: {hotel.roomTypes.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHotelView;
