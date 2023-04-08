import jwt from "jsonwebtoken";


export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/auth/login');
    }
    next();
}

