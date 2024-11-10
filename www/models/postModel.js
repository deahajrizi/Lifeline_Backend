//Import des librairies
const mongoose = require('mongoose')


const postSchema = mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        type: String
    },
    author: {
        type: String,
        
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

//code pour récupérer l'id de l'auteur aka utilsateur connecté ici

module.exports = mongoose.model('Post', postSchema)