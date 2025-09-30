"use client";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { logout } from "@/store/Slices/authSlice";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Crown, Settings, HelpCircle, CreditCard, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/grade": "Grade Writing",
  "/grade-list": "Grade History",
  "/payment-history": "Payment History",
  "/translate": "Translate Tool",
  "/setting": "Settings",
};

export default function PrivateNavbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/signin";
  };

  const pageTitle = pageTitles[pathname] || "";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 shadow bg-white h-16 flex items-center">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div>
          <Link href="/homepage" className="flex items-center gap-2 min-w-0">
            <img
              src="/images/imageLogoNavbar.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-gray-400 font-bold text-lg sm:text-2xl truncate">
              IELTS<span className="text-green-600">Scoring</span>
            </span>
          </Link>
        </div>

        {/* Title (ẩn ở homepage) */}
        {pageTitle && (
          <div className="hidden md:block text-lg font-semibold text-slate-800 tracking-tight">
            {pageTitle}
          </div>
        )}

        {/* Credits & Upgrade + User menu */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Free: {user?.freeCredits ?? 0} LC
          </span>

          {user?.freeCredits === 0 && (
            <Link
              href="/payment"
              className="flex items-center gap-1 bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-green-700 transition"
            >
              <Crown className="w-4 h-4" />
              Nâng Cấp Pro
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200"
            >
              <FaUserCircle className="w-full h-full text-gray-500" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border text-sm z-50">
                <div className="px-4 py-2 border-b">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/setting"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                      >
                        <Settings size={16} /> Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/help"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                      >
                        <HelpCircle size={16} /> Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/payment-history"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                      >
                        <CreditCard size={16} /> Payment History
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
