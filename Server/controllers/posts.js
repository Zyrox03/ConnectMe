import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js'

import Post from '../models/Post.js'


// create post
export const createPost = catchAsync(async (req, res) => {
    try {
        const { userID, description, picturePath } = req.body
        const user = await User.findById(userID)

        const newPost = new Post({
            userID,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath.path,
            likes: {},
            comments: []

        })
        if (req.file) {
            newPost.picturePath = req.file.path
        }

        await newPost.save()


        const post = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(post)
    } catch (e) {
        res.status(500).json(e)

    }




})

// delete post
export const deletePost = catchAsync(async (req, res) => {
    try {
        const { postID } = req.params
        const deletedPost = await Post.findByIdAndDelete(postID)



        const post = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(post)
    } catch (e) {
        res.status(500).json(e)

    }




})

// read

export const getFeedPosts = catchAsync(async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (e) {
        res.status(500).json(e)

    }




})

export const getUserPosts = catchAsync(async (req, res) => {
    try {
        const { userID } = req.params;
        const post = await Post.find({userID}).sort({ createdAt: -1 })

        res.status(200).json(post)
    } catch (e) {
        res.status(500).json(e)

    }




})

// UPDATE

export const likePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { userID } = req.body;

    const post = await Post.findById(id)
    let isLiked = post.likes.get(userID)
    if (isLiked) {
        post.likes.delete(userID)
    } else {
        isLiked = post.likes.set(userID, true)

    }


    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true })
    res.status(200).json(updatedPost)
    // res.send(updatedPost)


})