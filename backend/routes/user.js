const express = require("express");
const router = express.Router();
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const bcrypt = require("bcrypt");
const { User } = require("../db.js");
const  {authMiddleware}=require("../middleware.js")
const {Account}=require("../db.js")

// Signup schema
const signupSchema = z.object({
    username: z.string().min(3, "Username should be at least 3 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password should be at least 6 characters long"),
});

// Signup route
router.post("/signup", async (req, res) => {
    const body = req.body;

    const { success } = signupSchema.safeParse(body);
    console.log(success)

    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs",
        });
    }

    const existingUser = await User.findOne({
        username: body.username,
    });

    if (existingUser) {
        return res.status(409).json({
            message: "Username already taken",
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const dbUser = await User.create({
        ...body,
        password: hashedPassword,
    });
    await Account.create({
        userId:dbUser._id,
        balance:1+Math.random()*10000
    })

    const token = jwt.sign(
        {
            userId: dbUser._id,
        },
        JWT_SECRET
    );

    return res.status(201).json({
        message: "User created successfully",
        token: token,
    });
});

// Signin route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        username: username,
    });

    if (!user) {
        return res.status(404).json({
            message: "No user found",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Incorrect password",
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user._id,
        },
        JWT_SECRET
    );

    return res.status(200).json({
        message: "User signed in successfully",
        token: token,
    });
});
console.log("testing")

//update route
const updatebody=z.object({
    password:z.string().optional(),
    firstName:z.string().optional(),
    lastName:z.string().optional()
})
router.put("/update",authMiddleware,async(req,res)=>{
    try{
       

        const {success}= updatebody.safeParse(req.body)
        console.log("after success")
    if(!success) {
        console.log("inside if block")
        res.status(411).json({
            message:"error while updating"
        })
    }
   

    await User.updateOne({_id:req.userId},req.body);

    res.json({
        message:"updated successfully"
    })
}
catch(error){
    console.log("erorrrrr")
    res.status(500).send(error)
}
})
//route to filter using firstname or lastname
router.get("/filter",async(req,res)=>{
    const filter=req.query.filter||"";
    const users= await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            },},{
                lastName:{
                "$regex":filter


                
                }
            }]
        
})

    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})




module.exports = router;