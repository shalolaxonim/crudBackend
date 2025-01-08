const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protection = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret_key_shalola");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Token validation failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = protection;
