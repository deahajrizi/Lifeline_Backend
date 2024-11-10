//Import de Mongoose (librairie MongoDB)
const mongoose = require('mongoose')

//On essaie de se connecter à MongoDB. On envoie une erreur si ça échoue
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB