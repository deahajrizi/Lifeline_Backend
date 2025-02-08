const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

// @desc    Récupérer tous les postes d'un utilisateur par son ID
// @route   GET /api/post/all
// @access  Privé
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id });

  if (posts.length === 0) {
    res.status(400);
    throw new Error("Aucun poste trouvé.");
  }
  res.status(200).json(posts);
});

// @desc    Récupérer un poste depuis son ID
// @route   GET /api/post/id
// @access  Privé
const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post.length === 0) {
    res.status(400);
    throw new Error("Aucun poste trouvé");
  }
  res.status(200).json(post);
});

// @desc    Créer un souvenir dans la BDD
// @route   POST /api/post/create
// @access  Privé
const createPost = asyncHandler(async (req, res) => {
  const { title, content, media, date } = req.body;

  //On contrôle que les infos obligatoires sont présentes et pas vides
  if (!title || title === "" || !content || content === "") {
    res.status(400);
    throw new Error("Merci de remplir les champs obligatoires");
  }

  const post = await Post.create({
    title,
    content,
    media,
    author: req.user._id, // l'utilisateur connecté
    date,
  });
  //Si le poste a bien été créé, on affiche ses informations
  if (post) {
    res.status(201).json({
      _id: post._id,
      title: post.title,
      content: post.content,
      media: post.media,
      author: post.author,
      date: post.date,
    });
  } else {
    res.status(400);
    throw new Error("Une erreur est survenue. Le poste n'a pas été créé.");
  }
});

// @desc    Mettre à jour un poste dans la BDD
// @route   PUT /api/post/id
// @access  Privé
const updatePost = asyncHandler(async (req, res) => {
  // On récupère les infos du formulaire qui vient du Frontend
  const { title, content, date } = req.body;

  //On vérifie que le poste existe
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("Aucun poste trouvé.");
  }

  // On vérifie que l'utilisateur connecté est le propriétaire du poste
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Vous n'êtes pas autorisé à mettre à jour ce poste");
  }

  //On contrôle que les infos obligatoires sont présentes et pas vides
  if (
    !title ||
    title === "" ||
    !content ||
    content === "" ||
    !date ||
    date === ""
  ) {
    res.status(400);
    throw new Error("Merci de remplir les champs obligatoires");
  }

  //On met à jour le poste
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    title: title,
    content: content,
    date: date,
  });
  updatedPost.save();
  res
    .status(201)
    .json({ message: `Le souvenir appelé ${post.title} a bien été modifié.` });
});

// @desc    Upload Post Media
// @route   PUT /api/user/upload-post-media/:_id
// @access  Privé
const uploadPostMedia = asyncHandler(async (req, res) => {
  //Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  //Get URL of uploaded image
  const postMediaUrl = req.file.path;

  //Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("User not found");
  }

  //Update the post's media
  post.media = postMediaUrl;
  await post.save();

  res.status(200).json({
    message: "Post media uploaded successfully",
    postMediaUrl: postMediaUrl,
    postId: post.id,
  });
});

// @desc    Supprimer un poste de la BDD
// @route   DELETE /api/post/id
// @access  Privé
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  //On vérifie que le poste existe
  if (!post) {
    res.status(400);
    throw new Error("Aucun poste trouvé.");
  }

  //On supprime le poste
  const removedPost = await Post.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: `Le poste ${removedPost.title} a bien été supprimé.` });
});

// @desc    Ajouter un like sur un poste
// @route   POST /api/post/:id/like
// @access  Privé
const addLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }

  //Like counter
  post.likes += 1;

  //Mettre à jour le poste (nombre de likes)
  await post.save();
  res.status(201).json({ message: `Likes: ${post.likes}` });
});

module.exports = {
  getPosts,
  createPost,
  getSinglePost,
  updatePost,
  uploadPostMedia,
  deletePost,
  addLike,
};
