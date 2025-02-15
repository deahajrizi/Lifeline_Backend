const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const router = express.Router();

// @route   User Route (POST)
// @desc    Route to register a new user
// @access  Public
router.route("/register").post(userController.register);

// @route   User Route (POST)
// @desc    Route to login a user
// @access  Public
router.route("/auth").post(userController.login);

// @route   User Route (POST)
// @desc    Route to logout a user
// @access  Private
router.route("/logout").post(userController.logout);

// @route   User Route (PUT)
// @desc    Route to update a user's profile
// @access  Private
router.route("/profile/").put(protect, userController.updateUserProfile);

// @route   User Route (GET)
// @desc    Route to get a user's profile
// @access  Private
router.route("/profile/:_id").get(protect, userController.getUserProfile);

// @route   User Route (GET)
// @desc    Route to get all friends profiles
// @access  Private
router.route("/friends").get(protect, userController.getFriendsProfiles);

// @route   User Route (PUT)
// @desc    Route to add a friend by username
// @access  Private
router.route('/add-friend').put(protect, userController.addFriend);

// @route   User Route (PUT)
// @desc    Route to upload a user avatar
// @access  Privé
router.route("/upload-avatar/:_id").put(protect, upload.uploadUserAvatar.single("avatar"), userController.uploadAvatar);

module.exports = router;
