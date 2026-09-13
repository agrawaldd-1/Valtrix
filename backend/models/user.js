import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enterpin: { type: Number, required: true },
    paymentpin: { type: Number, required: true }
});

export const User = mongoose.model("User", UserSchema);
