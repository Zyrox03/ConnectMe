import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";

// READ

export const getUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Find the user by ID
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Count total likes

  // Aggregate total likes
  const totalLikesAggregation = await Post.aggregate([
    { $match: { userID: id } },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: { $size: { $objectToArray: "$likes" } } },
      },
    },
  ]);

  // Extract the total likes from the aggregation result
  const totalLikes = totalLikesAggregation.length > 0 ? totalLikesAggregation[0].totalLikes : 0;

  // Count total friends
  const totalFriends = user.friends.length;

  // Count total posts
  const totalPosts = await Post.countDocuments({ userID: id });

  // Create an object with the user data and counts
  const userDataWithCounts = {
    ...user.toObject(),
    totalLikes,
    totalFriends,
    totalPosts,
  };

  console.log(userDataWithCounts)
  res.status(200).json(userDataWithCounts);
});
// READ FRIENDS

export const getUserFriends = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(200).json(formattedFriends);
});

// UPDATE

export const addRemoveFriend = catchAsync(async (req, res) => {
  const { id, friendID } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendID);

  if (user.friends.includes(friendID)) {
    user.friends = user.friends.filter((id) => id != friendID);
    friend.friends = friend.friends.filter((id) => id != id);
  } else {
    friend.friends.push(id);
    user.friends.push(friendID);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(201).json(formattedFriends);
});

export const updateSavedPosts = catchAsync(async (req, res) => {
  try {
    const { id, postID } = req.params;
    console.log(postID)
    const user = await User.findById(id);
    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ error: "Post not found to save it" });
    }

   // Convert postID to ObjectId
   const targetPostID = new mongoose.Types.ObjectId(postID);

   // Check if the postID is already in the savedPosts array
   const isPostSaved = user.savedPosts.some(savedPostID => savedPostID.equals(targetPostID));

   if (isPostSaved) {
       // If postID is already saved, remove it
       user.savedPosts = user.savedPosts.filter(savedPostID => !savedPostID.equals(targetPostID));
   } else {
       // If postID is not saved, add it
       user.savedPosts.push(targetPostID);
   }


    // Save the updated user document
    await user.save();
    console.log(isPostSaved)

    res
      .status(201)
      .json({
        updatedUser: user.savedPosts,
        message: "Post saved successfully",
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});
