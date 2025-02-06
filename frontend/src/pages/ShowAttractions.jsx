import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const ShowAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [startingLocation, setStartingLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false); // To manage location input modal
  const navigate = useNavigate();
  const keys = ["name", "category", "location"];

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/attractions")
      .then((response) => {
        setAttractions(response.data.data);
        setLoading(false);
        fetchWeatherData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch categories based on attractions data
    const uniqueCategories = [
      ...new Set(attractions.map((attraction) => attraction.category)),
    ];
    setCategories(uniqueCategories);
  }, [attractions]);

  // Function to fetch weather data for each location
  const fetchWeatherData = (attractions) => {
    const weatherPromises = attractions.map((attraction) =>
      axios
        .get(`http://localhost:5000/weather/${attraction.location}`)
        .then((response) => ({
          [attraction._id]: response.data, // Store weather data using attraction ID as the key
        }))
        .catch((error) => console.log("Weather data fetch error", error))
    );

    // After all weather data is fetched, update the weatherData state
    Promise.all(weatherPromises).then((weatherResults) => {
      const weatherMap = weatherResults.reduce((acc, weather) => {
        return { ...acc, ...weather };
      }, {});
      setWeatherData(weatherMap);
    });
  };

  const handleViewDetails = (attractionId) => {
    if (!startingLocation) {
      // If starting location is not set, show modal to input it
      setShowLocationModal(true);
    } else {
      // Navigate with starting location already available
      navigate(`/details/${attractionId}?start=${startingLocation}`);
    }
  };

  const handleLocationSubmit = () => {
    if (startingLocation) {
      // Close the modal and navigate with the starting location
      setShowLocationModal(false);
      navigate(`/details/${attraction._id}?start=${startingLocation}`);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Search input */}
      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search by Location"
          className="w-full border rounded-md p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setQuery(e.target.value)} // Sets the query state based on the input value
        />
      </div>

      {/* Category filter dropdown */}
      <div className="mb-6 max-w-xl mx-auto">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="w-full border rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Attractions list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <Spinner />
        ) : (
          attractions
            .filter((attraction) => {
              const matchesSearch = keys.some((key) =>
                attraction[key]
                  .toString()
                  .toLowerCase()
                  .includes(query.toLowerCase())
              );
              const matchesCategory = selectedCategory
                ? attraction.category === selectedCategory
                : true;
              return matchesSearch && matchesCategory;
            })
            .map((attraction, index) => (
              <div
                key={attraction._id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {attraction.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {attraction.description}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    <strong>Category:</strong> {attraction.category}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    <strong>Location:</strong> {attraction.location}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    <strong>Address:</strong> {attraction.address}{" "}
                    {/* Displaying the real address */}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    {weatherData[attraction._id] ? (
                      <>
                        <p>{weatherData[attraction._id].main.temp}°C</p>
                        <p className="ml-2">
                          {weatherData[attraction._id].weather[0].description}
                        </p>
                      </>
                    ) : (
                      <p>Loading weather...</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleViewDetails(attraction._id)}
                    className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Location input modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Enter Your Starting Location</h3>
            <input
              type="text"
              placeholder="Starting Location"
              className="w-full border rounded-md p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleLocationSubmit}
                className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Submit
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="ml-4 bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAttractions;
