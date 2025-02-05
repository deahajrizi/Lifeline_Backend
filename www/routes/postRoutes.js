const express = require("express");
const postController = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const router = express.Router();

// @route   Route Poste (GET)
// @desc    Route pour obtenir tous les postes d'un utilisateur par son ID
// @access  Privé
router.route("/all").get(protect, postController.getPosts);

// @route   Route Poste (GET)
// @desc    Route pour obtenir un poste depuis son ID
// @access  Privé
router.route("/:id").get(protect, postController.getSinglePost);

// @route   Route Poste (POST)
// @desc    Route pour créer un poste (souvenir)
// @access  Privé
router.route("/create").post(protect, postController.createPost);

// @route   Route Poste (PUT)
// @desc    Route pour modifier un poste (souvenir)
// @access  Privé
router.route("/:id").put(protect, postController.updatePost);

// @route   Route User (PUT)
// @desc    Route pour enregistrer le média du poste
// @access  Privé
router.route("/upload-post-media/:id").put(protect, upload.uploadPostMedia.single("media"), postController.uploadPostMedia);


// @route   Route Poste (DELETE)
// @desc    Route pour supprimer un poste de la BDD
// @access  Privé
router.route("/:id").delete(protect, postController.deletePost);


// @route   Route Poste Like (POST)
// @desc    Route pour aimer un poste de la BDD
// @access  Privé
router.route("/:id/like").post(protect, postController.addLike)


module.exports = router;