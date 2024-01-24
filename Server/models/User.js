import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 50,
    },

    lastName: {
      type: String,
      required: true,
      max: 50,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },
    picturePath: {
      path: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    verified: Boolean,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;
