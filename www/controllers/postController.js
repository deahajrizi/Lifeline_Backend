const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')


// @desc    Créer un souvenir dans la BDD
// @route   POST /api/post/create
// @access  Privé
const createPost = asyncHandler(async (req, res) => {
    const {title, content, media, author, date} = req.body
    
    //On contrôle que les infos obligatoires sont présentes et pas vides
    if (!title || title === "" || !content || content === "") {
        res.status(400)
        throw new Error("Merci de remplir les champs obligatoires")
    }

    const post = await Post.create({
        title,
        content,
        media,
        author,
        date
    })
    //Si le poste a bien été créé, on affiche ses informations
    if (post){
        res.status(201).json({
            _id: post._id,
            title: post.title,
            content: post.content,
            media: post.media,
            author: post.author,
            date: post.date

        }) 
    } else {
        res.status(400)
        throw new Error("Une erreur est survenue. Le poste n'a pas été créé.")
    }

})

module.exports = {
    createPost
}