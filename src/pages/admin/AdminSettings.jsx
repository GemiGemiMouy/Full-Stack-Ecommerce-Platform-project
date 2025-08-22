// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function AdminSettings() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);

    try {
      // Update display name if changed
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // If password fields are filled, validate and update password
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          setError("Please fill all password fields to change password.");
          setSaving(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setError("New password and confirmation do not match.");
          setSaving(false);
          return;
        }

        // Re-authenticate user with current password before updating password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!user) return <div>Please login to view settings.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Admin Settings</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Enter your display name"
            required
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
          />
        </div>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* Password Change Section */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h2>

        <div>
          <label htmlFor="currentPassword" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
