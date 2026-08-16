const express=require("express")
const router=express.Router()
const {Account}=require("../db.js")
const mongoose = require("mongoose");
const  {authMiddleware}=require("../middleware.js")

router.get("/balance",authMiddleware,async(req,res)=>{

    const account=await Account.findOne({
        userId:req.userId
    })
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
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;
    const account=await Account.findOne({
        userId:req.userId
    }).session(session)

    if(!account||account.balance<amount){
        return res.status(400).json({
            message:"insufficient balance"
        })
    }
    const toAccount=await Account.findOne({
        userId:to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"invalid account"
        })
    }
    await Account.updateOne(
        {userId:req.userId},
        {$inc:{balance:-amount}}
    ).session(session);
    await Account.updateOne(
        {userId:to},
        {$inc:{balance:amount}}
    ).session(session)
//commit the transaction

    await session.commitTransaction();

    res.json({
        message:"transfer successfull"
    })
}


)

module.exports=router;
