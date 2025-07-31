const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const weatherRoutes = require("./routes/weather");
app.use("/api/auth", require("./routes/auth"));        // For login/register
app.use("/api/favorites", require("./routes/favorites")); // For add/remove favorites
app.use("/api/weather", require("./routes/weather"));  // For fetching weather


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/weather", require("./routes/weather"));


// Root
app.get("/", (req, res) => {
  res.send("🌦️ Weather app backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));