"use client";

import React, { useMemo } from "react";
import { Formik } from "formik";
import * as yup from "yup";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { IError } from "@/interface/error.interface";

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

interface ITransaction {
  _id: string;
  title: string;
  amount: number;
  type: "income" | "expense"; // server returns singular "expense"
  category?: string;
  description?: string;
  date: string; // ISO string from server
}

type FormValues = Omit<IAddTransactionFormProps, "date"> & { date: string };

const validationSchema = yup.object({
  title: yup.string().required("Title is required").max(60).trim(),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0, "Must be at least 0"),
  type: yup
    .mixed<"income" | "expenses">()
    .oneOf(["income", "expenses"])
    .required(),
  category: yup
    .mixed<FormValues["category"]>()
    .oneOf([
      "entertainment",
      "food",
      "health and fitness",
      "bills and utilities",
      "grocery",
      "feul",
      "rent",
      "other",
    ])
    .required(),
  description: yup.string().trim().default(""),
  date: yup
    .string()
    .required("Date is required")
    .test(
      "valid-date",
      "Invalid date",
      (v) => !!v && !Number.isNaN(new Date(v).getTime())
    ),
});

const EditTransactionForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id") ?? undefined;

  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-transaction-list"],
    queryFn: async () => axiosInstance.post("/view/transaction"),
  });

  const transactions = useMemo<ITransaction[]>(() => {
    return data?.data?.Transaction ?? [];
  }, [data]);

  // ✅ use find (not filter) and keep type safe; fallback to first if no id
  const transactionToEdit: ITransaction | undefined = useMemo(() => {
    if (transactions.length === 0) return undefined;
    if (selectedId) {
      return transactions.find((t) => t._id === selectedId) ?? transactions[0];
    }
    return transactions[0];
  }, [transactions, selectedId]);

  const toDateInput = (d?: string) => {
    try {
      const iso = new Date(d ?? Date.now()).toISOString();
      return iso.slice(0, 10);
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  };

  const initialValues: FormValues = {
    title: transactionToEdit?.title ?? "",
    amount: Number(transactionToEdit?.amount ?? 0),
    // map server 'expense' -> UI 'expenses'
    type: transactionToEdit?.type === "expense" ? "expenses" : "income",
    category: ((): FormValues["category"] => {
      const c = (transactionToEdit?.category || "other").toLowerCase();
      const allowed: FormValues["category"][] = [
        "entertainment",
        "food",
        "health and fitness",
        "bills and utilities",
        "grocery",
        "feul",
        "rent",
        "other",
      ];
      return (allowed as string[]).includes(c)
        ? (c as FormValues["category"])
        : "other";
    })(),
    description: transactionToEdit?.description ?? "",
    date: toDateInput(transactionToEdit?.date),
  };

  const { isPending, mutate } = useMutation({
    mutationKey: ["edit-transaction"],
    mutationFn: async (values: FormValues) => {
      if (!transactionToEdit?._id) throw new Error("Missing transaction id");

      // build payload exactly as your interface expects (date as Date, type as "income" | "expenses")
      const payload: IAddTransactionFormProps = {
        title: values.title,
        amount: Number(values.amount),
        type: values.type, // keep "income" | "expenses" (plural)
        category: values.category, // keep "feul" spelling to satisfy your schema
        description: values.description || "",
        date: new Date(values.date),
      };

      return await axiosInstance.put(
        `/edit/transaction/${transactionToEdit._id}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Transaction updated successfully");
      router.push("/home");
    },
    onError: (err: IError) => {
      console.error("Server says:", err?.response?.data);
      const msg =
        err?.response?.data?.message || "Failed to update transaction";
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ color: "#f44336", textAlign: "center", py: 4 }}>
        Failed to load transactions.
      </Box>
    );
  }

  if (!transactionToEdit) {
    return (
      <Box sx={{ color: "#e6e2cf", textAlign: "center", py: 4 }}>
        No transactions found to edit.
      </Box>
    );
  }

  return (
    <div className="flex justify-center items-center">
    <Formik<FormValues>
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => mutate(values)}
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
            justify:"center",
            items:"center",
            flexDirection: "column",
            gap: 2,
            px: isMobile ? 2 : 4,
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
            sx={{ color: "#e6e2cf", mb: 2 }}
          >
            Edit Transaction
          </Typography>

          {/* Row 1: Title + Amount */}
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            flexWrap="wrap"
          >
            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Title"
                variant="filled"
                {...formik.getFieldProps("title")}
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

            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Amount"
                type="number"
                variant="filled"
                {...formik.getFieldProps("amount")}
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
          </Box>

          {/* Row 2: Type + Category */}
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            flexWrap="wrap"
          >
            <FormControl
              fullWidth
              sx={{
                flex: 1,
                bgcolor: "#2c3142",
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "#a0a0a0" },
                "& .MuiSelect-select": { color: "#e6e2cf" },
              }}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                {...formik.getFieldProps("type")}
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expenses">Expense</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <FormHelperText error>{formik.errors.type}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                {...formik.getFieldProps("category")}
                value={formik.values.category}
                onChange={formik.handleChange}
                sx={{ bgcolor: "#2c3142", borderRadius: 1, color: "#e6e2cf" }}
              >
                {[
                  "entertainment",
                  "food",
                  "health and fitness",
                  "bills and utilities",
                  "grocery",
                  "feul",
                  "rent",
                  "other",
                ].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText error>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Row 3: Date */}
          <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Date"
                type="date"
                variant="filled"
                {...formik.getFieldProps("date")}
                value={formik.values.date}
                onChange={formik.handleChange}
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
                InputLabelProps={{ shrink: true }}
              />
              {formik.touched.date && formik.errors.date && (
                <FormHelperText error>{formik.errors.date}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Description */}
          <FormControl fullWidth>
            <TextField
              label="Description (Optional)"
              multiline
              rows={2}
              variant="filled"
              {...formik.getFieldProps("description")}
              sx={{
                bgcolor: "#2c3142",
                borderRadius: 1,
                textarea: { color: "#e6e2cf" },
                "& .MuiInputLabel-root": { color: "#a0a0a0" },
              }}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error>{formik.errors.description}</FormHelperText>
            )}
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || formik.isSubmitting}
            sx={{
              bgcolor: "#e6e2cf",
              color: "#1a1f2e",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#c7c3b0" },
            }}
          >
            {isPending ? "Saving..." : "Edit Transaction"}
          </Button>
        </Box>
      )}
    </Formik>
    </div>
  );
};

export default EditTransactionForm;
