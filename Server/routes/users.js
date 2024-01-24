import express from "express";
import { isLoggedIn, ensureVerified } from "../middleware/middleware.js";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateSavedPosts,
} from "../controllers/users.js";
const router = express.Router();

// READ

router.get("/:id", getUser);
router.patch("/:id/updateSaved/:postID", updateSavedPosts);
router.get("/:id/friends", getUserFriends);
router.patch("/:id/:friendID", addRemoveFriend);

export default router;
