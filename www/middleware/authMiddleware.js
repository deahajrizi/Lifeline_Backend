// Import the libraries
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

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
        throw new Error("Utilisateur non trouvé.");
      }

      next();
    } catch (e) {
      // Log error details
      console.error("Token verification or user lookup failed:", e);

      // Check if it's a token verification error or some other error
      if (e.name === "JsonWebTokenError") {
        res.status(401);
        throw new Error("Token invalide, pas autorisé.");
      } else if (e.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token expiré, veuillez vous reconnecter.");
      } else {
        res.status(500);
        throw new Error("Erreur interne du serveur.");
      }
    }
  } else {
    // Token not found
    console.error("No token found in cookies:", req.cookies);
    res.status(401);
    throw new Error("Pas autorisé, pas de token.");
  }
});

module.exports = { protect };
