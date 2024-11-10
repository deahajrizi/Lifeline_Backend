const allowedOrigins = require('./allowedOrigins')
//Pour autoriser serveur frontend à se connecter à serveur backend

//Fonction pour les options "cors", qui autorisent ou non les sites d'accéder à notre api
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){ //!origin = application windows
            callback(null, true)
        } else {
            callback(new Error('Non autorisé par CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions