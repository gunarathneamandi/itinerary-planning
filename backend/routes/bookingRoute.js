import express from "express";
import { Attraction } from "../models/attractionModel.js";
import {Hotel} from "../models/hotelModel.js";

const router = express.Router();

//Route to save a new hotel
router.post("/", async (request, response) => {
  try {
    if (!request.body.name || !request.body.address || !request.body.city) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }
    const newHotel = {
      name: request.body.name,
      address: request.body.address,
      city: request.body.city,
      phone: request.body.phone,
      email: request.body.email,
      facilities: request.body.facilities,
    };

    const hotel = await Hotel.create(newHotel);

    return response.status(201).send(hotel);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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

    res.status(200).json({ hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
