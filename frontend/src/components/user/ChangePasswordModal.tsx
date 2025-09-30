"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({ open, onClose, onSubmit }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(oldPassword, newPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔒 Change Password</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter old password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter new password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
