import mongoose from 'mongoose';
import Site from '../models/siteModel.js';  // Import Site model

// Route schema
const routeSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  finalDestination: { type: String, required: true },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }]
});

const Route = mongoose.model('Route', routeSchema);

export default Route;
