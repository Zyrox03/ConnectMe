import User from '../models/User.js'
import UserVerification from '../models/UserVerification.js'
import catchAsync from '../utils/catchAsync.js'
import passport from 'passport'
import CircularJSON from 'circular-json';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv'
dotenv.config();

//nodemailer stuff
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

transporter.verify()
    .then(() => {
        console.log('Transporter is verified');
    })
    .catch(err => {
        console.error('Error verifying transporter:', err);
    });


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
            location,
            occupation,
        } = req.body



        const user = new User({
            firstName,
            lastName,
            username,
            location,
            occupation,
            verified: false

        });

        if (req.file) {
            user.picturePath.path = req.file.path
            user.picturePath.filename = req.file.filename
        } else {
            user.picturePath.path = 'https://res.cloudinary.com/duh30yscb/image/upload/v1680963029/SocialMedia/meibssbpjypmfhpbpiv8.png'
        }

        const registeredUser = await User.register(user, password);



        // Create and save a unique verification string
        const uniqueString = uuidv4();
        const userVerification = new UserVerification({
            userID: registeredUser._id,
            uniqueString,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // Expires after 1 hour
        });
        await userVerification.save();

        // Send verification email
        const verificationURL = `${req.protocol}://${req.get('host')}/auth/verify/${uniqueString}?verified=true`;
        await transporter.sendMail({
            from: 'ConnectMe Team',
            to: registeredUser.username,
            subject: 'Please verify your email address',
            html: `
            <html>
      <head>
        <style>
          /* Add your custom CSS styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            padding: 20px;
          }
          h1 {
            color: #00D5FA;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            background-color: #00D5FA;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            margin: 10px;
            
          }
        </style>
       
      </head>
      <body>
        <h1>Please Verify Your Email Address</h1>
        <p>Hello ${registeredUser.firstName},</p>
        <p>Thank you for registering with ConnectMe. To verify your email address, please click the button below:</p>
        <div style="text-align: center;">
          <a href="${verificationURL}" class="button">Verify Email Address</a>
        </div>
      </body>
    </html>
    `,
        });




        res.status(403).send({ verify: "Please verify your email" });


    } catch (err) {
        res.status(409).send({ error: err.message });

    }



})


export const verifyEmail = catchAsync(async (req, res) => {
    const { uniqueString } = req.params

    const verificationToken = await UserVerification.findOne({
        uniqueString,
        expiresAt: { $gt: Date.now() },
    });

    if (!verificationToken) {
        return res.status(400).send({ message: "Invalid or expired token" });
    }

    const user = await User.findById(verificationToken.userID);

    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    await UserVerification.deleteOne({ uniqueString });

    req.login(user, (err) => {
        console.log(req.user)
        if (err) {
            return res.status(500).send({ message: "An error occurred while logging in" });
        }

        const userData = JSON.stringify(user);

        // Redirect the user to the desired client-side URL with the user data as a query parameter
        return res.redirect(`${process.env.GLITCH_API}/?user=${encodeURIComponent(userData)}`);
    });
})


// login user

export const renderLogin = catchAsync(async (req, res) => {
    res.render('login');

})


export const login = catchAsync(async (req, res) => {
    try {
        console.log('hello login')
        const { username, password } = req.body;
        const user = await User.findOne({ username }).populate("friends");
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        if (!user.verified) {
            return res.status(401).json({ error: "Please verify your email to login" });
        }
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})
export const resetPassword = catchAsync(async (req, res) => {
    try {

        const { username } = req.body;
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: "Email not registered" });
        }
        if (!user.verified) {
            return res.status(401).json({ error: "Please verify your email first" });
        }



        const uniqueString = uuidv4();
        const userVerification = new UserVerification({
            userID: user._id,
            uniqueString,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // Expires after 1 hour
        });
        await userVerification.save();

        // Send verification email
        const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${uniqueString}`;
        await transporter.sendMail({
            from: 'ConnectMe Team',
            to: user.username,
            subject: 'Reset your password ',
            html: `
            <html>
      <head>
        <style>
          
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8; 
            padding: 20px;
          }
          h1 {
            color: #00D5FA;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            background-color: #00D5FA;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            margin: 10px;
            
          }
        </style>
       
      </head>
      <body>
        <h1>Reset Your ConnectMe Password</h1>
        <p>Hello ${user.firstName},</p>
        <p> To reset your password, please click the button below:</p>
        <div style="text-align: center;">
          <a href="${resetURL}" class="button">Reset Password</a>
        </div>
      </body>
    </html>
    `,
        });

        res.status(200).send({ verify: "Please verify your email" });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export const renderReset = catchAsync(async (req, res) => {
    const uniqueString = req.params.uniqueString;
    const user = await UserVerification.findOne({ uniqueString })
    try {
        if (!user || user.expiresAt < new Date()) {
            // Unique string not found or expired
            return res.status(400).send({ message: 'Invalid reset link.' });
        }
        // Render the password reset form with the user ID and unique string
        // res.status(200).json({ userId: user.userID, uniqueString });
        return res.redirect(`${process.env.GLITCH_API}/?resetP=${user.userID}`);

    } 
    catch (err) {
        res.status(500).send({ message: err.message });
    }
})

export const resetPasswordNow = catchAsync(async(req,res)=>{
    try {
    const { resetP, password } = req.body;

        const user = await User.findById(resetP);
        
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        user.setPassword(password, async () => {
            // Save the updated user object to the database
            await user.save();
      

return res.status(200).json({ verify: 'Password updated successfully', user: CircularJSON.stringify(user) });

        })
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error updating password in database' });
      }
})




export const logout = (req, res) => {

    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json('LOGGED OUT');

    });



}