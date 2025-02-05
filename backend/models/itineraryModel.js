import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  attractions: [
    {
      attractionId: String,
      name: String,
      duration: Number, // in hours
    },
  ],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;