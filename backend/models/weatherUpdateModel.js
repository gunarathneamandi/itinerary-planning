import mongoose from "mongoose";

const weatherUpdateSchema = new mongoose.Schema({
    location: {
      latitude: Number,
      longitude: Number,
    },
    temperature: Number, // in Celsius
    condition: String, // e.g., sunny, rainy
    timestamp: { type: Date, default: Date.now },
  });
  
  const WeatherUpdate = mongoose.model('WeatherUpdate', weatherUpdateSchema);
  export default WeatherUpdate;