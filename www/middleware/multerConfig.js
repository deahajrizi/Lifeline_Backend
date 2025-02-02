const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinaryConfig')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    } 
})

const upload = multer({storage: storage})

module.exports = upload;