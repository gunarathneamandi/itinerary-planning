import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
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
    attraction,
    hotel,

    checkInDate,
    checkOutDate,
    name,
    email,
    contact,
    address,
    totalPrice,
  } = bookingDetails;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Booking Details</h1>

      {/* Attraction Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Attraction</h2>
        <p className="text-gray-700">{attraction.name}</p>
        <p className="text-gray-600">{attraction.description}</p>
        <p className="text-gray-600">Location: {attraction.location}</p>
      </div>

      {/* Site Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Attraction</h2>
        <p className="text-gray-700">{attraction.name}</p>
        <p className="text-gray-600">{attraction.description}</p>
        <p className="text-gray-600">Location: {attraction.location}</p>
      </div>

      {/* Hotel Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Hotel</h2>
        <p className="text-gray-700">{hotel.name}</p>
        <p className="text-gray-600">{hotel.address}</p>
        <p className="text-gray-600">Price: {hotel.price} LKR</p>
      </div>

      {/* User Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Details</h2>
        <p className="text-gray-700">Name: {name}</p>
        <p className="text-gray-700">Email: {email}</p>
        <p className="text-gray-700">Phone Number: {contact}</p>
        <p className="text-gray-700">Address: {address}</p>
      </div>

      {/* Total Price */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Total Price</h2>
        <p className="text-gray-700">Total: {totalPrice} LKR</p>
      </div>

      {/* Distance */}
      {distance && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Distance Between Hotel and Attraction
          </h2>
          <p className="text-gray-700">Distance: {distance} kilometers</p>
        </div>
      )}

      {/* Map */}
      <div
        id="map"
        style={{ height: "300px", width: "300px", marginBottom: "20px" }}
      ></div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white p-4 rounded-md w-full"
        >
          Back to Home
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-4 rounded-md w-full"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
