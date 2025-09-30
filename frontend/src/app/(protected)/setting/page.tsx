"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { fetchMe, changePassword, deleteUser } from "@/store/Slices/userSlice";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";
import DeleteAccountModal from "@/components/user/DeleteAccountModal";
import { logout } from "@/store/Slices/authSlice";

export default function SettingPage() {
  const dispatch = useAppDispatch();
  const { profile: user, loading } = useAppSelector((s) => s.user);

  const [openChangePwd, setOpenChangePwd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
  };

  const handleDeleteAccount = async () => {
    await dispatch(deleteUser()).unwrap();
    dispatch(logout()); // clear redux + localstorage
    window.location.href = "/signin"; // redirect login
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-700">⚙️ Settings</h1>
          <p className="text-sm text-teal-700">Manage your account and subscription</p>
        </section>

        {/* Content */}
        <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow border p-8">
            {loading ? (
              <p className="text-gray-500">⏳ Loading profile...</p>
            ) : (
              <>
                {/* Avatar + Info */}
                <div className="flex flex-col items-center mb-8">
                  <img
                    src={user?.avatar || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-teal-100 shadow-sm object-cover"
                  />
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Verified Email</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user?.email} <span className="text-green-600">✔</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">Subscription</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.paidCredits && user.paidCredits > 0 ? "Pro" : "Free"}
                      </p>
                    </div>
                  </div>

                  {/* Account settings */}
                  <div className="pl-6 border-l space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Account</h2>
                    {!user?.googleId ? (
                      <button
                        onClick={() => setOpenChangePwd(true)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                      >
                        🔒 Change Password
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Password managed via Google</p>
                    )}

                    <button
                      onClick={() => setOpenDelete(true)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                    >
                      🗑 Delete Account
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Modals */}
      <ChangePasswordModal
        open={openChangePwd}
        onClose={() => setOpenChangePwd(false)}
        onSubmit={handleChangePassword}
      />
      <DeleteAccountModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
