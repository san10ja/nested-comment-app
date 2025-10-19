import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// SIGNUP ROUTE 
router.post("/signup", async (req, res) => {
  try {
    const { username, avatar, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const newUser = new User({ username, avatar, email, password });
    await newUser.save();
    
    // Create the JWT payload 
    const payload = {
      user: {
        id: newUser._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
    
    const { password: pwd, ...userResponse } = newUser._doc;
    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup." });
  }
});

// LOGIN ROUTE 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // JWT Payload
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    const { password: pwd, ...userData } = user._doc;
    res.status(200).json({ user: userData, token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// GET USER DATA ROUTE 
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token." });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Token is not valid." });
  }
});

export default router;