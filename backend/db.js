const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String
});

const User = mongoose.model("User", UserSchema);


const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});
const Account=mongoose.model('Account',accountSchema);



module.exports = {
    User,
    Account,
};