import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowAttractions from "./pages/ShowAttractions";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import AdminAddHotel from "./pages/AdminAddHotel";
import AdminAddAttraction from "./pages/AdminAddAttraction"; 
import AdminViewAttraction from "./pages/AdminViewAttraction";
import SitesPage from "./pages/SitesPage";
import SiteFound from "./pages/SiteFound";
import AdminHotelView from "./pages/AdminHotelView";
import AdminLogin from "./pages/LoginPage";
import AdminHome from "./pages/AdminHome";
import BookingList from "./pages/BookingList";

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

      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin/home" element={<AdminHome/>}/> 

      <Route path="/showsite" element={<SiteFound/>}/>
      <Route path="/admin/hotelview" element={<AdminHotelView/>}/>
      <Route path="/admin/bookingview" element={<BookingList/>}/>
     

    </Routes>
  );
};

export default App;
