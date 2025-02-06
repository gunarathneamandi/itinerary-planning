import React, { useState, useEffect } from "react";
import axios from "axios";

const SiteFound = () => {
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [matchingRoutes, setMatchingRoutes] = useState([]);
  const [matchingSites, setMatchingSites] = useState([]);
  const [showSites, setShowSites] = useState(false);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axios.get("http://localhost:5555/attractions");
        setAttractions(response.data.data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };

    fetchAttractions();
  }, []);

  const handleAttractionSelect = async (attraction) => {
    setSelectedAttraction(attraction);
    setShowSites(false);
    setMatchingSites([]);
    setStartLocation("");
    try {
      const response = await axios.get("http://localhost:5555/routes");
      const routes = response.data;
      const filteredRoutes = routes.filter(
        (route) => route.finalDestination === attraction.location
      );
      setMatchingRoutes(filteredRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleStartLocationSelect = (event) => {
    const selectedStart = event.target.value;
    setStartLocation(selectedStart);
    const matchedRoute = matchingRoutes.find(
      (route) => route.startLocation === selectedStart
    );
    if (matchedRoute) {
      setMatchingSites(matchedRoute.sites);
      setShowSites(true);
    } else {
      setMatchingSites([]);
      setShowSites(false);
    }
  };

  return (
    <div className="container">
      <h1>Select an Attraction and Starting Point</h1>

      <div>
        <h2>Select an Attraction</h2>
        <select
          value={selectedAttraction ? selectedAttraction._id : ""}
          onChange={(e) => {
            const attraction = attractions.find((a) => a._id === e.target.value);
            handleAttractionSelect(attraction);
          }}
        >
          <option value="">Select an Attraction</option>
          {attractions.map((attraction) => (
            <option key={attraction._id} value={attraction._id}>
              {attraction.name}
            </option>
          ))}
        </select>
      </div>

      {selectedAttraction && matchingRoutes.length > 0 && (
        <div>
          <h2>Select Starting Point</h2>
          <select value={startLocation} onChange={handleStartLocationSelect}>
            <option value="">Select a Starting Point</option>
            {matchingRoutes.map((route, index) => (
              <option key={index} value={route.startLocation}>
                {route.startLocation}
              </option>
            ))}
          </select>
        </div>
      )}

      {showSites && matchingSites.length > 0 && (
        <div>
          <h2>Sites Along the Route</h2>
          <ul>
            {matchingSites.map((site) => (
              <li key={site._id}>
                <h3>{site.name}</h3>
                <p>{site.description}</p>
                <p>Activities: {site.activities.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SiteFound;
