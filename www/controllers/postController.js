const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');

// @desc    Get All Posts By User ID
// @route   GET /api/post/all
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  // Get the friendId from the URL
  const { friendId } = req.params;
  let posts;

  if (friendId) {
    // Fetch the user's friends
    const user = await User.findById(req.user._id).populate('friends');
    // Check if the friendId is in the user's friends list
    if (!user.friends.some(friend => friend._id.toString() === friendId)) {
      res.status(403);
      throw new Error("You are not authorized to view this user's posts");
    }
    // Fetch posts for the specific friend
    posts = await Post.find({ author: friendId });
  } else {
    // Fetch posts for the logged-in user only
    posts = await Post.find({ author: req.user._id });
  }
  // Check if there are any posts
  if (posts.length === 0) {
    res.status(400);
    throw new Error("No posts found.");
  }

  res.status(200).json(posts);
});

// @desc    Get Single Post By ID
// @route   GET /api/post/id
// @access  Private
const getSinglePost = asyncHandler(async (req, res) => {
  // Fetch the post by its ID and populate the author field with the user details
  const post = await Post.findById(req.params.id).populate('author');
  // Check if the post exists
  if (!post) {
    res.status(400);
    throw new Error("No post found.");
  }

  // Check if the user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(401);
    throw new Error('User not found.');
  }

  // Check if the user is authorized to view the post
  if (post.author._id.toString() !== req.user._id.toString() && !user.friends.includes(post.author._id)) {
    res.status(403);
    throw new Error('You are not authorized to view this post.');
  }

  res.status(200).json(post);
});

// @desc    Create New Post
// @route   POST /api/post/create
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  // Fetch the form data from the frontend
  const { title, content, media, date } = req.body;

  // Check if required fields are filled
  if (!title || title === "" || !content || content === "") {
    res.status(400);
    throw new Error("Please fill in the required fields.");
  }

  // Create the new post in the database
  const post = await Post.create({
    title,
    content,
    media,
    author: req.user._id, // Connected user's ID
    date,
  });
  // If the post is created, return the post details
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
    throw new Error("Something went wrong while creating the post. Please try again.");
  }
});

// @desc    Update Post By ID
// @route   PUT /api/post/id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  // Fetch the form data from the frontend
  const { title, content, date } = req.body;

  // Check if the post exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("No post found.");
  }

  // Check if the connected user is the author of the post
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to update this post.");
  }

  // Check if required fields are filled
  if (
    !title ||
    title === "" ||
    !content ||
    content === "" ||
    !date ||
    date === ""
  ) {
    res.status(400);
    throw new Error("Please fill in the required fields.");
  }

  // Update the post
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    title: title,
    content: content,
    date: date,
  });
  updatedPost.save();
  res
    .status(201)
    .json({ message: `The post ${post.title} has been updated.` });
});

// @desc    Upload Post Media
// @route   PUT /api/user/upload-post-media/:id
// @access  Private
const uploadPostMedia = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  // Get URL of uploaded image
  const postMediaUrl = req.file.path;

  // Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found.");
  }

  // Update the post's media
  post.media = postMediaUrl;
  await post.save();

  res.status(200).json({
    message: "Post media uploaded successfully!",
    postMediaUrl: postMediaUrl,
    postId: post.id,
  });
});

// @desc    Delete Post By ID
// @route   DELETE /api/post/id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  // Check if the post exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error("No post found.");
  }

  // Remove the post from the database
  const removedPost = await Post.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: `The post ${removedPost.title} has been deleted.` });
});


module.exports = {
  getPosts,
  createPost,
  getSinglePost,
  updatePost,
  uploadPostMedia,
  deletePost,
};
