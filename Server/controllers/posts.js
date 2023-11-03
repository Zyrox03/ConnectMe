import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js'
import { v2 as cloudinary } from "cloudinary";
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
            newPost.picturePath.path = req.file.path
            newPost.picturePath.filename = req.file.filename
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
        const toDelete = await Post.findById(postID)

        if (!toDelete) {
            return res.status(404).json({ error: 'Post not found' });
          }
        // Delete image from Cloudinary
       
        
        // Delete post from database
        const deleted = await Post.findByIdAndDelete(postID);
        if(deleted.picturePath && deleted.picturePath.filename ){
            const deleteResult = await cloudinary.uploader.destroy(deleted.picturePath.filename);
        }
        const post = await Post.find().sort({ createdAt: -1 })
        if(post){
            res.status(200).json(post)

        }else{
            res.status(200).json(post = [])

        }
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