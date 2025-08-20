"use client";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";

import SettingsIcon from "@mui/icons-material/Settings";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import Person2Icon from "@mui/icons-material/Person2";
import { useRouter } from "next/navigation";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
const SideBar = () => {
  const router = useRouter();
  return (
    <aside className="w-20 h-full rounded-xl shadow-lg flex flex-col items-center pt-10 gap-8 justify-around">
      {/* Home */}
      <div className="relative group p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <HomeIcon
          className="!w-6 !h-6"
          onClick={() => {
            router.push("/home");
          }}
        />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
          Home
        </span>
      </div>

      {/* Add Card */}
      <div className="relative group p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <AddCardIcon
          className="!w-6 !h-6"
          onClick={() => {
            router.push("/add-transaction");
          }}
        />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
          Add Transaction
        </span>
      </div>
      {/* Add Budget*/}
      <div className="relative group p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <CurrencyBitcoinIcon
          className="!w-6 !h-6"
          onClick={() => {
            router.push("/budget");
          }}
        />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
         Create Budget Plan
        </span>
      </div>

      {/* Track Changes */}
      <div className="relative group p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <TrackChangesIcon className="!w-6 !h-6" />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
          View your goal
        </span>
      </div>

      {/* Person */}
      <div className="relative group p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <Person2Icon className="!w-6 !h-6" />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
          Profile
        </span>
      </div>

      {/* Settings */}
      <div className="relative group  p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
        <SettingsIcon className="!w-6 !h-6" />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
          Settings
        </span>
      </div>
    </aside>
  );
};

export default SideBar;
