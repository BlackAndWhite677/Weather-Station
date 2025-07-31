const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware: Verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

// POST /api/favorites/add
router.post("/add", verifyToken, async (req, res) => {
  const { city } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favorites.includes(city)) {
      user.favorites.push(city);
      await user.save();
    }

    res.json({ message: "City added to favorites", favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// GET /api/favorites
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get favorites" });
  }
});

// DELETE /api/favorites/:city
router.delete("/:city", verifyToken, async (req, res) => {
  const { city } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favorites = user.favorites.filter(c => c.toLowerCase() !== city.toLowerCase());
    await user.save();
    res.json({ message: "City removed from favorites", favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
