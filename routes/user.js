const express = require("express");
const User = require("../models/user");
const routerUser = express.Router();

routerUser.get("/users", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "asc",
      username,
      email,
    } = req.query;
    const skip = (page - 1) * limit || 0;
    const filters = {};
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;
    const usersAll = await User.find(filters).skip(skip).limit(limit).exec();
    const totalUsers = await User.countDocuments(filters);
    res.status(200).json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
      usersAll,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = routerUser;
