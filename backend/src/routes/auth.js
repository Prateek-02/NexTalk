// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");


const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

router.post("/register", async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    // Check username/email uniqueness
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      status: 'online', // Set status to online on registration
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: user.safeUser,
    });
  } catch (err) {
    console.error("Register error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ message: "Email or username and password are required" });
  }

  try {
    const query = email ? { email } : { username };
    const user = await User.findOne(query);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set user status to online on login
    user.status = 'online';
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: user.safeUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", protect, async (req, res) => {
  res.json(req.user.safeUser);
});


router.put("/me", protect, async (req, res) => {
  const { username, email, profilePic, status } = req.body;

  try {
    // Prevent duplicate username/email if updated
    if (email && email !== req.user.email) {
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    if (username && username !== req.user.username) {
      if (await User.findOne({ username })) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    req.user.username = username || req.user.username;
    req.user.email = email || req.user.email;
    req.user.profilePic =
      profilePic !== undefined ? profilePic : req.user.profilePic;
    // Don't allow manual status updates - it's managed automatically
    // req.user.status is managed by login/logout

    const updatedUser = await req.user.save();

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.safeUser,
    });
  } catch (err) {
    console.error("Update user error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", protect, async (req, res) => {
  try {
    // Set user status to offline on logout
    req.user.status = 'offline';
    await req.user.save();
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users.map((u) => u.safeUser));
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
