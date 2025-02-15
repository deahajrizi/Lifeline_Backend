const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require("./config/dbConnection");
const cookieParser = require("cookie-parser")
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB();

// CORS Configuration
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// Posts Routes
app.use("/api/post", require("./routes/postRoutes"));
// User Routes
app.use("/api/user", require("./routes/userRoutes"));
// Comment Routes
app.use("/api/comment", require("./routes/commentRoutes"));


// Error Handler Middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
});
// If there's an error connecting to MongoDB, log the error
mongoose.connection.on("error", (err) => {
  console.log(`Error connecting to MongoDB : ${err}`);
});
