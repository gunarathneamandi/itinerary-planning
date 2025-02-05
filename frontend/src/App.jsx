import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowAttractions from "./pages/ShowAttractions";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/show" element={<ShowAttractions />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/details/:attractionId" element={<BookingPage />} />
      <Route path="/bookingConfirmation/:bookingId" element={<BookingDetailsPage />} />


    </Routes>
  );
};

export default App;
