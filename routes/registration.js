const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const routerRegister = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, "secret_key_shalola", { expiresIn: "1h" });
};

routerRegister.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Username already exists!" });
    }
    // tuzla
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("Hashed Password during Registration:", hashedPassword);
    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser.id),
      });
    }
  } catch (err) {
    console.log("error while rehistering", err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = routerRegister;
