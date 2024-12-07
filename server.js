// console.log("I am in express project");
const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();
connectDb();

const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/contacts", require("./routes/contactroutes"));
app.use("/api/user", require("./routes/userroutes"));
// app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`Server running on port  ${port}`);
}) 