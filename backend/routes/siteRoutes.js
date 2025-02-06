import express from "express";
import multer from "multer"; // Middleware to handle form-data
import Site from "../models/siteModel.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Set folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
  },
});
const upload = multer({ storage });

// Add a new site
router.post("/", upload.single("images"), async (req, res) => {
  const { name, address, activities, description } = req.body;

  // Check required fields
  if (!name || !address) {
    return res.status(400).json({ message: "Name and address are required" });
  }

  try {
    const newSite = new Site({
      name,
      address,
      activities,
      description,
      images: req.file ? req.file.path : null, // Use uploaded file path
    });

    // Save the new site to the database
    await newSite.save();
    res.status(201).json({ message: "Site added successfully", site: newSite });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding site", error: error.message });
  }
});

// Get all sites
router.get("/", async (req, res) => {
  try {
    const sites = await Site.find();
    res.status(200).json(sites);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving sites", error: error.message });
  }
});

// Get a single site by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const site = await Site.findById(id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.status(200).json(site);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving site", error: error.message });
  }
});

export default router;
