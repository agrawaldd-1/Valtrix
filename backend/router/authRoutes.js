import express from "express";

import {
    registerUser,
    loginUser,
    getProfile,
    verifyPin,
} from "../controller/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.post("/verify-pin", protect, verifyPin);

export default router;