//Import de librairies
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password"); //Sans mot de passe
      next();
    } catch (e) {
      
      res.status(401);
      throw new Error("Pas autorisé, erreur de token.");
    }
  } else {
    res.status(401);
    throw new Error("Pas autorisé, pas de token.");
  }
});

module.exports = { protect };
//On exporte toute la méthode et on l'appelle 'protect' pour vérifier que l'utilisateur est bien connecté et authentifié
