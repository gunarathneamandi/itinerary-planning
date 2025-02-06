import express from "express";
import multer from "multer";
import { Attraction } from "../models/attractionModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to save a new attraction
router.post("/", upload.array("photos", 5), async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.description ||
      !request.body.location ||
      !request.body.category ||
      !request.body.entryFee ||
      !request.body.address // Check if address is provided
    ) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }

    const newAttraction = {
      name: request.body.name,
      description: request.body.description,
      category: request.body.category,
      location: request.body.location,
      entryFee: request.body.entryFee,
      address: request.body.address, // Save address as a single string
      photos: request.files.map((file) => `/images/${file.filename}`), // Save image paths
    };

    const attraction = await Attraction.create(newAttraction);

    return response.status(201).send(attraction);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to GET ALL attractions from the database with full image URLs
router.get("/", async (request, response) => {
  try {
    const attractions = await Attraction.find({});

    // Construct full image URLs dynamically
    const baseUrl = `${request.protocol}://${request.get("host")}`;

    const formattedAttractions = attractions.map((attraction) => ({
      ...attraction.toObject(),
      photos: attraction.photos.map((photo) => `${baseUrl}${photo}`),
    }));

    return response.status(200).json({
      count: formattedAttractions.length,
      data: formattedAttractions,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to GET ONE attraction from the database
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return response.status(404).send({ message: "Attraction not found" });
    }

    const baseUrl = `${request.protocol}://${request.get("host")}`;
    const formattedAttraction = {
      ...attraction.toObject(),
      photos: attraction.photos.map((photo) => `${baseUrl}${photo}`),
    };

    return response.status(200).json(formattedAttraction);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
