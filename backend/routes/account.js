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


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        // Convert amount to number
        const transferAmount = Number(amount);

        // Validate amount
        if (!transferAmount || transferAmount <= 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Invalid transfer amount"
            });
        }

        // Find sender
        const senderAccount = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!senderAccount) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Sender account not found"
            });
        }

        // Check balance
        if (senderAccount.balance < transferAmount) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Find receiver
        const receiverAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!receiverAccount) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Receiver account not found"
            });
        }

        // Don't allow sending money to yourself
        if (senderAccount.userId.toString() === receiverAccount.userId.toString()) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Cannot transfer money to yourself"
            });
        }

        // Subtract from sender
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -transferAmount } },
            { session }
        );

        // Add to receiver
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: transferAmount } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();

        return res.status(200).json({
            message: "Transfer successful"
        });

    } catch (error) {

        await session.abortTransaction();

        console.error("Transfer error:", error);

        return res.status(500).json({
            message: "Transfer failed",
            error: error.message
        });

    } finally {
        session.endSession();
    }
});

module.exports=router;
