import * as yup from "yup";

export const budgetPlanValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .max(30, "Title must be at most 30 characters")
    .required("Title is required"),

  currentBalance: yup
    .number()
    .typeError("Current balance must be a number")
    .min(0, "Current balance cannot be negative")
    .required("Current balance is required"),

  savingPlan: yup
    .number()
    .typeError("Saving plan must be a number")
    .min(0, "Saving plan cannot be negative")
    .required("Saving plan is required"),

  currentSavings: yup
    .number()
    .typeError("Current savings must be a number")
    .min(0, "Current savings cannot be negative")
    .required("Current savings is required"),

  period: yup
    .string()
    .oneOf(["weekly", "monthly", "quarterly", "yearly"], "Invalid period")
    .default("monthly"),

  startDate: yup.date().default(() => new Date()),

  description: yup.string().trim().notRequired(),
});
