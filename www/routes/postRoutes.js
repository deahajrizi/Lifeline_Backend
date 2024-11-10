const express = require('express')
const postController = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

// @route   Route Poste (GET)
// @desc    Route pour obtenir tous les postes d'un utilisateur par son ID
// @access  Privé
router.route('/all').get(protect, postController.getPosts)


// @route   Route Poste (GET)
// @desc    Route pour obtenir un poste depuis son ID
// @access  Privé
router.route('/:id').get(protect, postController.getSinglePost)

// @route   Route Poste (POST)
// @desc    Route pour créer un poste (souvenir)
// @access  Privé
router.route('/create').post(protect, postController.createPost)

// @route   Route Poste (PUT)
// @desc    Route pour modifier un poste (souvenir)
// @access  Privé
router.route('/:id').put(protect, postController.updatePost)

// @route   Route Poste (DELETE)
// @desc    Route pour supprimer un poste de la BDD
// @access  Privé
router.route('/:id').delete(protect, postController.deletePost)



module.exports = router