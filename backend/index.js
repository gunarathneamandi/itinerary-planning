import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Attraction } from "./models/attractionModel.js";
import { Hotel } from "./models/hotelModel.js";
import { Booking } from "./models/bookingModel.js";
import attractionsRoute from "./routes/attractionsRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import bookingConfirmation from "./routes/bookingConfirmationRoute.js";
import siteRoutes from "./routes/siteRoutes.js";
import cors from "cors";
import axios from "axios";

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS policy
app.use(cors());
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// )

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to tourism");
});

app.use("/attractions", attractionsRoute);
app.use("/booking", bookingRoute);
app.use("/bookingConfirmation", bookingConfirmation);
app.use("/sites", siteRoutes);

// Serve static images from public/images folder
app.use("/images", express.static("public/images"));

//Real time weather updating
const WEATHER_API_KEY = "b6bb92e7fd04fe2d1a72e183004d8ebf";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

app.get("/weather/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: "metric", // You can change to "imperial" for Fahrenheit
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("app successfully connected to database!");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
