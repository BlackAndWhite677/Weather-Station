const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/authMiddleware");


const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register Route
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);  // 👈 full error logging
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/user", verifyToken, async (req, res) => {
  try {
    // req.user.id was set by the middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user); // Return user details
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
// Add at the bottom of auth.js
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

module.exports = router;
