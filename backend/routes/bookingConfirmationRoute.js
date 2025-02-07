import express from "express";
import { Booking } from "../models/bookingModel.js";
import { Attraction } from "../models/attractionModel.js";
import { Hotel } from "../models/hotelModel.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (request, response) => {
  try {
    console.log("Request Body Received:", request.body); // Log the request body
    console.log("Incoming Request Body:", request.body);
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
    } = request.body;

    // List of required fields
    const requiredFields = [
      "startingLocation",
      "attraction",
      "name",
      "email",
      "contact",
      "address",
    
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !request.body[field]
    );

    console.log(missingFields);

    if (missingFields.length > 0) {
      console.log("Missing Fields:", missingFields); // Log missing fields
      return response.status(400).json({
        message: "Send all required fields",
        missingFields: missingFields, // Include missing fields in the response
      });
    }

    // Validate and Convert hotel ID (Crucial)
    let hotelObjectId;
    if (!hotel || !mongoose.Types.ObjectId.isValid(hotel)) {
      return response.status(400).json({ message: "Invalid hotel ID" });
    } else {
      hotelObjectId = new mongoose.Types.ObjectId(hotel);
    }

    // // Validate totalPrice
    // if (isNaN(totalPrice) || totalPrice < 0) {
    //   return response.status(400).json({ message: "Invalid total price" });
    // }

    const newBooking = {
      startingLocation,
      attraction,
      sites, 
      hotel, // Use the converted ObjectId
      rooms,
      checkInDate,
      checkOutDate: checkOutDate || null,

      name,
      email,
      contact,
      address,
      totalPrice: totalPrice || null,
    };

    const booking = await Booking.create(newBooking); // Or newBooking.save()
    return response.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error.response); // Log the full error for debugging
    response.status(500).json({ message: error.message }); // Send a more generic message to the client
  }
});

// Get booking details by ID (or all bookings if no ID is provided)
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    let bookings;

    if (id) {
      // If an ID is provided, fetch the specific booking
      bookings = await Booking.findById(id)
        .populate("attraction") // Populate the attraction details
        .populate("hotel") // Populate the hotel details
        .exec();

      if (!bookings) {
        return response.status(404).json({ message: "Booking not found" });
      }
    } else {
      // If no ID is provided, fetch all bookings
      bookings = await Booking.find()
        .populate("attraction") // Populate the attraction details
        .populate("hotel") // Populate the hotel details
        .exec();
    }

    return response.status(200).json(bookings); // Return the populated booking details
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    response.status(500).json({ message: error.message });
  }
});

// DELETE a booking by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully", deletedBooking });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get all bookings
router.get('/allbooking', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('attraction') // Populate attraction details
      .populate('hotel') // Populate hotel details
      .populate('sites'); // Populate site details

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export default router;
