import express from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/users.js'
const router = express.Router();


// READ

router.get('/:id', getUser)
router.get('/:id/friends', getUserFriends)
router.patch('/:id/:friendID', addRemoveFriend)

export default router
