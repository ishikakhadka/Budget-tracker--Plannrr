"use client";

import React, { useMemo } from "react";
import axiosInstance from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type TxnType = "income" | "expenses";
interface ITransaction {
  _id: string;
  title: string;
  amount: number | string;
  type: TxnType;
  category?: string;
  description?: string;
  date?: string | Date;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CF2",
  "#FF6B6B",
];

export default function TransactionsPieAnalysis() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-transaction-list"],
    queryFn: async () => axiosInstance.post("/view/transaction"),
  });

  const transactions = useMemo<ITransaction[]>(() => {
    return data?.data?.Transaction ?? [];
  }, [data]);
  const expenseTxns = useMemo(
    () => transactions.filter((t) => t.type === "expenses"),
    [transactions]
  );

  const categoryTotals = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const tx of expenseTxns) {
      const cat = (tx.category || "other").toLowerCase();
      const amt = Number(tx.amount) || 0;
      acc[cat] = (acc[cat] || 0) + amt;
    }
    return acc;
  }, [expenseTxns]);

  const pieData = useMemo(
    () =>
      Object.entries(categoryTotals).map(([name, value]) => ({ name, value })),
    [categoryTotals]
  );

  const totalSpent = useMemo(
    () => expenseTxns.reduce((s, t) => s + (Number(t.amount) || 0), 0),
    [expenseTxns]
  );
  const [topCategory, topValue] = useMemo(
    () =>
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] ?? ["—", 0],
    [categoryTotals]
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        width="100%"
      >
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (isError) {
    return (
        <Typography color="error" variant="body2">
          Error loading transactions.
        </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        mt:4,
        width: "100%", // ✅ fill parent width
        flex: 1, // ✅ allow growth inside flex layouts
        minWidth: 0, // ✅ prevent flex overflow shrinking issues
      }}
    >
    

      {pieData.length > 0 ? (
        // Wrapper must have explicit height for ResponsiveContainer
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 240 /* adjust as needed */,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart /* no fixed width/height here */>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => `₹${Number(v).toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No expense data to display.
        </Typography>
      )}

      <Divider sx={{ my: 1 }} />
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        rowGap={0.5}
        columnGap={1}
      >
        <Typography variant="caption" color="text.secondary">
          Total Spent
        </Typography>
        <Typography variant="caption">
          ₹{totalSpent.toLocaleString()}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Top Category
        </Typography>
        <Typography variant="caption">
          {topCategory}{" "}
          {topCategory !== "—" ? `(₹${topValue.toLocaleString()})` : ""}
        </Typography>
      </Box>
    </Box>
  );
}
