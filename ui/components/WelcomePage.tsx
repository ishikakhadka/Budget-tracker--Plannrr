import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddCardIcon from "@mui/icons-material/AddCard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DashboardIcon from "@mui/icons-material/Dashboard";

const features = [
  {
    icon: <AddCardIcon className="text-teal-400 text-3xl mb-2" />,
    title: "Budget Planning",
    desc: "Easily plan your monthly or yearly budget and stay financially prepared.",
  },
  {
    icon: <DashboardIcon className="text-indigo-400 text-3xl mb-2" />,
    title: "Budget Tracking",
    desc: "Track your expenses, incomes, and stay within your set limits.",
  },
  {
    icon: <TrackChangesIcon className="text-pink-400 text-3xl mb-2" />,
    title: "Goal Setting",
    desc: "Set personal financial goals and monitor your progress easily.",
  },
  {
    icon: <QueryStatsIcon className="text-yellow-300 text-3xl mb-2" />,
    title: "Analytics",
    desc: "Visualize where your money goes with insightful charts and reports.",
  },
];

const WelcomePage = () => {
  return (
    <div className="w-full min-h-screen bg-[#1a1f2e] text-white p-6 flex flex-col items-center justify-center">
      <div className="text-center max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CurrencyRupeeIcon className="text-4xl text-yellow-400" />
          <h1 className="text-4xl font-bold">Welcome to Plannrr</h1>
        </div>
        <p className="text-gray-300 mb-6 text-lg">
          Your all-in-one financial companion to plan budgets, track expenses,
          set goals, and analyze spending.
        </p>

        {/* Features grid - hidden on small screens */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-2 gap-6 text-left mt-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-start">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
