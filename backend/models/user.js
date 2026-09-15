import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    enterpin: {
      type: Number,
      required: true
    },

    paymentpin: {
      type: Number,
      required: true
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true
    },

    upiId: {
      type: String,
      required: true,
      unique: true
    },

    balance: {
      type: Number,
      required: true,
      default: 25000,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", UserSchema);