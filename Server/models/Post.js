import mongoose from 'mongoose'

const { Schema } = mongoose

const postSchema = Schema({
    userID: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: String,
    userPicturePath: String,
    picturePath: {
        path :String,
        filename: String
    },

    likes: {
        type: Map,
        of: Boolean
    }
    ,
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true })


const Post = mongoose.model('Post', postSchema)

export default Post

