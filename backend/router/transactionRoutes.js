import express from "express";
import {
    sendMoney,
    getAllTransactions,
    fetchTransaction,
} from "../controller/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMoney);

router.get("/", protect, getAllTransactions);
router.get(
    "/transaction/:transactionId",
    protect,
    fetchTransaction
);
export default router;