import { getRoomId } from "./SocketIO/roomId.js";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";
export const sendMoney = async (req, res) => {
    try {
        const { to, amount, paymentPin } = req.body;
        const senderId = req.user.id;

        if (!to || !amount) {
            return res.status(400).json({
                success: false,
                message: "Recipient and amount are required",
            });
        }

        const transferAmount = Number(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0",
            });
        }

        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({
                success: false,
                message: "Sender not found",
            });
        }

        // Verify payment PIN if provided or if sender has paymentpin configured
        if (paymentPin !== undefined && paymentPin !== null && paymentPin !== "") {
            if (Number(sender.paymentpin) !== Number(paymentPin)) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect 4-digit Payment PIN",
                });
            }
        }

        const searchTarget = to.trim();
        const receiver = await User.findOne({
            $or: [
                { accountNumber: searchTarget },
                { upiId: searchTarget.toLowerCase() },
                { email: searchTarget.toLowerCase() },
                { fullname: new RegExp(`^${searchTarget}$`, "i") },
            ],
        });

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found. Please verify UPI ID, Account number, or Email.",
            });
        }

        const receiverId = receiver._id.toString();
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send money to yourself",
            });
        }

        if (sender.balance < transferAmount) {
            return res.status(400).json({
                success: false,
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
            amount: transferAmount,
            status: "Success",
            transactionId,
            roomId,
        });

        sender.balance -= transferAmount;
        receiver.balance += transferAmount;

        await sender.save();
        await receiver.save();

        req.app.get("io")?.to(roomId).emit("transaction", transaction);

        return res.status(200).json({
            success: true,
            message: "Payment sent successfully",
            transaction: {
                ...transaction.toObject(),
                sender: {
                    _id: sender._id,
                    fullname: sender.fullname,
                    upiId: sender.upiId,
                },
                receiver: {
                    _id: receiver._id,
                    fullname: receiver.fullname,
                    upiId: receiver.upiId,
                    accountNumber: receiver.accountNumber,
                }
            },
            newBalance: sender.balance,
            receiver: {
                fullname: receiver.fullname,
                upiId: receiver.upiId,
                accountNumber: receiver.accountNumber,
                email: receiver.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const transactions = await Transaction.find({
            $or: [
                { sender: user._id },
                { receiver: user._id },
            ],
        })
        .populate("sender", "fullname email accountNumber upiId")
        .populate("receiver", "fullname email accountNumber upiId")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            transactions,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};