import mongoose from "mongoose";
// Site schema
const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  activities: { type: [String], required: true },
  description: { type: String, required: false },
  images: { type: [String], required: false },
}, { timestamps: true });

// Model for site
const Site = mongoose.model("Site", siteSchema);

export default Site;