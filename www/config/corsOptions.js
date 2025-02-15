//Authorize frontend server to connect to backend server
const allowedOrigins = require("./allowedOrigins");

// Cors oprtions to allow or not sites to access our api
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //!origin = windows application
      callback(null, true);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
