const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
//Avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 300,
        height: 300,
        quality: "auto",
        fetch_format: "auto",
        crop: "fill",
        gravity: "auto",
      },
    ],
  },
});

//Post media
const postMediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "gif"],
  },
});

const uploadUserAvatar = multer({ storage: avatarStorage });
const uploadPostMedia = multer({ 
  storage: postMediaStorage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
 }});

module.exports = { uploadUserAvatar, uploadPostMedia };
