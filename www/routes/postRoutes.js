const express = require("express");
const postController = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const router = express.Router();

// @route   Post Route (GET)
// @desc    Route to get all posts by user ID
// @access  Private
router.route("/all/:friendId?").get(protect, postController.getPosts);

// @route   Post Route (GET)
// @desc    Route to get a single post by its ID
// @access  Private
router.route("/:id").get(protect, postController.getSinglePost);

// @route   Post Route (POST)
// @desc    Route to create a new post
// @access  Private
router.route("/create").post(protect, postController.createPost);

// @route   Post Route (PUT)
// @desc    Route to update a post by its ID
// @access  Private
router.route("/:id").put(protect, postController.updatePost);

// @route   Post Route (PUT)
// @desc    Route to upload post media
// @access  Private
router.route("/upload-post-media/:id").put( protect,upload.uploadPostMedia.single("media"),postController.uploadPostMedia);

// @route   Post Route (DELETE)
// @desc    Route to delete a post by its ID
// @access  Private
router.route("/:id").delete(protect, postController.deletePost);

module.exports = router;
