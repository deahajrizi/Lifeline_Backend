//Import des librairies
const mongoose = require('mongoose')


const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // référence à la collection User
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    likes: { 
      type: Number, default: 0 //Like counter
    }
  },
  { timestamps: true }
);

//code pour récupérer l'id de l'auteur aka utilsateur connecté ici

module.exports = mongoose.model('Post', postSchema)