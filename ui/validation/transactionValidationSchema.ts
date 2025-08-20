import * as yup from "yup";

export const transactionSchema = yup.object({
  title: yup.string().required("Title is required").trim().max(255),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .min(0, "Amount must be positive")
    .required("Amount is required"),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      [
        "entertainment",
        "food",
        "health and fitness",
        "bills and utilities",
        "grocery",
        "feul",
        "salary",
        "rent",
        "other",
      ],
      "Invalid category"
    ),
  date: yup.date().default(() => new Date()),

  type: yup
    .string()
    .trim()
    .required("Type is required")
    .oneOf(["income", "expenses"], "Type must be either income or expenses"),
  description: yup
    .string()
    .trim()
    .min(0)
    .max(1000, "Maximum 1000 characters")
    .optional(),
});
