const express = require('express')
const postController = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();


// @route   Route Poste (POST)
// @desc    Route pour créer un poste (souvenir)
// @access  Privé
router.route('/create').post(protect, postController.createPost)


module.exports = router