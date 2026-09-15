import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Transaction } from "../../models/transaction.js";
import { getRoomId } from "./roomId.js";

const generateTransactionId = () => {
    return Math.floor(
        1000000000000000 +
        Math.random() * 9000000000000000
    ).toString();
};

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Access Denied. No Token Provided.")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            next();
        } catch (error) {
            console.error(
                "Socket Authentication Error:",
                error.message
            );

            next(new Error("Invalid or Expired Token"));
        }
    });

    io.on("connection", (socket) => {

        const userId = socket.user.id.toString();

        console.log("User connected:", userId);

        socket.on("payment", ({ otherUserId }) => {
            try {
                if (!otherUserId) {
                    return;
                }

                const roomId = getRoomId(
                    userId,
                    otherUserId.toString()
                );

                socket.join(roomId);

                console.log(
                    "User joined payment room:",
                    roomId
                );

                socket.emit("joinedRoom", {
                    roomId,
                });

            } catch (error) {
                console.error(
                    "Join Room Error:",
                    error.message
                );
            }
        });

        socket.on(
            "sendPayment",
            async ({ to, amount }) => {

                try {
                    if (!to || !amount) {
                        return;
                    }

                    const senderId = userId;
                    const receiverId = to.toString();

                    const roomId = getRoomId(
                        senderId,
                        receiverId
                    );

                    let transactionId;

                    while (true) {
                        const generatedId =
                            generateTransactionId();

                        const existingTransaction =
                            await Transaction.findOne({
                                transactionId:
                                    generatedId,
                            });

                        if (!existingTransaction) {
                            transactionId =
                                generatedId;
                            break;
                        }
                    }

                    const transaction =
                        await Transaction.create({
                            sender: senderId,
                            receiver: receiverId,
                            amount: Number(amount),
                            status: "completed",
                            transactionId,
                            roomId,
                        });
                    const senderUser = await User.findById(senderId);
                    const receiverUser = await User.findById(receiverId);
                    senderUser.balance -= Number(amount);
                    receiverUser.balance += Number(amount);
                    await senderUser.save();
                    await receiverUser.save();

                    
                    io.to(roomId).emit(
                        "transaction",
                        transaction
                    );

                } catch (error) {
                    console.error(
                        "Payment Error:",
                        error.message
                    );
                }
            }
        );

        socket.on("disconnect", () => {
            console.log(
                "User disconnected:",
                userId
            );
        });
    });
    return io;
};