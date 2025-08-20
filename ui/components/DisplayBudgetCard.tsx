"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import FlagIcon from "@mui/icons-material/Flag";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios.instance";
import Image from "next/image";
import budgets from "@/images/budgets.png";
import { useRouter } from "next/navigation";

export interface IViewBudgetProps {
  _id: string;
  title: string;
  currentBalance: number;
  savingPlan?: number;
  currentSavings: number;
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  description?: string;
}

const BudgetCard = () => {
  const router = useRouter();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-budget-list"],
    queryFn: async () => await axiosInstance.post("/view-budget"),
  });

   const BudgetList: IViewBudgetProps[] = data?.data?.Budget ?? [];

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading budgets...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="body1"
        color="error"
        sx={{ textAlign: "center", mt: 5 }}>
        Failed to load budgets. Please try again later.
      </Typography>
    );
  }

  if (!BudgetList.length && BudgetList.length==0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          gap: 2, 
          mt: 3,
        }}>
        <Image src={budgets} alt="No Budget" width={150} height={100} />

        <button
          className="bg-gray-900 text-white hover:bg-gray-800 transition-all text-sm rounded-lg px-4 py-2 shadow-md"
          onClick={() => {
            router.push("/budget");
          }}>
          ADD BUDGET PLAN
        </button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        px: 2,
        maxWidth: 700,
        mx: "auto",
        mt: 4,
      }}>
      {BudgetList.map(
        ({
          _id,
          title,
          currentBalance,
          savingPlan,
          currentSavings,
          period,
          startDate,
          description,
        }) => {
          const progress = savingPlan
            ? Math.min((currentSavings / savingPlan) * 100, 100)
            : 0;

          return (
            <Card
              key={_id}
              elevation={6}
              sx={{
                borderRadius: 3,
                backgroundColor: "rgba(33, 41, 61, 0.95)",
                backdropFilter: "blur(5px)",
                color: "#f0f0f5",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1.5, sm: 2 },
                  }}>
                  {/* Left Section */}
                  <Box sx={{ flex: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="500"
                      sx={{
                        color: "#a0c4ff",
                        textShadow: "0 0 5px rgba(160, 196, 255, 0.8)",
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}>
                      {title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        mb: 1.5,
                        flexWrap: "wrap",
                        color: "#cfd8dc",
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}>
                        <EventNoteIcon
                          fontSize="small"
                          sx={{
                            color: "#80deea",
                            fontSize: { xs: 16, sm: 20 },
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}>
                        <FlagIcon
                          fontSize="small"
                          sx={{
                            color: "#80deea",
                            fontSize: { xs: 16, sm: 20 },
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                          {dayjs(startDate).format("DD MMM YYYY")}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                      }}>
                      <InfoBlock
                        icon={
                          <AccountBalanceWalletIcon
                            sx={{
                              color: "#4caf50",
                              fontSize: { xs: 20, sm: 24 },
                            }}
                          />
                        }
                        label="Current Balance"
                        value={`₹${currentBalance.toLocaleString()}`}
                        color="#81c784"
                      />
                      <InfoBlock
                        icon={
                          <SavingsIcon
                            sx={{
                              color: "#ff7043",
                              fontSize: { xs: 20, sm: 24 },
                            }}
                          />
                        }
                        label="Current Savings"
                        value={`₹${currentSavings.toLocaleString()}`}
                        color="#ff8a65"
                      />
                      <InfoBlock
                        icon={
                          <TrendingUpIcon
                            sx={{
                              color: "#f44336",
                              fontSize: { xs: 20, sm: 24 },
                            }}
                          />
                        }
                        label="Saving Target"
                        value={`₹${(savingPlan ?? 0).toLocaleString()}`}
                        color="#ef5350"
                      />
                    </Box>
                  </Box>

                  {/* Right Section */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      mt: { xs: 2, md: 0 },
                    }}>
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 10,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #4caf50, #81c784)",
                          },
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mt: 1,
                          textAlign: "right",
                          fontWeight: "600",
                          color: progress > 70 ? "#4caf50" : "#f44336",
                          fontSize: { xs: "0.75rem", sm: "0.85rem" },
                        }}>
                        {progress.toFixed(0)}%
                      </Typography>
                      
                    </Box>

                    {description && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: "italic",
                          color: "#ccc",
                          pt: 1,
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        }}>
                        {description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        }
      )}
    </Box>
  );
};

const InfoBlock = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
        }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{
          color,
          textShadow: `0 0 3px ${color}`,
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
        }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default BudgetCard;
