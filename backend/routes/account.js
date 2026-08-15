const express=require("express")
const router=express.Router()
const {Account}=require("../db.js")
const  {authMiddleware}=require("../middleware.js")

router.get("/balance",authMiddleware,async(req,res)=>{

    console.log("REQ USER ID:", req.userId);
    const account=await Account.findOne({
        userId:req.userId
    })
    console.log("ACCOUNT",account)
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }
    res.status(200).json({
        balance:account.balance
    })

})


router.post("/transfer",authMiddleware,async(req,res)=>{
    const {amount,to}=req.body;
    const account=await account.findOne({
        userId=req.userId
    })
    if(account.balance<amount){
        res.status(400).json({
            message:"insufficient balance"
        })
    }

})

module.exports=router;
