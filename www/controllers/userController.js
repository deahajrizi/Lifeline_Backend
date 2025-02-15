//Import des librairies
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");


// @desc    Login User
// @route   POST /api/user/auth
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // If user is found, generate a token and send it to the client
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      avatar: user.avatar,
      message: "User logged in successfully!",
    });
  } else {
    res.status(401);
    throw new Error("Email address or password is incorrect.");
  }
});

// @desc    Register User
// @route   POST /api/user/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  // Fetch user details from the frontend
  const { username, last_name, first_name, email, password } = req.body;

  // Check if required fields are filled
  if (
    !username ||
    username === "" ||
    last_name === "" ||
    !last_name ||
    first_name === "" ||
    !first_name ||
    !email ||
    email === "" ||
    password === "" ||
    !password
  ) {
    res.status(400);
    throw new Error("Please fill in the required fields.");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  // Create the new user
  const user = await User.create({
    username,
    last_name,
    first_name,
    email,
    password,
    avatar: req.body.avatar || undefined
  });
  // If the user is created, return the user details
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      avatar: user.avatar
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong while creating the user.");
  }
});

// @desc    Update User Profile
// @route   PUT /api/user/profile/
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const {username, first_name, last_name, email} = req.body
  // Find the user
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }
  user.username = username || user.username;
  user.last_name = last_name || user.last_name;
  user.first_name = first_name || user.first_name;
  user.email = email || user.email;

  // Update password if provided
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.status(201).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    last_name: updatedUser.last_name,
    first_name: updatedUser.first_name,
    email: updatedUser.email,
    message: "User updated successfully!",
  });
});

// @desc    Upload User Avatar
// @route   PUT /api/user/upload-avatar/:_id
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if(!req.file){
    res.status(400);
    throw new Error("No file uploaded.");
  }

  // Get URL of uploaded image
  const avatarUrl = req.file.path;

  // Find the user 
  const user = await User.findById(req.params._id);
  if(!user){
    res.status(404)
    throw new Error("User not found.")
  }

  // Update the user's avatar
  user.avatar = avatarUrl;
  await user.save()

  res.status(200).json({
    message: 'Avatar uploaded successfully!',
    avatarUrl: avatarUrl,
    userId: user._id
  })
} )

// @desc    Get User Profile
// @route   GET /api/user/profile/:_id
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Find the user
  const user = await User.findById(req.params._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      last_name: user.last_name,
      first_name: user.first_name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      friends: user.friends,
      message: "User profile retrieved successfully.",
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

// @desc    Get Friends Profiles
// @route   GET /api/user/friends
// @access  Private
const getFriendsProfiles = asyncHandler(async (req, res) => {
  // Find the user and populate the friends field with the _id, username, first_name, last_name, and avatar fields
   const user = await User.findById(req.user._id).populate('friends', '_id username first_name last_name avatar');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  } 
  res.status(200).json({
    message: 'Friends profiles retrieved successfully.',
    friends: user.friends,
  });
});

// @desc    Add Friend By Username
// @route   PUT /api/user/add-friend
// @access  Private
const addFriend = asyncHandler(async (req, res) => {
  // Find the user and the friend
  const { username } = req.body;
  const user = await User.findById(req.user._id);
  const friend = await User.findOne({ username });

  if (!friend) {
    res.status(404);
    throw new Error('User not found.');
  }
  // Check if the user is already friends with the friend
  if (user.friends.includes(friend._id)) {
    res.status(400);
    throw new Error('You are already friends with this user.');
  }

  // Add the friend to the user's friends list
  user.friends.push(friend._id);
  await user.save();

  res.status(200).json({
    message: 'Friend added successfully!',
    friends: user.friends,
  });
});


// @desc    Logout User
// @route   POST /api/user/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear the cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    //Expires now
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully!" });
});

module.exports = {
  login,
  logout,
  register,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  addFriend,
  getFriendsProfiles
};
