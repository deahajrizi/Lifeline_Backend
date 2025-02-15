const asyncHandler = require("express-async-handler");
const CommentModel = require("../models/commentModel");
const PostModel = require("../models/postModel");

// @desc    Get Comments for a post by its ID
// @route   GET /api/comment/:id/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  // Find the post by its ID
  const post = await PostModel.findById(req.params.id);

  // If no post is found, return a 404 error
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
// Find all comments for the post and populate the author field with the _id, username, and avatar fields 
// to get the author's details
  const comments = await CommentModel.find({ post: req.params.id }).populate(
    "author",
    "_id username avatar"
  );

  // Return the comments for the post, or an empty array if no comments are found
  res.status(200).json(comments);
});


// @desc    Create New Comment
// @route   POST /api/comment/create
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { content, post } = req.body;

  // Check if required fields are filled
  if (!content || content === "") {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  // Create the new comment
  const comment = await CommentModel.create({
    content,
    // Connected user's ID
    author: req.user._id,
    post,
    createdAt: new Date(),
  });

  // If the comment is created, return the comment details
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
      "Something went wrong while creating the comment. Please try again."
    );
  }
});

// @desc    Upadate Comment by its ID
// @route   PUT /api/comment/id
// @access  Private
const editComment = asyncHandler(async (req, res) => {
  // Fetch the content from the request body
  const { content } = req.body;

  // Check if the required fields are empty
  if (!content || content === "") {
    res.status(400);
    throw new Error("Please fill in the required fields.");
  }

  // Check if the comment exists
  const comment = await CommentModel.findById(req.params.id);
  if (!comment) {
    res.status(400);
    throw new Error("No comment found.");
  }

  // Update the comment
  const editedComment = await CommentModel.findByIdAndUpdate(req.params.id, {
    content: content,
  });
  editedComment.save();
  res.status(201).json({ message: `The comment '${removedComment.content}' has been updated.` });
});

// @desc    Delete Comment by its ID
// @route   DELETE /api/comment/id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  // Check if the comment exists
  const comment = await CommentModel.findById(req.params.id);

  // If no comment is found, return a 400 error
  if (!comment) {
    res.status(400);
    throw new Error("No comment found.");
  }

  // Delete the comment
  const removedComment = await CommentModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: `The comment '${removedComment.content}' has been deleted.`,
  });
});

module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment,
};
