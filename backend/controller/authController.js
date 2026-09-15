import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccountNumber = () => {
    return crypto
        .randomInt(100000000000, 1000000000000)
        .toString();
};

export const registerUser = async (req, res) => {
    try {
        console.log("REGISTER BODY:", req.body);
        const {
            fullname,
            firstName,
            lastName,
            email,
            password,
            pin,
            paymentPin
        } = req.body;
        const enterpin = pin;
        const paymentpin = paymentPin;
        const resolvedFullname =
            fullname || `${firstName || ""} ${lastName || ""}`.trim();

        if (
            !resolvedFullname ||
            !email ||
            !password ||
            enterpin === undefined ||
            paymentpin === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        let accountNumber;

        while (!accountNumber) {
            const generatedAccountNumber = generateAccountNumber();

            const existingAccount = await User.findOne({
                accountNumber: generatedAccountNumber
            });

            if (!existingAccount) {
                accountNumber = generatedAccountNumber;
            }
        }

        const normalizedEmail = email.toLowerCase().trim();
        const upiUsername = normalizedEmail.split("@")[0];
        const upiId = `${upiUsername}@valutrix`;

        const existingUpi = await User.findOne({
            upiId
        });

        if (existingUpi) {
            return res.status(409).json({
                success: false,
                message: "UPI ID already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname: resolvedFullname,
            email: normalizedEmail,
            password: hashedPassword,
            enterpin,
            paymentpin,
            accountNumber,
            upiId,
            balance: 25000,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                accountNumber: user.accountNumber,
                upiId: user.upiId,
                balance: user.balance,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const signup = registerUser;

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                accountNumber: user.accountNumber,
                upiId: user.upiId,
                balance: user.balance,
                enterpin: user.enterpin,
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

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const verifyPin = async (req, res) => {
    try {
        const { pin } = req.body;

        if (pin === undefined || pin === null || pin === "") {
            return res.status(400).json({
                success: false,
                message: "PIN is required",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (Number(user.enterpin) !== Number(pin)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Security PIN",
            });
        }

        return res.status(200).json({
            success: true,
            message: "PIN verified successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};