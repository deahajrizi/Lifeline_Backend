//On importe les librairies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//On définit le schéma de données que l'on souhaite pour nos utilisateurs
const userSchema = mongoose.Schema(
  {
    last_name: {
      type: String,
      trim: true, //Supprime les espaces ou caractères inutiles
      required: true,
    },
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true, //Ne peux exister qu'une seule fois dans la BDD
      required: true, //Champs obligatoire
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "../assets/default-avatar.png",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true }
);

//Compare le mot de passe entré par l'utilisateur avec celui de la BDD (encrypté)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//On crypte le mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
