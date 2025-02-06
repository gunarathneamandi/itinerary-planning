const mongoose = require('mongoose');
const Site = require('./Site');  // Import Site model

// Route schema
const routeSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  finalDestination: { type: String, required: true },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }]
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
