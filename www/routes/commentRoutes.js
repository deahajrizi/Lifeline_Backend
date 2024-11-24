const express = require("express");
const commentController = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


// @route   Route Poste (POST)
// @desc    Route pour créer un commentaire
// @access  Privé
router.route('/create').post(protect, commentController.createComment)

module.exports = router