const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");

// @desc    Créer un commentaire dans la BDD
// @route   POST /api/comment/create
// @access  Privé
const createComment = asyncHandler(async (req, res) => {
  const {content, post} = req.body;

  //On contrôle que les infos obligatoires sont présentes et pas vides
  if(!content || content === ""){
    res.status(400)
    throw new Error("Merci de remplir les champs obligatoires.")
  }

  const comment = await Comment.create({
    content,
    author: req.user._id, //utilisateur connecté
    post,
    createdAt: new Date()
  });

  if(comment){
    res.status(201).json({
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        post: comment.post,
        createdAt: comment.createdAt
    })
  } else {
    res.status(400)
    throw new Error("Une erreur est survenue. Le commentaire n'a pas été créé.")
  }

})

module.exports = {
    createComment
}