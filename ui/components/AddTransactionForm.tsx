"use client";
import { IError } from "@/interface/error.interface";
import { transactionSchema } from "@/validation/transactionValidationSchema";
import axiosInstance from "@/lib/axios.instance";

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export interface IAddTransactionFormProps {
  title: string;
  amount: number;
  type: "income" | "expenses";
  category:
    | "entertainment"
    | "food"
    | "health and fitness"
    | "bills and utilities"
    | "grocery"
    | "feul"
    | "rent"
    | "other";
  description: string;
  date: Date;
}

const AddTransactionForm = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-transaction"],
    mutationFn: async (values: IAddTransactionFormProps) => {
      return await axiosInstance.post("/add/transaction", values);
    },
    onSuccess: () => {
      toast.success("Transaction added successfully");
      <CircularProgress />;
      router.push("/view-transaction");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });
  if (isPending) {
    return <CircularProgress />;
  }

  return (
    <Formik<IAddTransactionFormProps>
      initialValues={{
        title: "",
        amount: 0,
        type: "expenses",
        category: "other",
        description: "",
        date: new Date(),
      }}
      validationSchema={transactionSchema}
      onSubmit={(values: IAddTransactionFormProps) => {
        mutate(values);
        console.log("Submitted Values:", values);
      }}
    >
      {(formik) => (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 800,

            mx: "auto",
            margin: 6,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 4,
            py: 4,

            bgcolor: "#1a1f2e",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{ color: "#e6e2cf" /* soft off-white/cream for heading */ }}
          >
            Add New Transaction
          </Typography>

          {/* Title */}
          <FormControl fullWidth>
            <TextField
              label="Title"
              {...formik.getFieldProps("title")}
              variant="filled"
              fullWidth
              sx={{
                bgcolor: "#2c3142",
                borderRadius: 1,
                input: { color: "#e6e2cf" },
                "& .MuiInputLabel-root": { color: "#a0a0a0" },
              }}
            />
            {formik.touched.title && formik.errors.title && (
              <FormHelperText error>{formik.errors.title}</FormHelperText>
            )}
          </FormControl>

          {/* Type */}
          <FormControl
            fullWidth
            error={formik.touched.type && Boolean(formik.errors.type)}
            sx={{
              bgcolor: "#2c3142",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#a0a0a0" },
              "& .MuiSelect-select": { color: "#e6e2cf" },
            }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              {...formik.getFieldProps("type")}
              value={formik.values.type}
              onChange={formik.handleChange}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expenses">Expenses</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && (
              <FormHelperText error>{formik.errors.type}</FormHelperText>
            )}
          </FormControl>

          <div className="flex flex-row gap-3">
            {/* Amount */}
            <FormControl fullWidth>
              <TextField
                label="Amount"
                type="number"
                {...formik.getFieldProps("amount")}
                variant="filled"
                fullWidth
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
              />
              {formik.touched.amount && formik.errors.amount && (
                <FormHelperText error>{formik.errors.amount}</FormHelperText>
              )}
            </FormControl>
            {/* Date */}
            <FormControl fullWidth>
              <TextField
                label="Date"
                type="date"
                {...formik.getFieldProps("date")}
                value={formik.values.date} // this ensures it's a proper string
                onChange={formik.handleChange}
                variant="filled"
                fullWidth
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
              />
            </FormControl>
          </div>

          {/* Category */}
          <FormControl
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
            sx={{
              bgcolor: "#2c3142",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#a0a0a0" },
              "& .MuiSelect-select": { color: "#e6e2cf" },
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              {...formik.getFieldProps("category")}
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              <MenuItem value="entertainment">Entertainment</MenuItem>
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="health and fitness">Health and Fitness</MenuItem>
              <MenuItem value="bills and utilities">
                Bills and Utilities
              </MenuItem>
              <MenuItem value="grocery">Grocery</MenuItem>
              <MenuItem value="feul">Feul</MenuItem>
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="salary">Salary</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <FormHelperText error>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>

          {/* Description */}
          <FormControl fullWidth>
            <TextField
              label="Description"
              multiline
              rows={4}
              {...formik.getFieldProps("description")}
              variant="filled"
              fullWidth
              sx={{
                bgcolor: "#2c3142",
                borderRadius: 1,
                input: { color: "#e6e2cf" },
                "& .MuiInputLabel-root": { color: "#a0a0a0" },
              }}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error>{formik.errors.description}</FormHelperText>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#e6e2cf",
              color: "#1a1f2e",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#c7c3b0",
              },
            }}
            disabled={formik.isSubmitting}
          >
            Add Transaction
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default AddTransactionForm;
