import express from "express";
import {
    sendMoney,
    getAllTransactions,
} from "../controller/transaction.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMoney);

router.get("/", protect, getAllTransactions);

export default router;