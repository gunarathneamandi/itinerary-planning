import express from "express";
import Site from "../models/siteModel.js"; // Import the Site model using ES6 import
const router = express.Router();

// Add a new site
router.post("/", async (req, res) => {
  const { name, address, activities, description, images } = req.body;

  try {
    const newSite = new Site({
      name,
      address,
      activities,
      description,
      images,
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

export default router; // Export the router with ES6 export
