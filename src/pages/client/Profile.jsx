import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { updateProfile, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleUpdate = async () => {
    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword) return;
      await updatePassword(user, newPassword);
      setMessage("Password changed!");
    } catch (error) {
      console.error(error);
      setMessage("Password update failed. Try re-login.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h2>

      {message && <p className="mb-4 text-indigo-600 dark:text-indigo-400">{message}</p>}

      <div className="flex flex-col space-y-4">
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Profile Picture URL</label>
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Update Profile
        </button>

        {newPassword && (
          <button
            onClick={handleChangePassword}
            className="w-full py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            Change Password
          </button>
        )}
      </div>
    </div>
  );
}
