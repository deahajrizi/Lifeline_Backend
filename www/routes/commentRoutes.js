const express = require("express");
const commentController = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route   Route Commentaire (GET)
// @desc    Route pour récupérer tous les commentaires d'un poste spécifique
// @access  Privé
router.route("/:id/comments").get(protect, commentController.getComments);

// @route   Route Commentaire (GET)
// @desc    Route pour récupérer un commentaires d'un poste spécifique
// @access  Privé
router
  .route("/:postId/comments/:commentId")
  .get(protect, commentController.getSingleComment);

// @route   Route Commentaire (POST)
// @desc    Route pour créer un commentaire
// @access  Privé
router.route("/create").post(protect, commentController.createComment);

// @route   Route Commentaire (PUT)
// @desc    Route pour modifier un commentaire par son id
// @access  Privé
router.route("/:id").put(protect, commentController.editComment);

// @route   Route Commentaire (DELETE)
// @desc    Route pour supprimer un commentaire par son id
// @access  Privé
router.route("/:id").delete(protect, commentController.deleteComment);

module.exports = router;
