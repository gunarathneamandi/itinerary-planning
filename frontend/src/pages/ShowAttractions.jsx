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
    // Navigate with starting location already available
    navigate(`/details/${attractionId}`);
  };

  // const handleLocationSubmit = () => {
  //   if (startingLocation) {
  //     // Close the modal and navigate with the starting location
  //     setShowLocationModal(false);
  //     navigate(`/details/${attraction._id}?start=${startingLocation}`);
  //   }
  // };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto mb-12 space-y-6">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Location..."
            className="w-full px-6 py-4 text-lg border-0 rounded-xl shadow-md focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400/80 bg-white/90 backdrop-blur-sm"
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg 
            className="absolute right-4 top-4 h-6 w-6 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category filter dropdown */}
        <div className="relative">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="w-full px-6 py-4 text-lg appearance-none border-0 rounded-xl shadow-md focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-600"
          >
            <option value="" className="text-gray-400">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category} className="text-gray-600">
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">{attraction.name}</h2>
                    <span className="px-3 py-1 text-sm bg-blue-100/80 text-blue-800 rounded-full">
                      {attraction.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {attraction.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {attraction.location}
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {attraction.address}
                    </div>

                    <div className="flex items-center text-gray-500">
                      {weatherData[attraction._id] ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                          </svg>
                          <span className="font-medium">{weatherData[attraction._id].main.temp}°C</span>
                          <span className="ml-2 text-gray-400">
                            ({weatherData[attraction._id].weather[0].description})
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">Loading weather...</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <button
                    onClick={() => handleViewDetails(attraction._id)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Enter Starting Location</h3>
            <input
              type="text"
              placeholder="e.g., 123 Main Street"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLocationSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAttractions;
