import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowAttractions from "./pages/ShowAttractions";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import AdminAddHotel from "./pages/HotelAdding";
import AdminAddAttraction from "./pages/AdminAddAttraction"; 
import AdminViewAttraction from "./pages/AdminViewAttraction";
import SitesPage from "./pages/SitesPage";
import SiteFound from "./pages/SiteFound";

const App = () => {
  return (
    <Routes>
      <Route path="/show" element={<ShowAttractions />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/details/:attractionId" element={<BookingPage />} />
      <Route path="/bookingConfirmation/:bookingId" element={<BookingDetailsPage />} />
      <Route path="/sites" element={<SitesPage />} />

      <Route path="/admin/addhotel" element={<AdminAddHotel />} /> 
      <Route path="/admin/addattraction" element={<AdminAddAttraction />} />
      <Route path="/admin/viewattraction" element={<AdminViewAttraction />} />


      <Route path="/showsite" element={<SiteFound/>}/>
    </Routes>
  );
};

export default App;
