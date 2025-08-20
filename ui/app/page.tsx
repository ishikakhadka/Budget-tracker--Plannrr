import LoginForm from "@/components/LoginForm";
import WelcomePage from "@/components/WelcomePage";
import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const page = () => {
  return (
    <div className="w-full h-screen bg-[#1a1f2e] text-white p-8 flex items-center">
      {/* Mobile wrapper: visible only on small screens, stacks vertically */}
      <div className="flex flex-col w-full max-w-sm mx-auto lg:hidden gap-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CurrencyRupeeIcon className="text-4xl text-yellow-400" />
          <h1 className="text-4xl font-bold">Welcome to Plannrr</h1>
        </div>
        <p className="text-gray-300 mb-6 text-lg">
          Your all-in-one financial companion to plan budgets, track expenses,
          set goals, and analyze spending.
        </p>
        <LoginForm />
      </div>

      {/* Desktop layout: visible only on large screens, side by side */}
      <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-around lg:w-full lg:p-0">
        <WelcomePage />
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
