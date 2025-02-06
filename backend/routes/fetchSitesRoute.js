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

export default router;
