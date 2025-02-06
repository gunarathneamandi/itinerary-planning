import mongoose from "mongoose";

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true }, // general location (like city)
  
  weather: { type: String, required: false },
  photos: [{ type: String }],
  address: { type: String, required: true }, // full address as a single string
});

export const Attraction = mongoose.model("Attraction", attractionSchema);
