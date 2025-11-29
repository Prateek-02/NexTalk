import { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUserPlus, FaKey, FaUser } from "react-icons/fa";

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await registerUser(form.username, form.email, form.password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden flex items-center justify-center p-6">
      {/* Modern Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Glassmorphism Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Chat Bubble Shapes */}
        <div className="absolute top-24 right-32 w-8 h-8 bg-blue-400/30 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-40 left-20 w-12 h-8 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 right-24 w-10 h-6 bg-pink-400/30 rounded-full animate-bounce delay-1200"></div>
        
        {/* Floating Message Icons */}
        <div className="absolute top-1/4 left-12 animate-float">
          <div className="w-16 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl rounded-bl-sm border border-blue-300/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 right-16 animate-float delay-1000">
          <div className="w-20 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl rounded-br-sm border border-purple-300/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }, (_, i) => (
              <div key={i} className="border border-blue-300/20"></div>
            ))}
          </div>
        </div>
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in">
        {/* Header with Modern Logo */}
        <div className="text-center mb-12 animate-slide-in-left">
          {/* Modern Chat Icon Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse scale-110"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-slate-600/30 group hover:scale-105 transition-all duration-500 mx-auto w-fit">
              {/* Chat Bubble Stack */}
              <div className="relative w-16 h-16">
                {/* Back bubble */}
                <div className="absolute top-2 right-0 w-12 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rounded-tr-sm opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></div>
                {/* Front bubble */}
                <div className="absolute top-0 left-0 w-14 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl rounded-bl-sm shadow-xl group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform duration-300 flex items-center justify-center">
                  <FaUserPlus className="text-white text-lg" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-delay relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent blur-sm scale-110 opacity-50"></div>
            <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Join NexTalk
            </span>
          </h1>
          <p className="text-xl text-slate-300/90 animate-fade-in-delay-2 font-medium">
            Create your account and start connecting
          </p>
        </div>

        {/* Form with Enhanced Glassmorphism */}
        <div className="bg-slate-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-slate-600/30 relative overflow-hidden animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          <div className="relative space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Field */}
              <div className="animate-fade-in">
                <label className="text-sm font-semibold text-white/90 block mb-3">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <FaUser className="text-white text-xs" />
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-4 py-4 border border-slate-600/30 rounded-2xl bg-slate-700/30 backdrop-blur-xl placeholder-slate-400 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-lg"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Email Field */}
              <div className="animate-fade-in">
                <label className="text-sm font-semibold text-white/90 block mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <FaUserPlus className="text-white text-xs" />
                    </div>
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-14 pr-4 py-4 border border-slate-600/30 rounded-2xl bg-slate-700/30 backdrop-blur-xl placeholder-slate-400 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-lg"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-delay">
                <label className="text-sm font-semibold text-white/90 block mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <FaKey className="text-white text-xs" />
                    </div>
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-14 pr-4 py-4 border border-slate-600/30 rounded-2xl bg-slate-700/30 backdrop-blur-xl placeholder-slate-400 text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10 text-lg"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="animate-fade-in-delay-2">
                <label className="text-sm font-semibold text-white/90 block mb-3">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <FaKey className="text-white text-xs" />
                    </div>
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-14 pr-4 py-4 border border-slate-600/30 rounded-2xl bg-slate-700/30 backdrop-blur-xl placeholder-slate-400 text-white focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/10 text-lg"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-6 py-4 rounded-2xl flex items-center space-x-3 backdrop-blur-xl animate-fade-in-delay-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 shadow-2xl hover:shadow-purple-500/25 overflow-hidden text-lg group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </span>
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-600/20 animate-fade-in-delay-3">
              <p className="text-slate-400 mb-4">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-slate-300 hover:text-white font-semibold transition-all duration-300 group"
              >
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white">
                  Sign in instead
                </span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8 animate-fade-in-delay-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};