"use client";
import SideBar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import toast, { Toaster } from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/" || pathname === "/auth/register";

  const logOut = () => {
    localStorage.clear();
    router.replace("/");
    toast.success("Logged out successfully.");
  };

  if (isAuthPage) {
    return (
      <div className="bg-[#1a1f2e] text-white p-8 flex flex-col items-center justify-center min-h-screen">
        <Toaster />
        {children}
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen h-auto w-full flex flex-col shadow-lg relative">
      <Toaster />

      {/* Mobile Header - fixed height 64px (h-16) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-300 z-50 p-3 shadow-md flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center shadow-md">
            <CurrencyRupeeIcon className="w-5 h-5 text-[#e6e2cf]" />
          </div>
          <h5 className="text-xl font-bold text-black drop-shadow-sm">
            Plannrr
          </h5>
        </div>
        <div className="p-3 rounded-lg hover:bg-gray-400 transition cursor-pointer">
          <NotificationsIcon className="!w-6 !h-6 text-black" />
        </div>
      </div>

      {/* Desktop Header - fixed height 64px */}
      <div className="hidden lg:flex absolute left-4 top-4 flex-col sm:flex-row sm:items-center gap-4 w-[calc(100%-32px)] sm:pr-6 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center shadow-md">
            <CurrencyRupeeIcon className="w-5 h-5 text-[#e6e2cf]" />
          </div>
          <div className="flex flex-col leading-none">
            <h5 className="text-xl font-bold text-black drop-shadow-sm">
              Plannrr
            </h5>
            <p className="text-xs text-black italic -mt-1">
              Plan smart, spend smarter
            </p>
          </div>
        </div>

        <div className="flex-grow mx-6">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full max-w-md px-3 py-1.5 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-black hover:text-white">
            <NotificationsIcon className="!w-6 !h-6" />
          </div>
          <button
            className="bg-black text-white text-sm font-semibold px-4 py-1 rounded-md hover:bg-gray-700 transition"
            type="button"
            onClick={() => router.push("/budget")}>
            Create Budget Plan
          </button>

          <button
            className="bg-transparent border-2 border-black text-black text-sm font-semibold px-4 py-1 rounded-md hover:bg-black hover:text-white transition"
            type="button"
            onClick={logOut}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area - scrollable */}
      <main className="flex-grow pt-6 pb-14 ">
        <div className="flex flex-col lg:flex-row items-start justify-center h-full w-full p-4 gap-4 mt-0">
          {/* Sidebar - Desktop only */}
          <div className="hidden pt-16 lg:block h-full">
            <SideBar />
          </div>

          {/* Main page content */}
          <div className="flex-grow w-full overflow-auto lg:w-auto bg-transparent rounded-none lg:rounded-lg p-0 lg:p-4 min-h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - fixed height 56px (h-14) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-300 border-t border-gray-400 flex justify-around items-center p-2 z-50 h-14">
        <button
          className="flex flex-col items-center p-2 text-xs"
          onClick={() => router.push("/home")}>
          <HomeIcon className="!w-6 !h-6 text-black" />
          <span>Home</span>
        </button>
        <button
          className="flex flex-col items-center p-2 text-xs"
          onClick={() => router.push("/add-transaction")}>
          <AddCardIcon className="!w-6 !h-6 text-black" />
          <span>Add Transactions</span>
        </button>
        <button
          className="flex flex-col items-center p-2 text-xs"
          onClick={() => router.push("/budget")}>
          <CurrencyBitcoinIcon className="!w-6 !h-6 text-black" />
          <span>Add Budget Plan</span>
        </button>
        <button
          className="flex flex-col items-center p-2 text-xs"
          onClick={() => router.push("/goals")}>
          <TrackChangesIcon className="!w-6 !h-6 text-black" />
          <span>Goals</span>
        </button>
        <button
          className="flex flex-col items-center p-2 text-xs"
          onClick={logOut}>
          <LogoutIcon className="!w-6 !h-6 text-black" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
