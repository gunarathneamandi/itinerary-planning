import mongoose from "mongoose";

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  entryFee: { type: String, required: true },
  weather: { type: String, required: false },
  photos: [{ type: String }],
});

export const Attraction = mongoose.model("Attraction", attractionSchema);
