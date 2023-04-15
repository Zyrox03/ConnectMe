// import jwt from "jsonwebtoken";


export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/auth/login');
    }
    next();
}


export const ensureVerified = (req, res, next) => {
  console.log(req.isAuthenticated())
    if (req.isAuthenticated() && req.user.verified) {
      return next();
    }
    res.status(401).send({ error: 'You need to verify your email address before logging in' });
  };
