import express from "express";
import Site from "../models/siteModel.js";
import Route from "../models/routeModel.js";

const router = express.Router();

// Fetch sites based on start and final location
router.get("/", async (req, res) => {
  const { startLocation, finalDestination } = req.query;

  try {
    // Fetch route IDs corresponding to the startLocation and finalDestination
    const routes = await Route.find({
      startLocation: startLocation,
      finalDestination: finalDestination,
    });

    // Extract site IDs from the routes
    const siteIds = routes.map(route => route.siteId);

    // Fetch sites using the site IDs
    const sites = await Site.find({
      _id: { $in: siteIds },
    });

    res.json(sites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sites" });
  }
});

// Fetch sites based on the provided site ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch site by its ID
    const site = await Site.findById(id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json(site);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch site" });
  }
});


export default router;
