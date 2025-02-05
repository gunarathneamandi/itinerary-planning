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
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [bookingDate] = useState(new Date().toISOString().split("T")[0]);
  

  const navigate = useNavigate();

  // Use the custom hook for user details
  const { userDetails, handleInputChange } = useUserDetails();

  // Prices for meals and transport
  const mealPrices = { Breakfast: 1000, Lunch: 2000, Dinner: 3000 };
  const transportPrices = { Bike: 500, Car: 1000, "Tuk Tuk": 700 };

  


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

  // Handle meal selection
  const handleMealChange = (meal) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  // Handle transport selection
  const handleTransportChange = (e) => {
    setSelectedTransport(e.target.value);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let mealTotal = selectedMeals.reduce(
      (total, meal) => total + mealPrices[meal],
      0
    );
    let transportTotal = transportPrices[selectedTransport] || 0;
    let hotelTotal = selectedHotel
      ? hotels.find((hotel) => hotel.name === selectedHotel)?.price || 0
      : 0;

    let total = mealTotal + transportTotal + hotelTotal - discount;
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedMeals, selectedTransport, selectedHotel, discount]);

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
      meals: selectedMeals,
      transport: selectedTransport,
      checkInDate,
      checkOutDate,
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
      address: userDetails.address,
      totalPrice: Number(totalPrice),
    };
  
    console.log(bookingDetails);
  
    try {
      const response = await axios.post(
        "http://localhost:5555/bookingConfirmation",
        bookingDetails
      );

      console.log(response.data);

      if (response.data && response.data._id) {
        alert("Booking Success!");
        console.log(bookingDetails)
        // Redirect to the booking details page
       // navigate(`/bookingConfirmation/${response.data.bookingId}`);  // assuming the booking ID is returned from the server
       console.log("Booking ID:", response.data._id); 
       navigate(`/bookingConfirmation/${response.data._id}`);
      } else {
        alert("There was an issue with your booking. Please try again.");
      }
    } catch (error) {
      console.error("Error posting booking details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Booking failed. Server Error: ${error.response.status}. Check the console for details.`
        );
      } else if (error.request) {
        console.error("Request data:", error.request);
        alert(
          "Booking failed. No response from the server. Check the console for details."
        );
      } else {
        console.error("Error message:", error.message);
        alert(
          "Booking failed. Request setup error. Check the console for details."
        );
      }
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
      {/* Display Attraction Details */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{attraction.name}</h1>
        <p className="text-gray-700">{attraction.description}</p>
        <p className="text-gray-600">Category: {attraction.category}</p>
        <p className="text-gray-600">Location: {attraction.location}</p>
        <p className="text-gray-600">Entry Fee: {attraction.entryFee}</p>
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
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
            min={bookingDate}
          />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
            min={checkInDate}
          />
        </div>
      </div>

      {/* Display Hotels */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Hotels Nearby</h2>
        {hotels.length === 0 ? (
          <p>No hotels found in this location.</p>
        ) : (
          <ul className="space-y-4">
            {hotels.map((hotel) => (
              <li
                key={hotel._id}
                className={`... ${
                  selectedHotel && selectedHotel._id === hotel._id
                    ? "bg-blue-100"
                    : ""
                }`}
                onClick={() => setSelectedHotel(hotel)}
              >
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p>{hotel.address}</p>
                <p>City: {hotel.city}</p>
                <p>Price: {hotel.price}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Meal Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Meals</h2>
        <div className="space-y-2">
          {["Breakfast", "Lunch", "Dinner"].map((meal) => (
            <div key={meal}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={meal}
                  checked={selectedMeals.includes(meal)}
                  onChange={() => handleMealChange(meal)}
                />
                <span>{meal}</span>
                <span>- {mealPrices[meal]} LKR</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Transport</h2>
        <select
          value={selectedTransport}
          onChange={handleTransportChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Choose transport type</option>
          {["Bike", "Car", "Tuk Tuk"].map((option) => (
            <option key={option} value={option}>
              {option} - {transportPrices[option]} LKR
            </option>
          ))}
        </select>
      </div>

      {/* User Details Form */}
      <UserDetailsForm
        userDetails={userDetails}
        handleInputChange={handleInputChange}
      />

      {/* Total Price */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Total Price</h2>
        <p>Total: {totalPrice} LKR</p>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-4 rounded-md w-full mt-8"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingPage;
