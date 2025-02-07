import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [siteDetails, setSiteDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [distance, setDistance] = useState(null); // State to store distance

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/bookingConfirmation/${bookingId}`
        );
        setBookingDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching booking details:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };


    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      if (bookingDetails && sites && sites.length > 0) {
        try {
          const siteDetailsArray = [];
          for (const site of sites) {
            const response = await axios.get(`http://localhost:5555/sites/details/${site}`);
            siteDetailsArray.push(response.data);
          }
          setSiteDetails(siteDetailsArray);
        } catch (error) {
          console.error("Error fetching site details:", error);
        }
      }
    };
  
    fetchSiteDetails();
  }, [bookingDetails]);
  

  

  // Function to geocode address using Nominatim API
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

  // Function to calculate distance between two coordinates using OSRM
  const getDistance = async (hotelLocation, attractionLocation) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${hotelLocation.lon},${hotelLocation.lat};${attractionLocation.lon},${attractionLocation.lat}?overview=false&steps=true`
      );

      if (response.data.code === "Ok") {
        const distance = response.data.routes[0].legs[0].distance;
        setDistance(distance / 1000); // Distance in kilometers
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    setDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5555/bookingConfirmation/${bookingId}`
      );
      alert("Booking deleted successfully!");
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error(
        "Error deleting booking:",
        error.response?.data || error.message
      );
      alert("Failed to delete the booking. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const renderMap = (hotelLocation, attractionLocation) => {
    const map = L.map("map").setView(
      [hotelLocation.lat, hotelLocation.lon],
      10
    );

    // Set OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers for hotel and attraction
    L.marker([hotelLocation.lat, hotelLocation.lon])
      .addTo(map)
      .bindPopup("Hotel")
      .openPopup();
    L.marker([attractionLocation.lat, attractionLocation.lon])
      .addTo(map)
      .bindPopup("Attraction")
      .openPopup();

    map.fitBounds([
      [hotelLocation.lat, hotelLocation.lon],
      [attractionLocation.lat, attractionLocation.lon],
    ]);
  };

  useEffect(() => {
    if (bookingDetails) {
      const fetchLocations = async () => {
        const hotelLocation = await geocodeAddress(
          bookingDetails.hotel.address
        );
        const attractionLocation = await geocodeAddress(
          bookingDetails.attraction.location
        );

        if (hotelLocation && attractionLocation) {
          // Calculate distance between the hotel and attraction
          getDistance(hotelLocation, attractionLocation);
          // Render the map
          renderMap(hotelLocation, attractionLocation);
        }
      };
      fetchLocations();
    }
  }, [bookingDetails]);

  if (loading) return <div>Loading...</div>;
  if (!bookingId) return <div>Invalid booking ID.</div>;
  if (!bookingDetails) return <div>Booking not found.</div>;

  const {
    startingLocation,
    attraction,
    sites,
    hotel,
    rooms,
    checkInDate,
    checkOutDate,
    name,
    email,
    contact,
    address,
    totalPrice,
  } = bookingDetails;

  



  console.log(bookingDetails);
  console.log(siteDetails);



  const fetchSiteDetailsById = async (siteId) => {
    try {
      const response = await axios.get(`/sites/${siteId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site details:", error);
      return null;
    }
  };
  

  
  

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
  <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    Your Travel Itinerary
  </h1>

  {/* Starting Location */}
  <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
      <h2 className="text-xl font-semibold text-gray-800">Starting Location</h2>
    </div>
    <p className="text-gray-600 flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      {startingLocation}
    </p>
  </div>

  {/* Sites of Visit */}
  {siteDetails.length > 0 && (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-green-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-800">Sites to Visit</h2>
      </div>
      <div className="space-y-4">
        {siteDetails.map((site, index) => (
          <div key={index} className="p-4 border-l-4 border-green-300 bg-green-50 rounded-md">
            <p className="text-gray-800 font-medium mb-1">{site.name}</p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              {site.address}
            </p>
            {site.activities && <p className="text-gray-600 text-sm mt-1">Activities: {site.activities}</p>}
            <p className="text-gray-600 text-sm mt-1">{site.description}</p>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Attraction Details */}
  <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
      <h2 className="text-xl font-semibold text-gray-800">Attraction Details</h2>
    </div>
    <div className="space-y-2">
      <p className="text-gray-800 font-medium">{attraction.name}</p>
      <p className="text-gray-600 text-sm">{attraction.description}</p>
      <p className="text-gray-600 text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        </svg>
        {attraction.location}
      </p>
    </div>
  </div>

  {/* Stay Details */}
  <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
      <h2 className="text-xl font-semibold text-gray-800">Accommodation</h2>
    </div>
    <div className="space-y-2">
      <p className="text-gray-800 font-medium">{hotel.name}</p>
      <p className="text-gray-600 text-sm">{hotel.address}</p>
      <p className="text-gray-600 text-sm">Price: <span className="font-medium text-purple-600">{hotel.price} LKR</span></p>
    </div>
  </div>

  {/* Dates */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Check-In</h3>
      <p className="text-gray-800 font-medium">{checkInDate}</p>
    </div>
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Check-Out</h3>
      <p className="text-gray-800 font-medium">{checkOutDate}</p>
    </div>
  </div>

  {/* Distance */}
  {distance && (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">Distance to Attraction</h2>
      </div>
      <p className="text-gray-600 ml-9">{distance} km</p>
    </div>
  )}

  {/* User Details */}
  <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-8 bg-gray-500 rounded-full"></div>
      <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Name</p>
        <p className="text-gray-800 font-medium">{name}</p>
      </div>
      <div>
        <p className="text-gray-600">Email</p>
        <p className="text-gray-800 font-medium">{email}</p>
      </div>
      <div>
        <p className="text-gray-600">Phone</p>
        <p className="text-gray-800 font-medium">{contact}</p>
      </div>
      <div>
        <p className="text-gray-600">Address</p>
        <p className="text-gray-800 font-medium">{address}</p>
      </div>
    </div>
  </div>

  {/* Total Price */}
  <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Total Price</h2>
      <p className="text-2xl font-bold text-blue-600">{totalPrice} LKR</p>
    </div>
  </div>

  {/* Map */}
  <div className="mb-8 flex justify-center">
    <div id="map" className="h-40 w-full max-w-xs border rounded-xl shadow-inner"></div>
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={() => navigate("/")}
      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1"
    >
      Back to Home
    </button>
    <button
      onClick={handleDelete}
      className="px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex-1"
      disabled={deleting}
    >
      {deleting ? "Deleting..." : "Delete Booking"}
    </button>
  </div>
</div>

  );
};

export default BookingDetailsPage;
