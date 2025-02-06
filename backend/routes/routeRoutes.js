import express from 'express';
import mongoose from 'mongoose';
import Route from '../models/routeModel.js';
import Site from '../models/siteModel.js';  // Import the Site model

const router = express.Router();

// Route to add a new Route
router.post('/', async (req, res) => {
  try {
    const { startLocation, finalDestination, sites } = req.body;

    // Create a new Route document
    const newRoute = new Route({
      startLocation,
      finalDestination,
      sites,
    });

    // Save the Route to the database
    await newRoute.save();

    res.status(201).json({
      message: 'Route created successfully!',
      route: newRoute,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating route', error });
  }
});

// Route to get all Routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('sites');
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error });
  }
});

// Route to get a specific Route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('sites');
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route', error });
  }
});

export default router;
