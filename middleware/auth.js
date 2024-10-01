const jwt= require('jsonwebtoken');
const User= require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticate= async (req, res, next)=>{
    try{
        const token = req.header('Authorization');
        const user= jwt.verify(token, process.env.JWT_TOKEN);
        User.findById(user.userId)
        .then(user=>{
            req.user= user;
            next();
        })
    }
    catch(err){
        console.log(err);
        return res.status(401).json({message: "Authorization failed"});
    }
}