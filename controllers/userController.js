const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
//const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv');
dotenv.config();

//User sign up 
const addUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log("Request received");
    if(!name || !email || !password){
        console.log('Values missing');
        return res.sendStatus(400);
    }

    try{
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            console.log('Email already exists');
            return res.status(409).send('Email already exists');
        }

        bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hash,
        })
        console.log('User added');
        res.status(201).json(newUser)
    })

    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(500).json({error})
    }
};


// Generating jwt token
const generateToken = (id, isPremiumuser) =>{
    return jwt.sign({userId: id, isPremiumuser}, process.env.JWT_TOKEN);
};

//User login
const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Login Request received");
    if(!email || !password){
        console.log('Login Values missing');
        return res.sendStatus(400);
    } 

    try{
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('Email not found');
            return res.status(404).send('Email not found');
        }

        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                throw new Error("Something went wrong");
            }
            
            if(result){
                res.status(200).json({message:"Login successful", token: generateToken(user._id, user.isPremiumuser)}); 
            }

            else{
                res.status(401).send('Incorrect password');
            }
        });

    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(501).json({error})
    }
};


// Forgot password
const sendResetLink = async (req, res, next) => {
    const uuid = uuidv4();
    const userMail = req.body.email;
    if (!userMail) {
        console.log('Email missing');
        return res.sendStatus(400);
    }

    try {
        const user = await User.findOne({ email: userMail });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const storeForgotRequest = await ForgotPasswordRequest.create({
            userId: user._id,
            uuid: uuid
        });

        // Transporter configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_SENDER , // Use environment variables
                pass: process.env.SENDER_PASS,
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Yash" <tech1organisation@gmail.com>', // sender address
            to: userMail, // list of receivers
            subject: "Forgot Password", // Subject line
            html: `<p>Here is your link to reset your password <a href ="http://localhost:3000/user/password/forgotpassword/${storeForgotRequest.uuid}">Reset password</a></p>`, // html body
        });

        
        console.log("Password reset email sent: %s", info.messageId);
        res.status(200).json({ message: 'Password reset link sent to your email', info });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}


// Check Forgot password request by uuid link

const checkForgotRequest = async(req, res, next)=>{
    try{

    const id = req.params.id;
    const checkId = await ForgotPassword.findOne({ uuid: id });
    
    if(checkId){
        res.sendFile(path.join(__dirname, '..', "public", "updatePass.html"));   
    }
    }catch (error) {
        console.error(error);
        res.status(500).json({error})
    }
}


//Update password
const updateForgotPassword = async (req, res, next) => {
    const password = req.body.password;
    const id = req.params.id;
    console.log("Request received", req.body);
    if(!password){
        console.log('password missing ');
        return res.sendStatus(400);
    }

    try{
        const forgotPassword = await ForgotPasswordRequest.findOne({ uuid: id });
            if (!forgotPassword) {
            console.log('Invalid or expired link');
            return res.status(404).send('Invalid or expired link');
        }


        const user = await User.findOne({ _id: forgotPassword.userId });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        bcrypt.hash(password, 10, async (err, hash) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: 'Error with hashing password'});
        }

        await user.update({ password: hash });  // check mongon db for same as sequelize
        console.log('Password updated');
        res.status(200).json({ message: 'Password Updated',});
    });
    
    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(500).json({error})
    }
};


module.exports = {
    addUser,
    login,    
    generateToken,
    sendResetLink,
    checkForgotRequest,
    updateForgotPassword
};