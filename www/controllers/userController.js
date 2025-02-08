//Import des librairies
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");
const cloudinary = require('cloudinary').v2

// @desc    Login utilisateur avec token
// @route   POST /api/user/auth
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    console.log('logged in')
    res.status(201).json({
      _id: user._id,
      username: user.username,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      avatar: user.avatar,
      message: "Utilisateur connecté avec succès",
    });
  } else {
    res.status(401);
    throw new Error("L'adresse email ou le mot de passe ne correspond pas.");
  }
});

// @desc    Créer un utilisateur dans la BDD
// @route   POST /api/user/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  //On récupère les infos du formulaire (frontend)
  const { username, last_name, first_name, email, password } = req.body;

  //On contrôle que les infos obligatoires sont présentes et pas vides
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
    throw new Error("Merci de remplir les champs obligatoires.");
  }

  //On contrôle que l'utilisateur n'existe pas dans la BDD
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("L'utilisateur existe déjà.");
  }

  //On enregistre l'utilisateur dans la BDD
  const user = await User.create({
    username,
    last_name,
    first_name,
    email,
    password,
    avatar: req.body.avatar || undefined
  });
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
    throw new Error("Une erreur est survenue. Merci de recommencer.");
  }
});

// @desc    Mettre à jour le profil d'un utilisateur par son ID
// @route   PUT /api/user/profile/
// @access  Privé
const updateUserProfile = asyncHandler(async (req, res) => {
  const {username, first_name, last_name, email} = req.body
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("L'utilisateur n'existe pas.");
  }
  user.username = username || user.username;
   user.last_name = last_name || user.last_name;
  user.first_name = first_name || user.first_name;
  user.email = email || user.email;

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
    message: "Utilisateur modifié avec succès",
  });
});

// @desc    Upload Avatar
// @route   PUT /api/user/upload-avatar/:_id
// @access  Privé
const uploadAvatar = asyncHandler(async (req, res) => {

  //Check if file was uploaded
  if(!req.file){
    res.status(400);
    throw new Error("No file uploaded");
  }

  //Get URL of uploaded image
  const avatarUrl = req.file.path;

  //Find the user 
  const user = await User.findById(req.params._id);
  if(!user){
    res.status(404)
    throw new Error("User not found")
  }

  //Update the user's avatar
  user.avatar = avatarUrl;
  await user.save()

  res.status(200).json({
    message: 'Avatar uploaded successfully',
    avatarUrl: avatarUrl,
    userId: user._id
  })

} )

// @desc    Récupérer le profil d'un utilisateur par son ID
// @route   GET /api/user/profile/:_id
// @access  Privé
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      last_name: user.last_name,
      first_name: user.first_name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      message: "Utilisateur récupéré",
    });
  } else {
    res.status(400);
    throw new Error("Utilisateur non trouvé.");
  }
});

// @desc    Logout utilisateur
// @route   POST /api/user/logout
// @access  Privé
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    //Expire maintenant
    expires: new Date(0),
  });
  res.status(200).json({ message: "Utilisateur déconnecté avec succès." });
});

module.exports = {
  login,
  logout,
  register,
  getUserProfile,
  updateUserProfile,
  uploadAvatar
};
