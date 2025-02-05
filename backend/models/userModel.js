import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
  preferences: {
    interests: [String],
    language: String,
  },
  role: { type: String, default: "tourist" },
});


const User = mongoose.model("User", userSchema);

export default User;
