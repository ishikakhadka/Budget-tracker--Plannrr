import express from "express";
import { isUser } from "../middleware/middleware.authentication.js";
import validateReqBody from "../middleware/validate.req.body.js";
import { budgetPlanValidationSchema } from "./budget.validation.js";
import { BudgetTrackerTable } from "./budget.model.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mogo.id.js";

const router = express.Router();

// Controller to view budgets for logged-in user
export const ViewBudgetController = async (req, res) => {
  try {
    const userId = req.loggedInUserId; // from isUser middleware

    const budgets = await BudgetTrackerTable.find({ userId }).select(
      "title currentBalance savingPlan period currentSavings startDate description createdAt"
    );

    return res.status(200).json({
      message: "Budget plan fetched successfully",
      Budget: budgets,
    });
  } catch (error) {
    console.error("Error fetching budget:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to update budget plan
export const budgetPlanUpdate = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.loggedInUserId;

    const plan = await BudgetTrackerTable.findOne({ userId });
    if (!plan) {
      return res.status(404).send({ message: "Budget Plan doesn't exist" });
    }

    await BudgetTrackerTable.findByIdAndUpdate(plan._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({ message: "Successfully updated budget plan" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Route to add a new budget
router.post(
  "/add-budget",
  isUser,
  validateReqBody(budgetPlanValidationSchema),
  async (req, res) => {
    try {
      const newBudget = req.body;
      const userId = req.loggedInUserId;

      await BudgetTrackerTable.create({ ...newBudget, userId });

      return res.status(201).send({
        message: "Budget plan created successfully.",
        newBudget,
      });
    } catch (error) {
      console.error("Budget creation failed:", error);
      return res.status(500).send({
        message: "Failed to add budget",
        error: error.message,
      });
    }
  }
);

// Route to view budgets - only defined once
router.post("/view-budget", isUser, ViewBudgetController);

// Route to delete a budget by ID
router.delete(
  "/delete-budget/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res) => {
    await BudgetTrackerTable.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send({ message: "Deleted budget plan successfully" });
  }
);

// PUT: Edit a specific budget plan by ID
router.put(
  "/edit-budget/:id",
  isUser,
  validateMongoIdFromReqParams,
  validateReqBody(budgetPlanValidationSchema),
  async (req, res) => {
    try {
      const budgetId = req.params.id;
      const userId = req.loggedInUserId;
      const updates = req.body;

      const budget = await BudgetTrackerTable.findOne({ _id: budgetId, userId });

      if (!budget) {
        return res.status(404).send({ message: "Budget plan not found or unauthorized" });
      }

      const updatedBudget = await BudgetTrackerTable.findByIdAndUpdate(
        budgetId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      return res.status(200).send({
        message: "Budget plan updated successfully",
        updatedBudget,
      });
    } catch (error) {
      console.error("Error updating budget:", error.message);
      return res.status(500).send({
        message: "Failed to update budget plan",
        error: error.message,
      });
    }
  }
);


export { router as BudgetController };
