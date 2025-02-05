import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define Booking Schema
const bookingSchema = new Schema(
  {
    // Reference to the attraction
    attraction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attraction", // Reference to Attraction model
      required: true,
    },
    // Selected hotel details
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
  },
    // Check-in date
    checkInDate: {
      type: Date,
      required: true, // Check-in date is mandatory
    },
    // Check-out date
    checkOutDate: {
      type: Date,
      required: false, // Check-out date is optional
    },

    // Selected meals (breakfast, lunch, dinner)
    meals: {
      type: [String],
      enum: ["Breakfast", "Lunch", "Dinner"], // Restrict options
      required: false,
    },
    // Selected transport mode
    transport: {
      type: String,
      enum: ["Bike", "Car", "Tuk Tuk"], // Restrict options
      required: false,
    },
    // User details

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    // Total price of the package
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Timestamp for booking date
    bookingDate: {
      type: Date,
      default: Date.now, // Default to current date
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export Booking Model
export const Booking = model("Booking", bookingSchema);
