const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");
const verifyToken = require("../middleware/authMiddleware");


// GET /api/weather/current/:city
router.get('/current/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json(response.data);
  } catch (error) {
    console.error("🌩️ OpenWeather API error:", error.response?.data || error.message);  // 👈 Add this
    res.status(500).json({ error: "Failed to fetch current weather" });
  }
});


// GET /api/weather/forecast/:city
router.get("/forecast/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: "Failed to fetch forecast" });
  }
});

// POST /api/weather/favorites → save a favorite city
router.post("/favorites", verifyToken, async (req, res) => {
  const { city } = req.body;
  console.log("BODY:", req.body);
  
  if (!city) return res.status(400).json({ msg: "City is required" });

  try {
    const user = await User.findById(req.user.id);

    // Prevent duplicates
    if (!user.favorites.includes(city)) {
      user.favorites.push(city);
      await user.save();
    }

    res.json({ msg: "City added to favorites", favorites: user.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/weather/favorites → get all favorite cities' current weather
router.get("/favorites", verifyToken, async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const user = await User.findById(req.user.id);

    const weatherData = await Promise.all(
      user.favorites.map(async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);
        return response.data;
      })
    );

    res.json(weatherData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Failed to fetch favorite cities weather" });
  }
});

// DELETE /api/weather/favorites → remove a favorite city
router.delete("/favorites", verifyToken, async (req, res) => {
  const { city } = req.body;

  if (!city) return res.status(400).json({ msg: "City is required" });

  try {
    const user = await User.findById(req.user.id);

    // Remove city if it exists
    user.favorites = user.favorites.filter((fav) => fav.toLowerCase() !== city.toLowerCase());
    await user.save();

    res.json({ msg: "City removed from favorites", favorites: user.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
