import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate(); // Initialize navigate function

  const handleStartJourney = () => {
    navigate("/show"); // Navigate to the /show page
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center top-2 left-2 right-2 bottom-2 rounded-lg"
        style={{ backgroundImage: "url('/images/bg2.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      {/* Navigation Bar */}
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center px-8 py-4 bg-white bg-opacity-60 backdrop-blur-lg rounded-full shadow-lg">
        <div className="text-black text-2xl font-bold cursor-pointer hover:text-blue-500 transition duration-300 ease-in-out">
          Journey
        </div>
        <ul className="flex space-x-8 text-black font-medium">
          <li className="hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out">Home</li>
          <li className="hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out"> <Link to="/show" className="hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out">
              Attractions
            </Link></li>
          <li className="hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out">Contact</li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="absolute bottom-16 left-16 md:left-32 text-left text-white">
        <h1 className="text-6xl font-extrabold leading-tight drop-shadow-lg mb-6">
          Discover the World, One Journey at a Time.
        </h1>
        <p className="text-lg mb-8 opacity-90">
          Explore top destinations, hidden gems, and experiences that await you.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleStartJourney}>
          Start Your Adventure
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white opacity-70 text-sm">
        <p>&copy; 2025 Journey. All rights reserved.</p>
      </div>
    </div>
  );
};

export default HomePage;
