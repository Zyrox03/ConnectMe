import express from "express";
import { login, register, renderRegister, renderLogin, logout, verifyEmail, resetPassword, renderReset , resetPasswordNow } from '../controllers/auth.js'
import passport from 'passport'
import multer from 'multer'
import { storage } from '../cloudinary/index.js'
const upload = multer({ storage });
// import { isLoggedIn, ensureVerified } from '../middleware/middleware.js'

const router = express.Router();

router.get('/register', renderRegister);
router.post('/register', upload.single('picturePath'), register)
router.get('/verify/:uniqueString',verifyEmail)
router.get('/login', renderLogin);
router.post('/login',(req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Authentication failed, send error message
        return res.status(401).send({error : info.message});
      }
      // Authentication succeeded, log the user in and send success message
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        next()
      });
    })(req, res, next);
  },login);
 
  
  router.post('/reset', resetPassword);
  router.get('/reset/:uniqueString', renderReset);
  router.post('/resetPassword', resetPasswordNow);
  
  
  

router.get('/logout', logout)


export default router