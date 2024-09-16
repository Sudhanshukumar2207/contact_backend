const asyncHandler = require("express-async-handler");
const { Error } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/user/register
//@access public
const register=asyncHandler(async(req,res)=>{
    const {username, userphone, password}=req.body;
    if(!username || !userphone || !password){
        res.status(400).json({"error":"All fields are mandatory!"});
    }
    const userAvailable = await User.findOne({userphone});
    if(userAvailable){
        res.status(400).json({"error":"User already registered!"});
    }
    //Hash password
    const hashPassword = await bcrypt.hash(password,10);
    console.log("Hash Password : ",hashPassword);
    const user = await User.create({
        username,
        userphone,
        password:hashPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user.id,phone:user.userphone});
    }else{
        res.status(400).json({"error":"User data is not valid"});
    }
});

//@desc login a user
//@route POST /api/user/login
//@access public
const login =asyncHandler(async(req,res)=>{
    const {userphone, password}=req.body;
    if(!userphone || !password){
        res.status(400).json({"error":"All fields are mandatory!"});
    }
    const user=await User.findOne({userphone});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                userphone:user.userphone,
                id:user.id,
            },
        },
            process.env.ACCESS_TOKEN_SECERT,
            {expiresIn:"60m"}
        );
        res.status(200).json({"accessToken":accessToken,"name":user.username});
    }else{
        res.status(400).json({"error":"Phone or Password is not valid"});
    }
});

//@desc Current user info
//@route POST /api/user/current
//@access private
const current =asyncHandler(async(req,res)=>{
    res.status(200).json(req.user);
});

module.exports={
    register,
    login,
    current
};