import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    itemId: { type: String, required: true }, // attraction, business, or event ID
    itemType: { type: String, required: true }, // e.g., attraction, business
    rating: { type: Number, required: true }, // 1-5
    comment: String,
    date: { type: Date, default: Date.now },
  });
  
  const Review = mongoose.model('Review', reviewSchema);
  export default Review;