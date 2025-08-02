import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock } from 'react-feather';

export default function UpdateCredentials() {
  // Email Update State
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-email`,
        { newEmail, currentPassword: emailPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmailMessage('Email updated successfully');
      setNewEmail('');
      setEmailPassword('');
    } catch (err) {
      setEmailError(err.response?.data?.error || 'Failed to update email');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Update Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Mail className="text-blue-600" size={18} />
          </div>
          <h2 className="text-xl font-semibold">Update Email Address</h2>
        </div>
        
        {emailMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 border border-green-100">
            {emailMessage}
          </div>
        )}
        {emailError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-100">
            {emailError}
          </div>
        )}

        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showEmailPassword ? 'text' : 'password'}
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowEmailPassword((prev) => !prev)}
              >
                {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
          >
            <Mail className="mr-2" size={16} />
            Update Email
          </button>
        </form>
      </div>

      {/* Password Update Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <Lock className="text-purple-600" size={18} />
          </div>
          <h2 className="text-xl font-semibold">Change Password</h2>
        </div>
        
        {passwordMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 border border-green-100">
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-100">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrent((prev) => !prev)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center"
          >
            <Lock className="mr-2" size={16} />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}