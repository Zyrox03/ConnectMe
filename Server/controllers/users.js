import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js'

// READ

export const getUser = catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)

    res.status(200).json(user)


})
// READ FRIENDS


export const getUserFriends = catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        }
    )
   

   res.status(200).json(formattedFriends)


})

// UPDATE

export const addRemoveFriend = catchAsync(async (req, res) => {
    const { id, friendID } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendID)

    // if (id === friendID) return false

    if (user.friends.includes(friendID)) {
        user.friends = user.friends.filter((id) => id != friendID)
        friend.friends = friend.friends.filter((id) => id != id)
    } else {
        friend.friends.push(id)
        user.friends.push(friendID)

    }

    await user.save()
    await friend.save()

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        }
    )

    

    res.status(201).json(formattedFriends)

})