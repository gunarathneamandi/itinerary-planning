import express from "express";
import { Attraction } from "../models/attractionModel.js";
import { Hotel } from "../models/hotelModel.js";

const router = express.Router();

// Route to save a new hotel
router.post("/", async (request, response) => {
  try {
    const { name, address, city, phone, email, facilities, roomTypes } =
      request.body;

    // Check for required fields
    if (!name || !address || !city || !roomTypes) {
      return response.status(400).send({
        message:
          "Please send all required fields: name, address, city, roomTypes",
      });
    }

    // Validate phone (optional, if provided)
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return response
        .status(400)
        .send({
          message: "Invalid phone number format. It should be 10 digits.",
        });
    }

    // Validate email (optional, if provided)
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return response.status(400).send({ message: "Invalid email format." });
    }

    // Create the new hotel object
    const newHotel = {
      name,
      address,
      city,
      phone,
      email,
      facilities: facilities || [], // Default to an empty array if no facilities provided
      roomTypes: roomTypes || ["Single", "Double", "Suite"], // Default to predefined room types if not provided
    };

    // Save the hotel to the database
    const hotel = await Hotel.create(newHotel);

    return response.status(201).send(hotel);
  } catch (error) {
    console.log(error.message);
    response
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
});

// Endpoint to fetch hotels based on attraction location
router.get("/hotels/:attractionId", async (req, res) => {
  try {
    const { attractionId } = req.params;

    // Find the attraction by ID
    const attraction = await Attraction.findById(attractionId);
    if (!attraction) {
      return res.status(404).json({ message: "Attraction not found" });
    }

    // Find hotels in the same location as the attraction
    const hotels = await Hotel.find({ city: attraction.location });

    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found for this attraction location" });
    }

    res.status(200).json({ hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Route to fetch all hotels
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
