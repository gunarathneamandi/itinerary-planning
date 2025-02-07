import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useUserDetails from "../hooks/useUserDetails"; // Import the custom hook
import UserDetailsForm from "../components/UserDetailsForms.jsx"; // Import the UserDetailsForm component
import Site from "../../../backend/models/siteModel.js";

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

  useEffect(() => {
    console.log("Updated Selected Sites:", selectedSites);
  }, [selectedSites]);

  const handleRoomSelection = (roomType) => {
    setSelectedRooms((prevRooms) => {
      if (prevRooms.includes(roomType)) {
        // Room type is already selected, remove it
        return prevRooms.filter((type) => type !== roomType);
      } else {
        // Room type is not selected, add it
        return [...prevRooms, roomType];
      }
    });
  };

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

    console.log(selectedSites);
    const bookingDetails = {
      startingLocation: startingLocation,
      attraction: attraction,
      sites: selectedSites.map((site) => site.siteId),
      hotel: selectedHotel?._id || null,
      rooms: selectedRooms,
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
      console.error(
        "Error posting booking details:",
        error.response?.data || error.message
      );

      alert("Booking failed. Please try again.");
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
  className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl"
  noValidate
>
  {/* Starting Location */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
      Starting Location
    </h2>
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={startingLocation}
          onChange={(e) => setStartingLocation(e.target.value)}
          placeholder="Enter your starting location"
          required
          className="w-full pl-12 pr-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <button
        type="button"
        onClick={handleCaptureLocations}
        className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        Capture Location
      </button>
    </div>
  </div>

  {/* Attraction Information */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{attraction.name}</h1>
    <p className="text-gray-600 leading-relaxed mb-6">{attraction.description}</p>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center text-gray-600">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {attraction.category}
      </div>
      <div className="flex items-center text-gray-600">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        {attraction.location}
      </div>
    </div>
    {attraction.photos && attraction.photos.length > 0 && (
      <div className="grid grid-cols-2 gap-4">
        {attraction.photos.map((photo, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl aspect-video">
            <img
              src={photo}
              alt={`Attraction ${index + 1}`}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>
    )}
  </div>

 {/* Site Selection */}
{showSites && matchingSites.length > 0 && (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
      Select Sites to Visit
    </h2>
    <div className="space-y-4">
      {matchingSites.map((site, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-blue-100 transition-all"
        >
          <label className="flex items-start gap-4 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="checkbox"
                value={site.siteId}
                checked={selectedSites.some(selected => selected.siteId === site.siteId)} // Add checked state
                onChange={(e) => handleSiteSelection(e, site)}
                className="sr-only"
              />
              <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                selectedSites.some(selected => selected.siteId === site.siteId) 
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300'
              }`}>
                <svg 
                  className={`w-4 h-4 text-white transition-opacity ${
                    selectedSites.some(selected => selected.siteId === site.siteId) 
                      ? 'opacity-100' 
                      : 'opacity-0'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{site.siteName}</h3>
              <p className="text-gray-600 mt-2"><span className="font-medium">Address:</span> {site.siteAddress}</p>
              <p className="text-gray-600"><span className="font-medium">Description:</span> {site.description || "No description available"}</p>
            </div>
          </label>
        </div>
      ))}
    </div>
  </div>
)}

  {/* Dates */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
      Select Dates
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
        <input
          type="date"
          value={checkInDate}
          onChange={handleCheckInDateChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <svg className="absolute right-4 bottom-3 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
          min={checkInDate}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <svg className="absolute right-4 bottom-3 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </div>

  {/* Hotel Selection */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
      Choose Your Hotel
    </h2>
    <div className="space-y-4">
      {hotelDistances.map(({ hotel, distance }) => (
        <div
          key={hotel._id}
          className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedHotel?._id === hotel._id
              ? "border-blue-500 bg-blue-50 shadow-lg"
              : "border-gray-200 hover:border-blue-200"
          }`}
          onClick={() => setSelectedHotel(hotel)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
              <p className="text-blue-600 font-medium mt-2">
                {distance.toFixed(2)} km from attraction
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              ★ {hotel.rating || "4.5"}
            </span>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {hotel.address}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {hotel.phone}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Available Room Types</h4>
            <div className="flex flex-wrap gap-3">
              {hotel.roomTypes.map((roomType) => (
                <label
                  key={roomType}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    selectedRooms.includes(roomType)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(roomType)}
                    onChange={() => handleRoomSelection(roomType)}
                    className="sr-only"
                  />
                  <span>{roomType}</span>
                  {selectedRooms.includes(roomType) && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* User Details */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
      Your Details
    </h2>
    <UserDetailsForm
      userDetails={userDetails}
      handleInputChange={handleInputChange}
    />
  </div>

  {/* Booking Summary */}
  <div className="mb-8 p-6 bg-blue-50 rounded-xl">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Summary</h2>
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold text-gray-700">Total Price:</span>
      <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
    </div>
  </div>

  <button
    type="submit"
    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
  >
    Confirm Booking
  </button>
</form>
  );
};

export default BookingPage;
