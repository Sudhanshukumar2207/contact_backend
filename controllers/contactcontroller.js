const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@rout Get /api/contacts
//@access private
const getContacts = asyncHandler(async(req, res)=>{
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

//@desc Create New contacts
//@rout POST /api/contacts
//@access private
const createContact = asyncHandler(async(req, res)=>{
    const {name,email,phone} = req.body
    if(!name || !phone){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const connect = await Contact.create({
        user_id:req.user.id,
        name,
        email,
        phone,
    });
    res.status(201).json(connect);
});

//@desc Get contacts
//@rout get /api/contacts
//@access private
const getContact = asyncHandler(async(req, res)=>{
    const connect=await Contact.findOne({ _id:req.params.id })
    if(!connect){
        res.status(400);
        throw new Error("Contact not found");
    }
    res.status(200).json(connect);
});

//@desc Update contact
//@rout PUT /api/contacts
//@access private
const updateContact = asyncHandler(async(req, res)=>{
    const connect=await Contact.findOne({ _id:req.params.id })
    if(!connect){
        res.status(400);
        throw new Error("Contact not found");
    }
    if(connect.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("You don't have permission to update other user's contacts!");
    }
    const updateContact=await Contact.findByIdAndUpdate(
        connect._id,
        req.body,
        {new:true}
    );
    res.status(200).json(updateContact);
});

//@desc Delete contact
//@rout DELETE /api/contacts
//@access private
const mongoose = require('mongoose');

const deleteContact = asyncHandler(async (req, res) => {
    const contactIdsString = req.params.id;  // Comma-separated string of IDs from the frontend
    const contactIdsArray = contactIdsString.split(',');  // Split the string into an array

    // Convert the string IDs into MongoDB ObjectId
    const contactIds = contactIdsArray.map(id => new mongoose.Types.ObjectId(id.trim()));

    // Find all contacts with those IDs
    const contacts = await Contact.find({ _id: { $in: contactIds } });


    // Ensure user has permission to delete the contacts
    const unauthorized = contacts.some(contact => contact.user_id.toString() !== req.user.id);
    if (unauthorized) {
        res.status(403);
        throw new Error("You don't have permission to delete other users' contacts!");
    }

    // Delete the contacts
    const deletedContacts = await Contact.deleteMany({ _id: { $in: contactIds } });

    res.status(200).json(deletedContacts);
});




module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
};