const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Look for token in cookies
  token = req.cookies.jwt;
  // Check if there's a token in the cookies
  if (token) {
    try {
      // Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password"); // Exclude password field

      // If user is found, proceed to next middleware
      if (!req.user) {
        console.error("User not found for the given token:", decoded.userId);
        res.status(404);
        throw new Error("User not found.");
      }
      next();
    } catch (e) {
      // Check if it's a token verification error or some other error
      if (e.name === "JsonWebTokenError") {
        res.status(401);
        throw new Error("Invalid token, please log in.");
      } else if (e.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token expired, please log in.");
      } else {
        res.status(500);
        throw new Error("Server error, please try again.");
      }
    }
  } else {
    // Token not found in cookies
    res.status(401);
    throw new Error("No token found, not authorized.");
  }
});

module.exports = { protect };

