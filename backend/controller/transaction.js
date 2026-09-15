import { getRoomId } from "./SocketIO/roomId.js";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";
export const sendMoney = async (req, res) => {
    try {
        const { to, amount } = req.body;
        const senderId = req.user.id;
        if (!to || !amount) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0",
            });
        }
        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({
                message: "Sender not found",
            });
        }
        const receiver = await User.findOne({
            $or: [
                {
                    accountNumber: to,
                },
                {
                    upiId: to.toLowerCase().trim(),
                },
                {
                    phone: to,
                },
            ],
        });
        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found",
            });
        }

        const receiverId = receiver._id.toString();
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                message: "You cannot send money to yourself",
            });
        }

        if (sender.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        const roomId = getRoomId(senderId, receiverId);

        let transactionId;

        while (true) {
            const generatedId = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
            const existingTransaction = await Transaction.findOne({ transactionId: generatedId });
            if (!existingTransaction) {
                transactionId = generatedId;
                break;
            }
        }

        const transaction = await Transaction.create({
            sender: senderId,
            receiver: receiverId,
            amount: Number(amount),
            status: "Success",
            transactionId,
            roomId,
        });

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        req.app.get("io")?.to(roomId).emit("transaction", transaction);

        return res.status(200).json({
            message: "Payment sent successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

}

export const getAllTransactions = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const transactions = await Transaction.find({
            $or: [
                {
                    sender: user._id,
                },
                {
                    receiver: user._id,
                },
            ],
        });
        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}