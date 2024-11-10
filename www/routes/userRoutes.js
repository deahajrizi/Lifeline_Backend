const express = require('express')
const userController = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();


// @route   Route User (POST)
// @desc    Route pour créer un utilisateur
// @access  Public
router.route('/register').post(userController.register)

// @route   Route User (POST)
// @desc    Route pour logger un utilisateur
// @access  Public
router.route('/auth').post(userController.login)

// @route   Route User (POST)
// @desc    Route pour logout un utilisateur
// @access  Privé
router.route('/logout').post(userController.logout)

// @route   Route User (PUT)
// @desc    Route pour mettre à jour le profil d'un utilisateur
// @access  Privé
router.route('/profile').put(protect, userController.updateUserProfile)


// @route   Route User (GET)
// @desc    Route pour récupérer le profil d'un utilisateur
// @access  Privé
router.route('/profile/:_id').get(protect, userController.getUserProfile)

module.exports = router