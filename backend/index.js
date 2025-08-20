import express from "express";
import connectDB from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import cors from "cors";
import { transactionController } from "./transaction/transaction.controller.js";
import { BudgetController } from "./budget/budget.controller.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://budget-tracker-plannrr.vercel.app",
    ],
  })
);
await connectDB();
app.use(userController);
app.use(transactionController);
app.use(BudgetController);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
