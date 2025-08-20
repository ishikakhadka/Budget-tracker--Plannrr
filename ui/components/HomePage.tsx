"use client";
import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useRouter } from "next/navigation";
import RecentPayments from "./RecentPayments";

import BudgetCard, { IViewBudgetProps } from "./DisplayBudgetCard";
import Example from "./PieCharts";
import axiosInstance from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import { getProgressMessage } from "./ProgressMessage";

const HomePage = () => {
  const { data } = useQuery({
    queryKey: ["get-budget-list"],
    queryFn: async () => await axiosInstance.post("/view-budget"),
  });

  const BudgetList: IViewBudgetProps[] = data?.data?.Budget ?? [];

  const progressMessage = getProgressMessage(BudgetList);

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const capitalize = (str: string | null) => {
    if (!str) return "";
    return str.toUpperCase();
  };

  const router = useRouter();

  useEffect(() => {
    const fName = window.localStorage.getItem("firstName");
    const lName = window.localStorage.getItem("lastName");
    setFirstName(fName);
    setLastName(lName);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto pt-[30px] pb-[20px] px-2 md:px-4 lg:px-6 xl:px-10">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Section */}
        <div className="bg-gray-200 rounded-xl shadow-lg w-full lg:w-[60%] p-4 flex flex-col justify-start">
          <div className="gap-4 flex flex-col">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-6">
              {/* Card */}
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <h2 className="font-bold">DASHBOARD</h2>
                <div className="bg-gray-800 rounded-xl p-4 w-full lg:w-[300px] h-[150px]">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300 flex gap-1 items-center">
                      <CreditCardIcon />
                      <p>USER ID CARD</p>
                    </span>
                    <Chip
                      label="Active"
                      sx={{ backgroundColor: "#9ca3af", color: "black" }}
                    />
                  </div>
                  <div className="text-gray-300">
                    <p>9879 2832 4567 1234</p>
                  </div>
                  <div className="pt-6">
                    <p className="text-lg font-bold text-gray-300">
                      {capitalize(firstName)} {capitalize(lastName)}
                    </p>
                    <p className="text-xs text-gray-300">
                      REGISTERED SINCE 2020
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <RecentPayments />
            </div>

            {/* Budget Summary */}
            <div className="rounded-lg p-4 bg-gray-200 shadow-2xl mt-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Budget Summary
                </h3>
                <button
                  className="bg-gray-900 text-white hover:bg-gray-800 transition-all text-sm rounded-lg px-4 py-2 shadow-md w-full sm:w-auto"
                  onClick={() => {
                    router.push("/view-transaction");
                  }}
                >
                  VIEW ALL TRANSACTIONS
                </button>
              </div>

              <div className="mt-2">
                <BudgetCard />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-gray-200 rounded-xl shadow-lg w-full lg:w-[40%] p-4 flex flex-col justify-start">
          <div
            className="flex flex-col gap-2 mt-4 mb-4 p-4 rounded-xl shadow-lg 
                bg-gray-800 border-l-8 border-gray-600"
          >
            {/* Header with emoji */}
            <h1 className="font-semibold text-lg text-white">
              {progressMessage.includes("Great")
                ? "🎉 " + progressMessage
                : progressMessage.includes("Almost")
                ? "💪 " + progressMessage
                : progressMessage.includes("halfway")
                ? "👍 " + progressMessage
                : "🚀 " + progressMessage}
            </h1>

            <p className="text-gray-300 text-sm">
              Keep tracking your expenses to stay on budget.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 lg:pt-7 text-lg font-semibold text-gray-800 mb-2">
            <QueryStatsIcon />
            <h3>SPENDING OVERVIEW</h3>
          </div>
          <div className="w-full h-[250px] flex justify-center items-center">
            <Example />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
