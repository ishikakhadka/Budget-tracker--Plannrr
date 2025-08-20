"use client";

import dayjs from "dayjs";
import axiosInstance from "@/lib/axios.instance";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import DeleteTransaction from "./DeleteTransactionDialog";
import { categoryIcons } from "@/constant/CategoryIcons";
import transactions from "@/images/transactions.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface IViewTransactionFormProps {
  _id: string;
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

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const ViewTransactionTable = () => {
  const router = useRouter();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-transaction-list"],
    queryFn: async () => await axiosInstance.post("/view/transaction"),
  });

  const TransactionList: IViewTransactionFormProps[] =
    data?.data?.Transaction ?? [];

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading transactions...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="body1"
        color="error"
        sx={{ textAlign: "center", mt: 5 }}
      >
        Failed to load transactions. Please try again later.
      </Typography>
    );
  }

  if (!TransactionList.length && TransactionList.length == 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Image
          src={transactions}
          alt="No Transaction"
          width={200}
          height={100}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pb: 6,
        pt: 6,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: "center",
          fontWeight: "bold",
          color: "#1a1f2e",
          borderBottom: "1px solid #ddd",
        }}
      >
        💳 Transaction History
      </Typography>

      {/* Responsive Layout */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          flexDirection: "column",
          gap: 2,
          px: 2,
          mt: 2,
        }}
      >
        {TransactionList.length === 0 ? (
          <Typography textAlign="center" py={4}>
            No transactions found.
          </Typography>
        ) : (
          TransactionList.map((txn) => (
            <Paper
              key={txn._id}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
                "&:hover": { backgroundColor: "#e0e7ff" },
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight="bold">
                  {capitalize(txn.title)}
                </Typography>
                <Typography
                  fontWeight="bold"
                  color={txn.type === "income" ? "green" : "red"}
                >
                  {txn.type === "income" ? "+" : "−"}₹
                  {txn.amount.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Chip
                  label={capitalize(txn.type)}
                  color={txn.type === "income" ? "success" : "error"}
                  size="small"
                />
                <Typography variant="body2">
                  {capitalize(txn.category)}
                </Typography>
                <Typography variant="body2">
                  {txn.date ? dayjs(txn.date).format("DD MMM YYYY") : "—"}
                </Typography>
              </Box>
              <Box mt={1}>
                <DeleteTransaction transactionId={txn._id} />
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Desktop Table */}
      <TableContainer
        component={Paper}
        sx={{
          display: { xs: "none", lg: "block" },
          maxWidth: 900,
          mx: "auto",
          mt: 3,
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          backgroundColor: "#ffffff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1a1f2e" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Title
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}></TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TransactionList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              TransactionList.map((txn) => (
                <TableRow
                  key={txn._id}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    "&:hover": {
                      backgroundColor: "#e0e7ff",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 40,
                          height: 35,
                          borderRadius: "50%",
                          backgroundColor: "#d1d5db",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {(() => {
                          const Icon =
                            categoryIcons[txn.category] ||
                            categoryIcons["other"];
                          return (
                            <Icon fontSize="small" sx={{ color: "#000" }} />
                          );
                        })()}
                      </Box>
                      <span>{capitalize(txn.title)}</span>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: txn.type === "income" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {txn.type === "income" ? "+" : "−"}₹
                    {txn.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={capitalize(txn.type)}
                      color={txn.type === "income" ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>{capitalize(txn.category)}</TableCell>
                  <TableCell>
                    {txn.date ? dayjs(txn.date).format("DD MMM YYYY") : "—"}
                  </TableCell>
                  <TableCell>
                    <DeleteTransaction transactionId={txn._id} />
                  </TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => {
                        router.push(`/edit-transaction?id=${txn._id}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewTransactionTable;
