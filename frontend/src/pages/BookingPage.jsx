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
  const [matchingRoutes, setMatchingRoutes] = useState([]); // Stores matched routes
  const [matchingSites, setMatchingSites] = useState([]); // Stores matched site IDs
  const [showSites, setShowSites] = useState(false); // Controls visibility of sites
  const [selectedSites, setSelectedSites] = useState([]);

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
      const updatedRooms = [...prev];
      const existingHotelIndex = updatedRooms.findIndex(
        (hotel) => hotel.hotelId === hotelId
      );

      if (existingHotelIndex !== -1) {
        const existingHotel = updatedRooms[existingHotelIndex];
        const roomIndex = existingHotel.rooms.findIndex(
          (room) => room.type === roomType
        );

        if (roomIndex !== -1) {
          if (count === 0) {
            // Remove the room if count is 0
            existingHotel.rooms.splice(roomIndex, 1);
          } else {
            existingHotel.rooms[roomIndex].count = count;
          }
        } else if (count > 0) {
          // Add new room type if it doesn't exist
          existingHotel.rooms.push({ type: roomType, count });
        }
      } else if (count > 0) {
        // Add new hotel with the room type
        selectedRooms.push({
          hotelId,
          rooms: [{ type: roomType, count }],
        });
      }

      return updatedRooms;
    });
  };

  // Calculate total price
  // const calculateTotalPrice = () => {
  //   let roomTotal = selectedRooms.reduce((total, hotel) => {
  //     hotel.rooms.forEach(
  //       (room) => (total += room.count * roomPrices[room.type])
  //     );
  //     return total;
  //   }, 0);

  //   let hotelTotal = selectedHotel ? selectedHotel.price : 0;
  //   let total = roomTotal + hotelTotal - discount;
  //   setTotalPrice(total);
  // };

  // useEffect(() => {
  //   calculateTotalPrice();
  // }, [selectedRooms, selectedHotel, discount]);

  const handleBooking = async (e) => {
    e.preventDefault();

    

    if (
      !startingLocation ||
      !attraction ||
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.contact ||
      !userDetails.address
    ) {
      alert("Please complete all fields before booking.");
      return;
    }

    const bookingDetails = {
      startingLocation: startingLocation,
      attraction: attraction,
      sites: selectedSites._id,
      hotel: selectedHotel._id,
      rooms: "selectedRooms",
      checkInDate,
      checkOutDate,
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
      address: userDetails.address,
      totalPrice: totalPrice,
    };

    try {
      console.log(bookingDetails);
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
      console.error("Error posting booking details:", error.response?.data || error.message);

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
  const handleCaptureLocations = async () => {
    if (attraction.location && startingLocation) {
      try {
        console.log("Starting Location:", startingLocation);
        console.log("Attraction Location:", attraction.location);

        // Fetch routes using axios
        const response = await axios.get("http://localhost:5555/routes"); // Adjust URL if needed
        const routes = response.data;

        // Find matching routes
        const matchingRoute = routes.filter(
          (route) =>
            route.startLocation === startingLocation &&
            route.finalDestination === attraction.location
        );

        // Check if we found a matching route and if sites are populated
        if (matchingRoute && matchingRoute.length > 0) {
          console.log("Matching Route Found:", matchingRoute);

          // Populate the sites data (site._id, name, etc.)
          const siteDetails = matchingRoute[0].sites; // Use the first matching route

          // Extract and log details of sites
          const siteIds = siteDetails.map((site) => ({
            siteId: site._id,
            siteName: site.name,
            siteAddress: site.address,
          }));
          console.log("Site IDs and Details:", siteIds);

          // Update state to trigger rendering of sites in UI
          setMatchingSites(siteIds); // Store site details in state
          setShowSites(true); // Set showSites to true to display the sites
        } else {
          console.log("No matching route found.");
          setMatchingSites([]); // Clear previous sites in case of no match
          setShowSites(false); // Hide the sites container if no matching route
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
        setMatchingSites([]); // Clear sites on error
        setShowSites(false); // Hide sites container on error
      }
    } else {
      alert(
        "Please enter both the starting location and select an attraction."
      );
    }
  };

  const handleSiteSelection = (e, site) => {
    const { checked, value } = e.target; // Destructure to get checkbox status and value

    if (checked) {
      // If checkbox is checked, add the site to the selected sites array
      setSelectedSites((prevSelected) => [
        ...prevSelected, // Preserve previous selected sites
        {
          siteId: value,
          siteName: site.siteName,
          siteAddress: site.siteAddress,
        },
      ]);
    } else {
      // If checkbox is unchecked, remove the site from the selected sites array
      setSelectedSites((prevSelected) =>
        prevSelected.filter((selectedSite) => selectedSite.siteId !== value)
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!attraction) {
    return <div>Attraction not found.</div>;
  }

  return (
    <form
      onSubmit={handleBooking}
      className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg"
    >
      {/* Starting Location */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Enter Starting Location
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={startingLocation}
            onChange={(e) => setStartingLocation(e.target.value)}
            placeholder="Enter your starting location"
            required
            className="border-2 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleCaptureLocations}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            Capture
          </button>
        </div>
      </div>

      {/* Attraction Information */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          {attraction.name}
        </h1>
        <p className="text-gray-700 mb-2">{attraction.description}</p>
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
                className="w-full h-auto rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
      </div>

      {/* Site Selection */}
      {showSites && matchingSites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Select Sites to Visit
          </h2>
          {matchingSites.map((site, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4"
            >
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={site.siteId}
                  onChange={(e) => handleSiteSelection(e, site)}
                  className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                <span className="text-gray-700">{site.siteName}</span>
              </label>
              <p className="text-gray-600 mt-2">
                <strong>Address:</strong> {site.siteAddress}
              </p>
              <p className="text-gray-600">
                <strong>Description:</strong>{" "}
                {site.description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Dates */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Select Dates
        </h2>
        <div className="space-y-4">
          <input
            type="date"
            value={checkInDate}
            onChange={handleCheckInDateChange}
            required
            className="border-2 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
            min={checkInDate}
            className="border-2 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Hotel Selection */}
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
              <p className="text-gray-600">
                Distance: {distance.toFixed(2)} km
              </p>
              <p className="text-gray-700">{hotel.address}</p>

              <p className="text-gray-600">City: {hotel.city}</p>
              <p className="text-gray-600">
                Contact: {hotel.phone} | {hotel.email}
              </p>
              <p className="text-gray-600">Facilities {hotel.facilities}</p>

              {/* Compact and cute room selection */}
              <div className="mt-4 flex flex-wrap gap-4">
                {hotel.roomTypes.map((roomType) => {
                  const room = selectedRooms.find(
                    (room) =>
                      room.hotelId === hotel._id && room.type === roomType
                  );
                  const roomCount = room ? room.count : "";

                  return (
                    <div
                      key={roomType}
                      className={`w-24 h-24 p-4 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                        roomCount > 0 ? "bg-blue-200" : "bg-white"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-2">
                        {roomType}
                      </div>
                      <input
                        type="text"
                        value={roomCount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleRoomChange(
                              hotel._id,
                              roomType,
                              Number(value)
                            );
                          }
                        }}
                        className="border-2 p-1 w-12 text-center rounded-md"
                      />
                      <span className="text-xs mt-2">rooms</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Enter Your Details
        </h2>
        <UserDetailsForm
          userDetails={userDetails}
          handleInputChange={handleInputChange}
        />
      </div>

      {/* Booking Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Booking Summary
        </h2>
        <p className="text-gray-600">Total Price: {totalPrice.toFixed(2)}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingPage;
