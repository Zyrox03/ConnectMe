import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js'
import passport from 'passport'

// register user

export const renderRegister = catchAsync(async (req, res) => {
    res.render('register');

})

export const register = catchAsync(async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body

        const user = new User({
            firstName,
            lastName,
            username,
            location,
            occupation,
        });

        user.picturePath.path = req.file.path
        user.picturePath.filename = req.file.filename

        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to your account!');
            res.status(201).json(registeredUser);
        })

    } catch (err) {
        res.status(409).send({ error: err.message });

    }  



})


// login user

export const renderLogin = catchAsync(async (req, res) => {
    res.render('login');

})


export const login = catchAsync(async (req, res) => {
    try {
         
        const { username, password } = req.body;
        const user = await User.findOne({ username }).populate("friends");
        if (!user) {
            return res.status(401).json({ error: "Invalid usernameee or password" });
        }
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})




export const logout = (req, res) => {

    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json('LOGGED OUT');

    });



}