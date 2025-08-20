import mongoose from "mongoose";

const budgetPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      maxlength: 30,
      required: true,
      trim: true,
    },

    currentBalance: {
      type: Number,
      required: true,
      min: 0,
    },

    savingPlan: {
      type: Number,
      min: 0,
    },

    currentSavings: {
      type: Number,
      required: true,
      default: 0,
    },

    period: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const BudgetTrackerTable = mongoose.model("Budget", budgetPlanSchema);
