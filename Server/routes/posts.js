import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  getFriendsPosts,
  getOnePost,
  getSavedPosts,
} from "../controllers/posts.js";
import { isLoggedIn, ensureVerified } from "../middleware/middleware.js";

import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage });

const router = express.Router();

// READ

router.get("/", getFeedPosts);
router.get("/:userID/posts", getUserPosts);
router.get("/:userID/friends-posts", getFriendsPosts);
router.get("/:userID/saved", getSavedPosts);
router.get("/:postID", getOnePost);

// post POST

router.post("/", upload.single("picturePath"), createPost);

// PATCH

router.patch("/:id/like", likePost);

// DELETE

router.delete("/:postID", deletePost);

export default router;
