import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useUserDetails from "../hooks/useUserDetails"; // Import the custom hook
import UserDetailsForm from "../components/UserDetailsForms.jsx"; // Import the UserDetailsForm component

const BookingPage = () => {
  const { attractionId } = useParams();

  const [attraction, setAttraction] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [hotelDistances, setHotelDistances] = useState([]); // To store calculated distances
  const [startingLocation, setStartingLocation] = useState(""); // New state for starting location

  const navigate = useNavigate();

  // Use the custom hook for user details
  const { userDetails, handleInputChange } = useUserDetails();

  // Prices for rooms
  const roomPrices = {
    Single: 1000,
    Double: 1500,
    Suite: 2500,
  };

  useEffect(() => {
    const fetchAttractionAndHotels = async () => {
      try {
        const attractionResponse = await axios.get(
          `http://localhost:5555/attractions/${attractionId}`
        );
        setAttraction(attractionResponse.data);

        const hotelsResponse = await axios.get(
          `http://localhost:5555/booking/hotels/${attractionId}`
        );
        setHotels(hotelsResponse.data.hotels);
      } catch (error) {
        console.error("Error fetching attraction or hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractionAndHotels();
  }, [attractionId]);

  useEffect(() => {
    const getHotelDistances = async () => {
      if (attraction && hotels.length > 0) {
        // Geocode the attraction address
        const attractionLocation = await geocodeAddress(attraction.address);

        // Calculate distances for each hotel
        const distances = await Promise.all(
          hotels.map(async (hotel) => {
            const hotelLocation = await geocodeAddress(hotel.address);
            if (hotelLocation) {
              const distance = await getDistance(
                hotelLocation,
                attractionLocation
              );
              return { hotel, distance };
            }
            return null;
          })
        );

        // Filter out any null results and sort by distance
        const validDistances = distances.filter((item) => item !== null);
        validDistances.sort((a, b) => a.distance - b.distance);
        setHotelDistances(validDistances);
      }
    };

    getHotelDistances();
  }, [attraction, hotels]);

  // Geocode address to get lat and lon
  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  // Calculate distance using OSRM
  const getDistance = async (hotelLocation, attractionLocation) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${hotelLocation.lon},${hotelLocation.lat};${attractionLocation.lon},${attractionLocation.lat}?overview=false&steps=true`
      );
      if (response.data.code === "Ok") {
        const distance = response.data.routes[0].legs[0].distance / 1000; // Convert to km
        return distance;
      }
      return 0;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 0;
    }
  };

  // Handle room selection for a hotel
  const handleRoomChange = (hotelId, roomType, count) => {
    setSelectedRooms((prev) => {
      const existingHotel = prev.find((hotel) => hotel.hotelId === hotelId);
      if (existingHotel) {
        const existingRoom = existingHotel.rooms.find(
          (room) => room.type === roomType
        );
        if (existingRoom) {
          existingRoom.count = count;
        } else {
          existingHotel.rooms.push({ type: roomType, count });
        }
      } else {
        prev.push({ hotelId, rooms: [{ type: roomType, count }] });
      }
      return [...prev];
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let roomTotal = selectedRooms.reduce((total, hotel) => {
      hotel.rooms.forEach(
        (room) => (total += room.count * roomPrices[room.type])
      );
      return total;
    }, 0);

    let hotelTotal = selectedHotel ? selectedHotel.price : 0;
    let total = roomTotal + hotelTotal - discount;
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedRooms, selectedHotel, discount]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (
      !selectedHotel._id ||
      !checkInDate ||
      !checkOutDate ||
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.contact ||
      !userDetails.address
    ) {
      alert("Please complete all fields before booking.");
      return;
    }

    const bookingDetails = {
      attraction: attractionId,
      hotel: selectedHotel._id,
      rooms: selectedRooms,
      checkInDate,
      checkOutDate,
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
      address: userDetails.address,
      startingLocation,
      totalPrice: Number(totalPrice),
    };

    try {
      const response = await axios.post(
        "http://localhost:5555/bookingConfirmation",
        bookingDetails
      );

      if (response.data && response.data._id) {
        alert("Booking Success!");
        navigate(`/bookingConfirmation/${response.data._id}`);
      } else {
        alert("There was an issue with your booking. Please try again.");
      }
    } catch (error) {
      console.error("Error posting booking details:", error);
      alert("Booking failed. Please try again.");
    }
  };

  // Date validation for check-out to be after check-in
  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);

    // Set the check-out date to always be after check-in
    if (!checkOutDate || newCheckInDate >= checkOutDate) {
      setCheckOutDate(newCheckInDate);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!attraction) {
    return <div>Attraction not found.</div>;
  }

  return (
    <form onSubmit={handleBooking} className="p-8">
      {/* Starting Location */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Enter Starting Location</h2>
        <input
          type="text"
          value={startingLocation}
          onChange={(e) => setStartingLocation(e.target.value)}
          placeholder="Enter your starting location"
          required
          className="border-2 p-2 w-full"
        />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{attraction.name}</h1>
        <p className="text-gray-700">{attraction.description}</p>
        <p className="text-gray-600">Category: {attraction.category}</p>
        <p className="text-gray-600">Location: {attraction.location}</p>
        <p className="text-gray-600">Address: {attraction.address}</p>
        {attraction.photos && attraction.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {attraction.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Attraction ${index + 1}`}
                className="w-full h-auto rounded-md"
              />
            ))}
          </div>
        )}
      </div>

      {/* Check-in and Check-out Dates */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Dates</h2>
        <div className="space-y-4">
          <input
            type="date"
            value={checkInDate}
            onChange={handleCheckInDateChange}
            required
            className="border-2 p-2 w-full"
          />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
            min={checkInDate}
            className="border-2 p-2 w-full"
          />
        </div>
      </div>

      {/* Hotels with Room Selection Inside */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Choose a Hotel</h2>
        <div className="space-y-4">
          {hotelDistances.map(({ hotel, distance }) => (
            <div
              key={hotel._id}
              className={`border-2 p-4 rounded-md cursor-pointer ${
                selectedHotel && selectedHotel._id === hotel._id
                  ? "bg-blue-200"
                  : ""
              }`}
              onClick={() => setSelectedHotel(hotel)}
            >
              <h3 className="text-lg font-semibold">{hotel.name}</h3>
              <p className="text-gray-600">Distance: {distance.toFixed(2)} km</p>
              <p className="text-gray-700">{hotel.address}</p>
              <p className="text-gray-600">Price per night: {hotel.price}</p>

              {/* Room selection for the hotel */}
              <div className="mt-4">
                {["Single", "Double", "Suite"].map((roomType) => (
                  <div key={roomType} className="flex items-center mb-4">
                    <label className="mr-4">{roomType}</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={
                        selectedRooms.find(
                          (room) => room.hotelId === hotel._id && room.type === roomType
                        )?.count || 0
                      }
                      onChange={(e) =>
                        handleRoomChange(hotel._id, roomType, Number(e.target.value))
                      }
                      className="border-2 p-2 w-16"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
        <UserDetailsForm
          userDetails={userDetails}
          handleInputChange={handleInputChange}
        />
      </div>

      {/* Summary and Confirm */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
        <p className="text-gray-600">
          Total Price: {totalPrice.toFixed(2)}
        </p>
      </div>

      <button type="submit" className="btn bg-blue-500 text-white w-full py-3">
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingPage;