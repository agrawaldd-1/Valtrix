import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Success", "Pending", "Failed"],
        default: "Pending"
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    }
})

export const Transaction = mongoose.model("Transaction", transactionSchema);