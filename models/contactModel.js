const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    name: {
        type: String,
        required: [true, "Please add the contact name"],
    },
    email: {
        type: String,
        // required: [true, "Please add the contact email address"],
    },
    phone: {
        type: String,
        required: [true, "Please add the contact phone number"],
        // unique: [true, "Already saved"],
    },
}, {
    timestamps: true,
});
contactSchema.index({ user_id: 1, phone: 1 }, { unique: true });
module.exports = mongoose.model("Contact", contactSchema);
