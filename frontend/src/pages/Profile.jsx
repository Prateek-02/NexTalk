import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaArrowLeft } from "react-icons/fa";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative mb-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse scale-110"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-slate-700/50">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-400 border-4 border-slate-800 rounded-full shadow-lg"></div>
                </div>
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {user?.username || "User"}
                </h1>
                <p className="text-slate-400 font-medium">Member since {formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <span>Profile Information</span>
              </h2>

              <div className="space-y-4">
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
                      <p className="text-lg font-semibold text-white">
                        {user?.username || "N/A"}
                      </p>
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
                      <p className="text-lg font-semibold text-white">
                        {user?.email || "N/A"}
                      </p>
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
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

