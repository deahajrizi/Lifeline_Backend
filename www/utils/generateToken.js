
//Import des librairies
const jwt = require('jsonwebtoken')

const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development', //Utiliser un cookie https en mode prod
		sameSite: 'strict', //Prévenir les attaques CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 jours
		path: '/',
	})

}

module.exports = {
	generateToken,
}