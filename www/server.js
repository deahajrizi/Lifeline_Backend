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

//Connexion à la BDD
connectDB();

//Configuration du serveur
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//Routes utilisées pour les postes (souvenirs)
app.use("/api/post", require("./routes/postRoutes"));
//Routes utilisées pour les utilisateurs
app.use("/api/user", require("./routes/userRoutes"));

//Afficher les stacks d'erreur en mode développement
app.use(errorHandler);

//On se connecte à MongoDB et on lance le serveur
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
});
//Si on a un problème de connexion
mongoose.connection.on("error", (err) => {
  console.log(`Erreur de connexion à MongoDB : ${err}`);
});
