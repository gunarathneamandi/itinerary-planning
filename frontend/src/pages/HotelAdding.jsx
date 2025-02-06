import { useState } from "react";

const AdminAddHotel = () => {
  const [hotel, setHotel] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    facilities: "",
    roomTypes: [],
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const availableRoomTypes = ["Single", "Double", "Family", "Suite"];

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updatedRoomTypes = [...hotel.roomTypes];
    updatedRoomTypes[index][field] = field === "count" || field === "price" ? parseFloat(value) : value;
    setHotel({ ...hotel, roomTypes: updatedRoomTypes });
  };

  const addRoomType = () => {
    setHotel({
      ...hotel,
      roomTypes: [...hotel.roomTypes, { type: "Single", count: 1, price: 0 }],
    });
  };

  const removeRoomType = (index) => {
    const updatedRoomTypes = hotel.roomTypes.filter((_, i) => i !== index);
    setHotel({ ...hotel, roomTypes: updatedRoomTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formattedHotel = {
      ...hotel,
      facilities: hotel.facilities.split(",").map((f) => f.trim()), // Convert facilities to an array
    };

    try {
      const response = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedHotel),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Hotel added successfully!");
        setHotel({
          name: "",
          address: "",
          city: "",
          phone: "",
          email: "",
          facilities: "",
          roomTypes: [],
        });
      } else {
        setError(data.message || "Failed to add hotel.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={hotel.name} onChange={handleChange} placeholder="Hotel Name" required className="w-full p-2 border rounded" />
        <input type="text" name="address" value={hotel.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded" />
        <input type="text" name="city" value={hotel.city} onChange={handleChange} placeholder="City" required className="w-full p-2 border rounded" />
        <input type="text" name="phone" value={hotel.phone} onChange={handleChange} placeholder="Phone Number (10 digits)" pattern="[0-9]{10}" required className="w-full p-2 border rounded" />
        <input type="email" name="email" value={hotel.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        <textarea name="facilities" value={hotel.facilities} onChange={handleChange} placeholder="Facilities (comma-separated, e.g., Wi-Fi, Pool)" required className="w-full p-2 border rounded"></textarea>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Room Types</h3>
          {hotel.roomTypes.map((room, index) => (
            <div key={index} className="border p-4 rounded shadow-sm">
              <label className="block text-sm font-semibold mb-1">Room Type</label>
              <select
                value={room.type}
                onChange={(e) => handleRoomTypeChange(index, "type", e.target.value)}
                className="p-2 border rounded w-full mb-2"
              >
                {availableRoomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-semibold mb-1">Number of Rooms</label>
              <input
                type="number"
                min="1"
                value={room.count}
                onChange={(e) => handleRoomTypeChange(index, "count", e.target.value)}
                placeholder="No. of Rooms"
                className="p-2 border rounded w-full mb-2"
              />

              <label className="block text-sm font-semibold mb-1">Price per Night</label>
              <input
                type="number"
                min="0"
                value={room.price}
                onChange={(e) => handleRoomTypeChange(index, "price", e.target.value)}
                placeholder="Price per Night"
                className="p-2 border rounded w-full mb-2"
              />

              <button type="button" onClick={() => removeRoomType(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                ✕ Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addRoomType} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            + Add Room Type
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default AdminAddHotel;
