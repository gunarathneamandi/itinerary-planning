import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define Booking Schema
const bookingSchema = new Schema(
  {
    //starting location
    startingLocation: {
      type: String,
      required: true,
    },
    // Reference to the attraction
    attraction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attraction", // Reference to Attraction model
      required: true,
    },
    sites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: false,
    }],
    

    // Selected hotel details
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: false,
    },
    rooms: {
      type: [String], // Change to an array of strings
      required: false,
    },
    // Check-in date
    checkInDate: {
      type: Date,
      required: false, // Check-in date is mandatory
    },
    // Check-out date
    checkOutDate: {
      type: Date,
      required: false, // Check-out date is optional
    },

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
      required: false,
    },
    // Timestamp for booking date
    // bookingDate: {
    //   type: Date,
    //   default: Date.now, // Default to current date
    // },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export Booking Model
export const Booking = model("Booking", bookingSchema);
