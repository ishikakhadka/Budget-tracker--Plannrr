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
import { IViewBudgetProps } from "./DisplayBudgetCard";

interface IAddBudgetFormProps {
  title: string;
  currentBalance: number;
  savingPlan?: number;
  currentSavings: number;
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string; // YYYY-MM-DD
  description?: string;
}

const budgetValidationSchema = yup.object({
  title: yup.string().required("Title is required").max(30).trim(),
  currentBalance: yup
    .number()
    .typeError("Current Balance must be a number")
    .required("Current Balance is required")
    .min(0, "Must be at least 0"),
  savingPlan: yup
    .number()
    .typeError("Saving Plan must be a number")
    .min(0, "Must be at least 0")
    .notRequired(),
  currentSavings: yup
    .number()
    .typeError("Current Savings must be a number")
    .required("Current Savings is required")
    .min(0, "Must be at least 0"),
  period: yup
    .string()
    .oneOf(["weekly", "monthly", "quarterly", "yearly"])
    .required("Period is required"),
  startDate: yup.string().required("Start Date is required"), // already shaped to YYYY-MM-DD
  description: yup.string().trim().notRequired(),
});

const EditBudgetForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id"); // optional ?id=<budgetId>

  // Fetch budgets to edit
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-budget-list"],
    queryFn: async () => {
      return await axiosInstance.post("/view-budget");
    },
  });

  const BudgetList = useMemo<IViewBudgetProps[]>(() => {
    return data?.data?.Budget ?? [];
  }, [data]);

  const budgetToEdit: IViewBudgetProps | undefined = useMemo(() => {
    if (!BudgetList.length) return undefined;
    if (selectedId) {
      return BudgetList.find((b) => b._id === selectedId) ?? BudgetList[0];
    }
    return BudgetList[0];
  }, [BudgetList, selectedId]);

  const toDateInput = (d: string | Date) => {
    if (!d) {
      return "";
    }
    try {
      const iso = new Date(d ?? Date.now()).toISOString();
      return iso.slice(0, 10);
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  };

  const initialValues: IAddBudgetFormProps = {
    title: budgetToEdit?.title ?? "",
    currentBalance: Number(budgetToEdit?.currentBalance ?? 0),
    savingPlan:
      budgetToEdit?.savingPlan !== undefined &&
      budgetToEdit?.savingPlan !== null
        ? Number(budgetToEdit.savingPlan)
        : undefined,
    currentSavings: Number(budgetToEdit?.currentSavings ?? 0),
    period:
      (budgetToEdit?.period as IAddBudgetFormProps["period"]) ?? "monthly",
    startDate: toDateInput(budgetToEdit?.startDate || new Date().toISOString()),
    description: budgetToEdit?.description ?? "",
  };

  const { isPending, mutate } = useMutation({
    mutationKey: ["budget-plan"],
    mutationFn: async (values: IAddBudgetFormProps) => {
      if (!budgetToEdit?._id) throw new Error("Missing budget id");
      // ✅ Use PUT with :id
      return await axiosInstance.put(
        `/edit-budget/${budgetToEdit._id}`,
        values
      );
    },
    onSuccess: () => {
      toast.success("Budget Plan updated successfully");
      router.push("/home");
    },
    onError: (error: IError) => {
      const msg =
        error?.response?.data?.message || "Failed to update Budget Plan";
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ color: "#f44336", textAlign: "center", py: 4 }}>
        Failed to load budget list.
      </Box>
    );
  }

  if (!budgetToEdit) {
    return (
      <Box sx={{ color: "#e6e2cf", textAlign: "center", py: 4 }}>
        No budgets found to edit.
      </Box>
    );
  }

  return (
    <Formik<IAddBudgetFormProps>
      initialValues={initialValues}
      enableReinitialize // <<< important to hydrate after data load
      validationSchema={budgetValidationSchema}
      onSubmit={(values) => {
        mutate(values);
        // console.log("Budget Submitted:", values);
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
            Edit Budget Plan
          </Typography>

          {/* Row 1: Title + Current Balance */}
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
                label="Current Balance"
                type="number"
                variant="filled"
                {...formik.getFieldProps("currentBalance")}
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
              />
              {formik.touched.currentBalance &&
                formik.errors.currentBalance && (
                  <FormHelperText error>
                    {formik.errors.currentBalance}
                  </FormHelperText>
                )}
            </FormControl>
          </Box>

          {/* Row 2: Saving Plan + Current Savings */}
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            flexWrap="wrap"
          >
            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Saving Plan (Optional)"
                type="number"
                variant="filled"
                {...formik.getFieldProps("savingPlan")}
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
              />
              {formik.touched.savingPlan && formik.errors.savingPlan && (
                <FormHelperText error>
                  {formik.errors.savingPlan}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Current Savings"
                type="number"
                variant="filled"
                {...formik.getFieldProps("currentSavings")}
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
              />
              {formik.touched.currentSavings &&
                formik.errors.currentSavings && (
                  <FormHelperText error>
                    {formik.errors.currentSavings}
                  </FormHelperText>
                )}
            </FormControl>
          </Box>

          {/* Row 3: Period + Start Date */}
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
              error={formik.touched.period && Boolean(formik.errors.period)}
            >
              <InputLabel>Period</InputLabel>
              <Select
                label="Period"
                {...formik.getFieldProps("period")}
                value={formik.values.period}
                onChange={formik.handleChange}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
              {formik.touched.period && formik.errors.period && (
                <FormHelperText error>{formik.errors.period}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ flex: 1 }}>
              <TextField
                label="Start Date"
                type="date"
                variant="filled"
                {...formik.getFieldProps("startDate")}
                value={formik.values.startDate}
                onChange={formik.handleChange}
                sx={{
                  bgcolor: "#2c3142",
                  borderRadius: 1,
                  input: { color: "#e6e2cf" },
                  "& .MuiInputLabel-root": { color: "#a0a0a0" },
                }}
                InputLabelProps={{ shrink: true }}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <FormHelperText error>{formik.errors.startDate}</FormHelperText>
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

          {/* Submit Button */}
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
            {isPending ? "Saving..." : "Edit Budget Plan"}
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default EditBudgetForm;
