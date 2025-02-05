import React from "react";

const HomePage = () => {
  return (
    <div className="relative h-screen w-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center top-2 left-2 right-2 bottom-2 rounded-lg"
        style={{ backgroundImage: `url('/images/bgimg2.jpg')` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>

      {/* Navigation Bar */}
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center px-8 py-3 bg-white rounded-full">
        <div className="text-black text-xl font-bold">Journey</div>
        <ul className="flex space-x-6 text-black">
          <li className="hover:underline cursor-pointer">Home</li>
          <li className="hover:underline cursor-pointer">Attractions</li>
          <li className="hover:underline cursor-pointer">Contact</li>
        </ul>
      </nav>

      {/* Content */}
      <div className="absolute bottom-12 right-12 text-right text-white">
        <div>
          <h1 className="text-5xl font-bold drop-shadow-xl text-white mb-4">
            Your journey starts here.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
