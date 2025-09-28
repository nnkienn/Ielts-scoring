"use client";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { logout } from "@/store/Slices/authSlice";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Crown } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/signin"; // redirect về login
  };

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

        {/* Credits & Upgrade */}
        <div className="flex items-center gap-4">
          {/* Hiển thị credits */}
          {/* Hiển thị credits */}
          <span className="text-sm font-medium text-gray-700">
            Free: {user?.freeCredits ?? 0} LC
          </span>

          {/* Nếu freeCredits = 0 thì hiện nút Upgrade */}
          {(user?.freeCredits === 0) && (
            <Link
              href="/payment"
              className="flex items-center gap-1 bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-green-700 transition"
            >
              <Crown className="w-4 h-4" />
              Nâng Cấp Pro
            </Link>
          )}





          {/* User Menu */}
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
                  <p className="font-medium text-gray-700">{user?.email}</p>
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer">
                      Account details
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer flex justify-between items-center">
                      Dark mode
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600"></div>
                      </label>
                    </li>
                    <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                      Help Center
                    </li>
                    <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                      Contact us
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Logout
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
