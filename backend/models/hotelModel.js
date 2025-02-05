import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true }, // e.g., restaurant, accommodation
  city: { type: String, required: true },
  phone: String,
  email: String,
  facilities: String,
  photos: [String],
});

export const Hotel = mongoose.model("Hotel", hotelSchema);
