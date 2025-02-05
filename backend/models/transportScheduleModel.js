import mongoose from "mongoose";

const transportScheduleSchema = new mongoose.Schema({
  route: String, // e.g., Colombo to Kandy
  type: { type: String, required: true }, // e.g., bus, train
  schedule: [
    {
      departureTime: String,
      arrivalTime: String,
      stops: [String],
    },
  ],
});

const TransportSchedule = mongoose.model(
  "TransportSchedule",
  transportScheduleSchema
);
export default TransportSchedule;
