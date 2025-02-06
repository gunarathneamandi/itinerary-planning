import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, match: /^[0-9]{10}$/ }, // Validates a 10-digit phone number, adjust as needed
  email: { type: String, match: /^\S+@\S+\.\S+$/ }, // Email format validation
  facilities: { type: [String], default: [] }, // Array to store facilities like ["Wi-Fi", "Pool"]
  price: { type: Number, required: true },
  roomTypes: { 
    type: [String], 
    required: true,
    default: ["Single", "Double", "Suite"] 
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export { Hotel };
