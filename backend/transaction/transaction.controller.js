import express from "express";

import { isUser } from "../middleware/middleware.authentication.js"; 
import validateReqBody from "../middleware/validate.req.body.js"; 
import TransactionTable from "./transaction.model.js"; 
import { transactionSchema } from "./transaction.validation.js"; 
import { validateMongoIdFromReqParams } from "../middleware/validate.mogo.id.js";
import { isOwnerOfTransaction } from "./transaction.middleware.js";

const router = express.Router();

export const viewTransactionController = async (req, res) => {
  try {
    const userId = req.loggedInUserId; // coming from isUser middleware

    const transactions = await TransactionTable.find({ userId }).select(
      "title amount type category description createdAt date"
    );

    return res.status(200).json({
      message: "Transaction list fetched successfully",
      Transaction: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const recentPaymentsController = async (req, res) => {
  try {
    const userId = req.loggedInUserId;
    const limit = Number(req.body.limit) || 2;

    const recentPayments = await TransactionTable.find({ userId })
      .select("title amount type category date")
      .sort({ date: -1 })
      .limit(limit);

    return res.status(200).json({
      message: "Recent payments fetched successfully",
      payments: recentPayments,
    });
  } catch (error) {
    console.error("Error fetching recent payments:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//add transaction
router.post(
  "/add/transaction",
  isUser,
  validateReqBody(transactionSchema),
  async (req, res) => {
    try {
      const newTransaction = req.body;
      const userId = req.loggedInUserId;
      await TransactionTable.create({ ...newTransaction, userId });
      return res.status(201).send({
        message: "Transaction is added successfully", newTransaction 
      });
    } catch (error) {
      console.error("Transaction creation failed:", error);
      return res.status(500).send({
        message: "Failed to add transaction",
        error: error.message,
      });
    }
  }
);
//get transaction
router.post("/view/transaction", isUser, viewTransactionController)
 
  router.post("/recent-payments", isUser, recentPaymentsController);




router.delete("/delete/transaction/:id", isUser, validateMongoIdFromReqParams, isOwnerOfTransaction, async(req, res, next) => {
  await TransactionTable.deleteOne({ _id: req.params.id });
  console.log(req.params.id);
  return res.status(200).send({ message: "Deleted transaction Successfully" });
})
// PUT: Edit a transaction
router.put(
  "/edit/transaction/:id",
  isUser,
  validateMongoIdFromReqParams,
  isOwnerOfTransaction,
  validateReqBody(transactionSchema),
  async (req, res) => {
    try {
      const transactionId = req.params.id;
      const updatedTransaction = req.body;

      await TransactionTable.updateOne(
        { _id: transactionId },
        { $set: { ...updatedTransaction } }
      );

      return res.status(200).send({
        message: "Transaction updated successfully",
        updatedTransaction,
      });
    } catch (error) {
      console.error("Transaction update failed:", error.message);
      return res.status(500).send({
        message: "Failed to update transaction",
        error: error.message,
      });
    }
  }
);


export { router as transactionController };

