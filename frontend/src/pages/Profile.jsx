import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaEdit, 
  FaArrowLeft, 
  FaCamera,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCircle,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

export const Profile = () => {
  const { user, logout, initialLoading, updateProfile, loading, changePassword } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    return status === "online" ? "bg-green-400" : "bg-gray-400";
  };

  const getStatusLabel = (status) => {
    return status === "online" ? "Online" : "Offline";
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength === 3) return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength === 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setError(null);
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
    setError(null);
  };

  const handleSave = async (field) => {
    try {
      setError(null);
      const value = editValues[field]?.trim();
      
      if (!value) {
        setError(`${field} cannot be empty`);
        return;
      }

      if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError("Please enter a valid email address");
        return;
      }

      if (field === "username" && (value.length < 3 || value.length > 30)) {
        setError("Username must be between 3 and 30 characters");
        return;
      }

      await updateProfile({ [field]: value });
      setEditingField(null);
      setEditValues({});
      setSuccess(`${field === "username" ? "Username" : "Email"} updated successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploadingPic(true);
    setError(null);

    try {
      // Compress and convert to base64
      const base64String = await compressImage(file);
      await updateProfile({ profilePic: base64String });
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploadingPic(false);
    }
  };


  const getAvatarDisplay = () => {
    if (user?.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={user.username}
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return (
      <span className="text-white text-5xl font-bold">
        {user?.username?.[0]?.toUpperCase() || "U"}
      </span>
    );
  };

  // Show loading skeleton only if we have no cached user data
  if (initialLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 animate-pulse">
              <div className="flex flex-col items-center mb-5">
                <div className="w-32 h-32 bg-slate-700/50 rounded-full mb-4"></div>
                <div className="h-8 w-48 bg-slate-700/50 rounded-lg mb-2"></div>
                <div className="h-4 w-32 bg-slate-700/50 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Modern Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/home"
            className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-300 group"
          >
            <div className="p-2 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-600/30 group-hover:bg-slate-700/50 transition-all duration-300">
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="max-w-2xl mx-auto mb-6 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl backdrop-blur-xl">
            {success}
          </div>
        )}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-xl">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative mb-2 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse scale-110"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-slate-700/50 overflow-hidden">
                    {getAvatarDisplay()}
                  </div>
                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPic || loading}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-800 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingPic ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaCamera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {/* Status Indicator */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-800 flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(user?.status || "offline")}`}></div>
                  </div>
                </div>
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {user?.username || "User"}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-slate-400 font-medium">Member since {formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <span>Profile Information</span>
              </h2>

              <div className="space-y-4">
                {/* Status Field - Read Only */}
                <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
                      <FaCircle className={`w-5 h-5 ${getStatusColor(user?.status || "offline")}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Status
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {getStatusLabel(user?.status || "offline")}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Status is automatically updated when you log in or out
                      </p>
                    </div>
                  </div>
                </div>

                {/* Username Field */}
                <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <FaUser className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Username
                      </p>
                      {editingField === "username" ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValues.username || ""}
                            onChange={(e) => setEditValues({ username: e.target.value })}
                            className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            autoFocus
                            maxLength={30}
                          />
                          <button
                            onClick={() => handleSave("username")}
                            disabled={loading}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <FaCheck className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <FaTimes className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-white">
                            {user?.username || "N/A"}
                          </p>
                          <button
                            onClick={() => handleEdit("username", user?.username)}
                            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaEdit className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                      <FaEnvelope className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address
                      </p>
                      {editingField === "email" ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={editValues.email || ""}
                            onChange={(e) => setEditValues({ email: e.target.value })}
                            className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSave("email")}
                            disabled={loading}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <FaCheck className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <FaTimes className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-white">
                            {user?.email || "N/A"}
                          </p>
                          <button
                            onClick={() => handleEdit("email", user?.email)}
                            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaEdit className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Created Field */}
                <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <FaCalendarAlt className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Account Created
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Updated Field */}
                {user?.updatedAt && user.updatedAt !== user.createdAt && (
                  <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300 group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all duration-300">
                        <FaEdit className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Last Updated
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {formatDate(user?.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Change Section */}
                <div className="bg-slate-700/30 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                        <FaLock className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Password
                        </p>
                        {!showPasswordForm ? (
                          <p className="text-lg font-semibold text-white">••••••••</p>
                        ) : (
                          <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
                            {/* Current Password */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.current ? "text" : "password"}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:border-blue-500"
                                  placeholder="Enter current password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>

                            {/* New Password */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.new ? "text" : "password"}
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:border-blue-500"
                                  placeholder="Enter new password"
                                  required
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                              {/* Password Strength Indicator */}
                              {passwordData.newPassword && (
                                <div className="mt-2">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-300 ${getPasswordStrength(passwordData.newPassword).color}`}
                                        style={{ width: `${(getPasswordStrength(passwordData.newPassword).strength / 5) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-xs font-semibold ${getPasswordStrength(passwordData.newPassword).color.replace('bg-', 'text-')}`}>
                                      {getPasswordStrength(passwordData.newPassword).label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Must be at least 6 characters
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.confirm ? "text" : "password"}
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                  className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 pr-10 text-white focus:outline-none ${
                                    passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                      ? "border-red-500"
                                      : "border-slate-600/50 focus:border-blue-500"
                                  }`}
                                  placeholder="Confirm new password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                              )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center space-x-2 pt-2">
                              <button
                                type="submit"
                                disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                              >
                                {loading ? (
                                  <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Changing...</span>
                                  </>
                                ) : (
                                  <>
                                    <FaCheck />
                                    <span>Change Password</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={handlePasswordCancel}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                    {!showPasswordForm && (
                      <button
                        onClick={() => {
                          setShowPasswordForm(true);
                          setError(null);
                          setSuccess(null);
                        }}
                        className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                      >
                        <FaEdit className="w-4 h-4 text-slate-400 hover:text-orange-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex-1 bg-slate-700/50 backdrop-blur-xl hover:bg-slate-600/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Go to Chat
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
