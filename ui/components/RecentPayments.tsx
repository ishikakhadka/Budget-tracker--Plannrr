import React from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios.instance";
import { categoryIcons } from "@/constant/CategoryIcons";
import Image from "next/image";

interface Payment {
  title: string;
  type: string;
  amount: number;
  category?: string;
}

// Helper to capitalize first letter of title
const capitalizeTitle = (title: string) => {
  if (!title) return "";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const RecentPayments = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-payments"],
    queryFn: async () => {
      return await axiosInstance.post("/recent-payments", { limit: 2 });
    },
  });

  const payments: Payment[] = data?.data?.payments ?? [];

  if (isLoading) {
    return <p>Loading recent payments...</p>;
  }

  if (isError) {
    return <p>Failed to load payments. Please try again.</p>;
  }

  if (payments.length === 0) {
    return (
      <div className="relative w-full h-64">
        <div className="flex items-center">
          <ScheduleIcon />
          <h2 className="font-bold ml-1">RECENT PAYMENTS</h2>
        </div>

        <Image
          src="/no_payments.png"
          alt="no payments"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <ScheduleIcon />
        <h2 className="font-bold ml-1">RECENT PAYMENTS</h2>
      </div>

      <div className="flex gap-4 flex-wrap ">
        {payments.map((payment, index) => {
          const categoryKey = (payment.category ?? "other").toLowerCase();
          const IconComponent =
            categoryIcons[categoryKey] || categoryIcons["other"];

          return (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded-lg shadow-md flex flex-col justify-center items-center"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <IconComponent className="text-white w-6 h-6" />
              </div>
              <p className="text-lg text-black ">
                {capitalizeTitle(payment.title)}
              </p>
              <p
                className={`text-2xl font-bold ${
                  payment.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {payment.type === "income"
                  ? `+ ₹${Math.abs(payment.amount).toLocaleString()}`
                  : `- ₹${Math.abs(payment.amount).toLocaleString()}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentPayments;
