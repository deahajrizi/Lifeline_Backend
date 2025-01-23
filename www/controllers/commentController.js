const asyncHandler = require("express-async-handler");
const CommentModel = require("../models/commentModel");
const PostModel = require("../models/postModel");

// @desc    Récupérer tous les commentaires d'un poste
// @route   GET /api/comment/:id/comments (:id = postId)
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  // Find the post by its ID
  const post = await PostModel.findById(req.params.id);

  // If no post is found, return a 404 error
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  // Find comments for the given post
  const comments = await CommentModel.find({ post: req.params.id });

  // If no comments are found, return a 400 error
  if (!comments.length) {
    res.status(400);
    throw new Error("No comments found for this post");
  }

  // Return the comments for the post
  res.status(201).json(comments);
});

// @desc    Récupérer un commentaire d'un poste spécifique
// @route   GET /api/comment/:postId/:commentId (:id = postId)
// @access  Private
const getSingleComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const post = await PostModel.findById(postId);

  if (!post) {
    res.status(400);
    throw new Error("Poste non trouvé.");
  }

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    res.status(400);
    throw new Error("Commentaire non trouvé.");
  }
  res.status(201).json(comment);
});

// @desc    Créer un commentaire dans la BDD
// @route   POST /api/comment/create
// @access  Privé
const createComment = asyncHandler(async (req, res) => {
  const { content, post } = req.body;

  //On contrôle que les infos obligatoires sont présentes et pas vides
  if (!content || content === "") {
    res.status(400);
    throw new Error("Merci de remplir les champs obligatoires.");
  }

  const comment = await CommentModel.create({
    content,
    author: req.user._id, //utilisateur connecté
    post,
    createdAt: new Date(),
  });

  if (comment) {
    res.status(201).json({
      _id: comment._id,
      content: comment.content,
      author: comment.author,
      post: comment.post,
      createdAt: comment.createdAt,
    });
  } else {
    res.status(400);
    throw new Error(
      "Une erreur est survenue. Le commentaire n'a pas été créé."
    );
  }
});

// @desc    Modifier un commentaire dans la BDD (par son id)
// @route   PUT /api/comment/id
// @access  Privé
const editComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content === "") {
    res.status(400);
    throw new Error("Merci de remplir les champs obligatoires");
  }

  //On vérifie que le commentaire existe
  const comment = await CommentModel.findById(req.params.id);
  if (!comment) {
    res.status(400);
    throw new Error("Aucun commentaire trouvé.");
  }

  //On modifie le commentaire
  const editedComment = await CommentModel.findByIdAndUpdate(req.params.id, {
    content: content,
  });
  editedComment.save();
  res.status(201).json({ message: `Le commentaire a bien été modifié.` });
});

// @desc    Supprimer un commentaire de la BDD (par son id)
// @route   DELETE /api/comment/id
// @access  Privé
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await CommentModel.findById(req.params.id);

  if (!comment) {
    res.status(400);
    throw new Error("Aucun commentaire trouvé.");
  }

  const removedComment = await CommentModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: `Le commentaire '${removedComment.content}' a été supprimé.`,
  });
});

module.exports = {
  getComments,
  getSingleComment,
  createComment,
  editComment,
  deleteComment,
};
