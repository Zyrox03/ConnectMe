import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'

const { Schema } = mongoose

const userVerificationSchema = new Schema(
    {
     userID :String,
     uniqueString:String,
     createdAt:Date,
     expiresAt:Date
    }
)




const UserVerification = mongoose.model('UserVerification', userVerificationSchema)


export default UserVerification;