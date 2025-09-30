"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteAccountModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ⚠️ Delete Account
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          This action is permanent and cannot be undone. All your data and
          history will be lost. Are you sure you want to continue?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
