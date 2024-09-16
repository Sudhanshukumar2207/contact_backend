const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");

const validateToken=asyncHandler(async(req,res,next)=>{
    let token;
    let author=req.headers.authorization || req.headers.Authorization;
    if(author && author.startsWith("Bearer")){
        token=author.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECERT,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user=decoded.user;
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing!");
        }
    }
});

module.exports=validateToken;