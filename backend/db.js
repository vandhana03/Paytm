const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB successfully");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const UserSchema=new mongoose.Schema({
    FirstName:{
        type:String,
        required:[true,"First Name is required"]
    },
    LastName:{
        type:string,
        required:[true,"Last Name is required"]
    },
    username:{
        type:String,
        required:[true,"Username is required"],

    },
    password:{
        type:String,
        required:[true,"Password is required"]  
    },
})

const User=mongoose.model('User',UserSchema);

// async function createUser(firstName, lastName, password) {
//     const user=new User({
//         FirstName:firstName,
//         LastName:lastName,
//         password:password
//     });
//     try {
//         const savedUser=await user.save();
//         console.log("User created successfully:", savedUser);
//     } catch (error) {
//         console.error("Error creating user:", error);
//     }
// }
module.exports = {
    User
};