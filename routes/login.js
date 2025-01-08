const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const routerLogin = express.Router();


const generateToken = (id) => {
  return jwt.sign({ id }, "secret_key_shalola", { expiresIn: "1h" });
};

routerLogin.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("User from DB:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const matchPassword = await user.comparePassword(password);
    console.log("Password match result:", matchPassword);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const token = generateToken(user._id);

    res.status(200).json({ message: "Logged in successfully!", token, user: { id: user._id, username: user.username, email: user.email }, });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = routerLogin;
