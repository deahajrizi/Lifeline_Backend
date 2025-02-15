const express = require("express");
const commentController = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route   Comment Route (GET)
// @desc    Route to get all comments for a post by its ID
// @access  Private
router.route("/:id/comments").get(protect, commentController.getComments);

// @route   Comment Route (POST)
// @desc    Route to create a new comment
// @access  Private
router.route("/create").post(protect, commentController.createComment);

// @route   Comment Route (PUT)
// @desc    Route to edit a comment by its ID
// @access  Private
router.route("/:id").put(protect, commentController.editComment);

// @route   Comment Route (DELETE)
// @desc    Route to delete a comment by its ID
// @access  Private
router.route("/:id").delete(protect, commentController.deleteComment);

module.exports = router;
