const mongoose =require("mongoose");
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        require:[true,"Username is Required"]
    },
    userphone:{
        type:String,
        require:[true,"Phone number is Required"],
        unique:[true,"Mobile no is already taken"],
    },
    password:{
        type:String,
        require:[true,"Password is Required"]
    },
},
{
    timestamps:true,
}
)

module.exports = mongoose.model("User", userSchema);